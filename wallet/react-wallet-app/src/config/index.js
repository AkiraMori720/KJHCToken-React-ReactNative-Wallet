import testnet from './testnet.dev';
import mainnet from './mainnet.dev';

let config = {};
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    config = testnet
} else {
    config = mainnet
}

export default config;
