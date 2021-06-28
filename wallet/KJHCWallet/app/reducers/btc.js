import {BTC} from '../actions/actionsTypes';

const initialState = {
    activeWalletId: null,
    wallets: [],
    walletsExtraData: {},
};

export default function btc(state = initialState, action) {
    switch (action.type) {
        case BTC.SELECT_ACTIVE_WALLET:
            return {
                ...state,
                activeWalletId: action.payload
            };
        case BTC.CREATE_WALLET.SUCCESS:
            return {
                ...state,
                activeWalletId: state.activeWalletId??action.payload.walletId,
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
        case BTC.DELETE_WALLET:
            return {};
        case BTC.GET_ADDRESSES.SUCCESS:
            return {};
        case BTC.IMPORT_WALLET.SUCCESS:
            return {};
        case BTC.EXPORT_WALLET.SUCCESS:
            return {};
    }
}
