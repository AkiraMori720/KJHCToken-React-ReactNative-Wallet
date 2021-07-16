import {BigNumber} from 'bignumber.js';
import {ec as Ec} from 'elliptic';
import ApiCaller from './api-caller';
import utils from '../../utils/Ethererum';

const secp256k1 = new Ec('secp256k1');

const defaultGasLimit = 1500000;

const transactionFields = [
    {name: 'nonce', maxLength: 32},
    {name: 'gasPrice', maxLength: 32},
    {name: 'gasLimit', maxLength: 32},
    {name: 'to', length: 20},
    {name: 'value', maxLength: 32},
    {name: 'data'},
];

export const EtherJSONRPC = {
    processRequest(methodName, params) {
        const requestData = {
            method: methodName,
            params,
            id: 42,
            jsonrpc: '2.0',
        };

        return JSON.stringify(requestData);
    },

    fetchJSON(url, json) {
        return new Promise((resolve, reject) => {
            const headers = {};
            let apiPromise = null;
            if (json) {
                headers['Content-Type'] = 'application/json';
                apiPromise = ApiCaller.post(url, json, true, {'Content-Type': 'application/json'});
            } else {
                apiPromise = ApiCaller.get(url, {});
            }

            return apiPromise.then((res) => {
                if (res.data.error) {
                    return reject(res.data.error);
                }
                return resolve(res.data.result);
            });
        });
    },

    hexStripZeros(value) {
        let v = value;
        while (v.length > 3 && v.substring(0, 3) === '0x0') {
            v = `0x${v.substring(3)}`;
        }
        return v;
    },

    getTransaction(transaction) {
        const result = {};

        // Some nodes (INFURA ropsten INFURA mainnet is fine) don't like extra zeros.
        const fields = ['gasLimit', 'gasPrice', 'nonce', 'value'];
        fields.forEach((k) => {
            if (!result[k]) {
                return;
            }
            result[k] = hexStripZeros(result[k]);
        });

        // Transform "gasLimit" to "gas"
        if (result.gasLimit !== null && result.gas === null) {
            result.gas = result.gasLimit;
            delete result.gasLimit;
        }

        return result;
    },

    checkBlockTag(blockTag) {
        if (blockTag == null) {
            return 'latest';
        }

        if (blockTag === 'earliest') {
            return '0x0';
        }

        if (blockTag === 'latest' || blockTag === 'pending') {
            return blockTag;
        }

        if (typeof (blockTag) === 'number') {
            return `0x${new BigNumber(blockTag).toString(16)}`;
        }

        throw new Error('invalid blockTag');
    },

    call(url = '', methodName, params) {
        let requestData = {};

        switch (methodName) {
            case 'getBlockNumber':
                requestData = this.processRequest('eth_blockNumber', []);
                break;

            case 'getGasPrice':
                requestData = this.processRequest('eth_gasPrice', []);
                break;

            case 'getBalance':
                requestData = this.processRequest('eth_getBalance', [params.address.toLowerCase(), checkBlockTag(params.blockTag)]);
                break;

            case 'getTransactionCount':
                requestData = this.processRequest('eth_getTransactionCount', [params.address.toLowerCase(), checkBlockTag(params.blockTag)]);
                break;

            case 'getCode':
                requestData = this.processRequest('eth_getCode', [params.address.toLowerCase(), checkBlockTag(params.blockTag)]);
                break;

            case 'getStorageAt':
                requestData = this.processRequest('eth_getStorageAt', [params.address.toLowerCase(), params.position, checkBlockTag(params.blockTag)]);
                break;

            case 'sendTransaction':
                requestData = this.processRequest('eth_sendRawTransaction', [params.signedTransaction]);
                break;

            case 'getBlock':
                if (params.blockTag) {
                    requestData = this.processRequest('eth_getBlockByNumber', [checkBlockTag(params.blockTag), false]);
                } else if (params.blockHash) {
                    requestData = this.processRequest('eth_getBlockByHash', [params.blockHash, false]);
                }
                return Promise.reject(new Error('invalid block tag or block hash'));

            case 'getTransaction':
                requestData = this.processRequest('eth_getTransactionByHash', [params.transactionHash]);
                break;

            case 'getTransactionReceipt':
                requestData = this.processRequest('eth_getTransactionReceipt', [params.transactionHash]);
                break;

            case 'call':
                requestData = this.processRequest('eth_call', [this.getTransaction(params.transaction), 'latest']);
                break;

            case 'estimateGas':
                requestData = this.processRequest('eth_estimateGas', [this.getTransaction(params.transaction)]);
                break;

            default:
                break;
        }

        return fetchJSON(url, requestData);
    },

    getGasPrice(url) {
        return call(url, 'getGasPrice').then(v => new BigNumber(v, 16));
    },

    estimateGas(url, transaction) {
        const calculate = {};

        const fields = ['from', 'to', 'data', 'value'];
        fields.forEach((key) => {
            if (transaction[key] == null) {
                return;
            }
            calculate[key] = transaction[key];
        });

        return call(url, 'estimateGas', {transaction: calculate}).then(v => new BigNumber(v, 16));
    },

    getTransactionCount(url, address, blockTag = 'pending') {
        return call(url, 'getTransactionCount', {address, blockTag}).then(v => new BigNumber(v, 16));
    },

    sendTransaction(url, transaction, fromAddress, chainId, privateKey) {
        if (!transaction || typeof (transaction) !== 'object') {
            throw new Error('invalid transaction object');
        }

        const gasLimit = transaction.gasLimit || defaultGasLimit;
        const gasPricePromise = transaction.gasPrice ? Promise.resolve(transaction.gasPrice) : this.getGasPrice(url);
        const noncePromise = transaction.nonce
            ? Promise.resolve(transaction.nonce)
            : this.getTransactionCount(url, fromAddress).then(v => Number(v.toString(10)));
        const data = utils.hexlify(transaction.data || '0x');
        const value = utils.hexlify(transaction.value || 0);

        return Promise.all([gasPricePromise, noncePromise]).then((results) => {
            const signedTransaction = this.signTransaction({
                to: transaction.to,
                data,
                gasLimit,
                gasPrice: results[0],
                nonce: results[1],
                value,
                chainId,
            }, chainId, privateKey);

            return call(url, 'sendTransaction', {signedTransaction: utils.hexlify(signedTransaction)});
        });
    },

    signDigest(digest, privateKey) {
        if (!privateKey) {
            throw new Error('Private key not found');
        }
        const keyPair = secp256k1.keyFromPrivate(privateKey);
        const signature = keyPair.sign(utils.arrayify(digest), {canonical: true});
        return {
            recoveryParam: signature.recoveryParam,
            r: `0x${signature.r.toString(16)}`,
            s: `0x${signature.s.toString(16)}`,
        };
    },

    signTransaction(_transaction, _chainId, privateKey) {
        const transaction = _transaction;
        const raw = [];

        if (transaction.gas) {
            transaction.gasLimit = transaction.gas;
            delete (transaction.gas);
        }
        const chainId = transaction.chainId || _chainId;

        transactionFields.forEach((fieldInfo) => {
            let value = transaction[fieldInfo.name] || ([]);
            value = utils.arrayify(utils.hexlify(value), fieldInfo.name);

            // Fixed-width field
            if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
                const error = new Error(`invalid ${fieldInfo.name}`);
                error.reason = 'wrong length';
                error.value = value;
                throw error;
            }

            // Variable-width (with a maximum)
            if (fieldInfo.maxLength) {
                value = utils.stripZeros(value);
                if (value.length > fieldInfo.maxLength) {
                    const error = new Error(`invalid ${fieldInfo.name}`);
                    error.reason = 'too long';
                    error.value = value;
                    throw error;
                }
            }

            raw.push(utils.hexlify(value));
        });

        if (chainId) {
            raw.push(utils.hexlify(chainId));
            raw.push('0x');
            raw.push('0x');
        }

        const digest = utils.keccak256(utils.RLP.encode(raw));
        const signature = this.signDigest(digest, privateKey);

        let v = 27 + signature.recoveryParam;
        if (chainId) {
            raw.pop();
            raw.pop();
            raw.pop();
            v += chainId * 2 + 8;
        }

        raw.push(utils.hexlify(v));
        raw.push(signature.r);
        raw.push(signature.s);

        return utils.RLP.encode(raw);
    },

    signMessage(message, privateKey) {
        const sig = this.signDigest(this.hashMessage(message), privateKey);
        return (utils.hexZeroPad(sig.r, 32) + utils.hexZeroPad(sig.s, 32).substring(2) + (sig.recoveryParam ? '1c' : '1b'));
    },

    hashMessage(message) {
        const payload = utils.concat([
            utils.toUtf8Bytes('\x19Ethereum Signed Message:\n'),
            utils.toUtf8Bytes(String(message.length)),
            ((typeof (message) === 'string') ? utils.toUtf8Bytes(message) : message),
        ]);
        return utils.keccak256(payload);
    },

    hexToString(hex) {
        return utils.toUtf8String(hex);
    },
};
