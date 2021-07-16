import {ETH} from '../actions/actionsTypes';

const initialState = {
    activeWalletId: null,
    wallets: [],
    walletsExtraData: {},
};


export default function eth(state = initialState, action) {
    switch (action.type) {
        case ETH.SELECT_ACTIVE_WALLET:
            return {
                ...state,
                activeWalletId: action.payload
            };
        case ETH.CREATE_WALLET.SUCCESS:
            return {
                ...state,
                activeWalletId: state.activeWalletId ?? action.payload.walletId,
                wallet: action.payload,
                walletsExtraData: {
                    ...state.walletsExtraData,
                    [action.payload.walletId]: {
                        txs: [],
                        addresses: [],
                        balance: {},
                    }
                }
            }
                ;
        case ETH.DELETE_WALLET:
            return {};
        case ETH.GET_ADDRESSES.SUCCESS:
            return {};
        case ETH.IMPORT_WALLET.SUCCESS:
            return {};
        case ETH.EXPORT_WALLET.SUCCESS:
            return {};
    }
    return state;
}
