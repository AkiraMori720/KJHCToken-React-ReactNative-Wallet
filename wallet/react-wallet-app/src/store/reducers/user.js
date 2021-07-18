import {USER} from "../actionTypes";

export const initialState = {
    ghostData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'GHOST',
        fullName: 'ghost',
        balanceError: null,
        infoAboutCurrency: null,
    },
    nextData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'NEXT',
        fullName: 'next',
        balanceError: null,
        infoAboutCurrency: null,
    },
    ethData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'ETH',
        fullName: 'Ethereum',
        balanceError: null,
        infoAboutCurrency: null,
    },
    bnbData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BNB',
        fullName: 'Binance Coin',
        balanceError: null,
        infoAboutCurrency: null,
    },
    maticData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'MATIC',
        fullName: 'MATIC Token',
        balanceError: null,
        infoAboutCurrency: null,
    },
    arbethData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'ARBETH',
        fullName: 'Arbitrum ETH',
        balanceError: null,
        infoAboutCurrency: null,
    },
    btcData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BTC',
        fullName: 'Bitcoin',
        balanceError: null,
        infoAboutCurrency: null,
    },
    btcMultisigSMSData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BTC (SMS-Protected)',
        fullName: 'Bitcoin (SMS)',
        balanceError: null,
        infoAboutCurrency: null,
    },
    btcMultisigPinData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BTC (PIN-Protected)',
        fullName: 'Bitcoin (PIN)',
        balanceError: null,
        infoAboutCurrency: null,
    },
    btcMultisigG2FAData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BTC (Google 2FA)',
        fullName: 'Bitcoin (Google 2FA)',
        balanceError: null,
        infoAboutCurrency: null,
    },
    btcMultisigUserData: {
        balance: 0,
        isBalanceFetched: false,
        currency: 'BTC (Multisig)',
        fullName: 'Bitcoin (Multisig)',
        balanceError: null,
        infoAboutCurrency: null,
    },
    usdtData: {
        address: '0x0', // ? for what
        publicKey: '0x0', // ?
        balance: 0,
        isBalanceFetched: false,
        currency: 'USDT',
        fullName: 'Tether',
        balanceError: null,
    },
    tokensData: {},
    isFetching: false,
    isBalanceFetching: false,
    isTokenSigned: false,
    activeFiat: window.DEFAULT_FIAT || 'USD',
    activeCurrency: 'BTC',
    multisigStatus: {},
    multisigPendingCount: 0,
    metamaskData: false,
}

export default function user(state = initialState, action) {
    switch (action.type){
        case USER.ADD_WALLET: {
            const {name, data} = action.wallet;
            return {
                ...state,
                [name]: {
                    ...data,
                },
            };
        }
        case USER.SET_BALANCE: {
            const {name, amount, unconfirmedBalance} = action.balance;
            return {
                ...state,
                [name]: {
                    ...state[name],
                    balance: Number(amount),
                    unconfirmedBalance,
                    isBalanceFetched: true,
                    balanceError: false,
                },
            };
        }
        default:
            return state;
    }
}
