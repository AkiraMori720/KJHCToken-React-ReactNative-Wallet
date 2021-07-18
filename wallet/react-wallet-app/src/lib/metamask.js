import {store} from '../store';
import Web3Connect from "./we3Connect";
import web3 from "../const/web3";
import config from "../config";
import {setMetamask} from "./web3";
import {addWallet} from "../store/actions";

const metamask = {
    web3connect : new Web3Connect({
        _web3ChainId: 3,
        web3RPC: web3.provider
    }),
    connect: () => {

    },
    init : () => {
        if (metamask.web3connect.hasCachedProvider()) {
            metamask._init()
        } else {
            metamask.addMetamaskWallet()
        }
    },
    _init : async () => {
        await metamask.web3connect.onInit(() => {
            if (metamask.web3connect.hasCachedProvider()) {
                let _web3 = false
                try {
                    //@ts-ignore: strictNullChecks
                    _web3 = metamask.web3connect.getWeb3()
                } catch (err) {
                    metamask.web3connect.clearCache()
                    metamask.addMetamaskWallet()
                    return
                }
                setMetamask(_web3)
                metamask.addMetamaskWallet()
            } else {
                metamask.addMetamaskWallet()
            }
        })
    },
    addMetamaskWallet : () => {
        const { user } = store.getState();

        if (metamask.isConnected()) {
            const ethWalletInfo = {
                currencyName: 'ETH',
                fullWalletName: `Ethereum (${metamask.web3connect.getProviderTitle()})`,
                currencyInfo: user.ethData?.infoAboutCurrency,
            }
            const bscWalletInfo = {
                currencyName: 'BNB',
                fullWalletName: `BSC (${metamask.web3connect.getProviderTitle()})`,
                currencyInfo: user.bnbData?.infoAboutCurrency,
            }
            const maticWalletInfo = {
                currencyName: 'MATIC',
                fullWalletName: `MATIC (${metamask.web3connect.getProviderTitle()})`,
                currencyInfo: user.maticData?.infoAboutCurrency,
            }
            const arbitrumWalletInfo = {
                currencyName: 'ARBETH',
                fullWalletName: `ARBITRUM ETH (${metamask.web3connect.getProviderTitle()})`,
                currencyInfo: user.arbethData?.infoAboutCurrency,
            }
            const walletMap = new Map([
                [config.evmNetworks.ETH.networkVersion, ethWalletInfo],
                [config.evmNetworks.BNB.networkVersion, bscWalletInfo],
                [config.evmNetworks.MATIC.networkVersion, maticWalletInfo],
                [config.evmNetworks.ARBETH.networkVersion, arbitrumWalletInfo],
            ])

            const hexChainId = metamask.web3connect.getChainId()
            const chainId = Number(Number(hexChainId).toString(10))
            if (metamask.isAvailableNetwork()){
                const currencyName = walletMap.get(chainId)?.currencyName
                const fullWalletName = walletMap.get(chainId)?.fullWalletName
                const currencyInfo = walletMap.get(chainId)?.currencyInfo

                store.dispatch(addWallet({
                    name: 'metamaskData',
                    data: {
                        address: metamask.getAddress(),
                        balance: 0,
                        balanceError: false,
                        isConnected: true,
                        isMetamask: true,
                        currency: currencyName,
                        fullName: fullWalletName,
                        infoAboutCurrency: currencyInfo,
                        isBalanceFetched: true,
                        isMnemonic: true,
                        unconfirmedBalance: 0,
                        networkVersion: chainId,
                        unknownNetwork: false,
                    },
                }));
            } else {
                store.dispatch(addWallet({
                    name: 'metamaskData',
                    data: {
                        address: `Please choose another`,
                        balance: 0,
                        balanceError: false,
                        isConnected: true,
                        isMetamask: true,
                        currency: 'ETH',
                        fullName: `Unknown network (${metamask.web3connect.getProviderTitle()})`,
                        infoAboutCurrency: undefined,
                        isBalanceFetched: true,
                        isMnemonic: true,
                        unconfirmedBalance: 0,
                        networkVersion: chainId,
                        unknownNetwork: true,
                    },
                }));
            }
        } else {
            store.dispatch(addWallet({
                name: 'metamaskData',
                data: {
                    address: 'Not connected',
                    balance: 0,
                    balanceError: false,
                    isConnected: false,
                    isMetamask: true,
                    currency: 'ETH',
                    fullName: 'External wallet',
                    infoAboutCurrency: undefined,
                    isBalanceFetched: true,
                    isMnemonic: true,
                    unconfirmedBalance: 0,
                },
            }));
        }
    },
    isConnected: () => metamask.web3connect.isConnected(),
    getAddress: () => metamask.isConnected()?metamask.web3connect.getAddress():'',
    getWeb3: () => metamask.isConnected()?metamask.web3connect.getWeb3():false,
    isCorrectNetwork : () => metamask.web3connect.isCorrectNetwork(),
    isAvailableNetwork : () => {
        const hexChainId = metamask.web3connect.getChainId()
        const chainId = Number(Number(hexChainId).toString(10))
        // console.log('available', hexChainId, chainId, config.evmNetworkVersions);
        return (config.evmNetworkVersions.includes(chainId))
    },
    disconnect: () => {

    }
}

metamask.init();

window.metaMaskApi = metamask;

export default metamask;
