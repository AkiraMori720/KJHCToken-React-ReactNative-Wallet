import {
    BTC,
    CREATE_WALLET,
    createCoinActionCreators, EXPORT_WALLET,
    GENERATE_ADDRESS,
    GET_ADDRESSES, GET_TX_HISTORY, IMPORT_WALLET,
    SEND_TRANSACTION, BASE_BTC, createActionCreator, SELECT_ACTIVE_WALLET, DELETE_WALLET, GET_BALANCE_SUCCESS,
} from './actionsTypes';

export const selectActiveWalletAction = createActionCreator(BASE_BTC, SELECT_ACTIVE_WALLET);
export const createWalletActions = createCoinActionCreators(BASE_BTC, CREATE_WALLET);
export const generateAddressActions = createCoinActionCreators(BASE_BTC, GENERATE_ADDRESS);
export const sendTransactionActions = createCoinActionCreators(BASE_BTC, SEND_TRANSACTION);
export const getAddressesActions = createCoinActionCreators(BASE_BTC, GET_ADDRESSES);
export const getTxHistoryActions = createCoinActionCreators(BASE_BTC, GET_TX_HISTORY);
export const exportWalletActions = createCoinActionCreators(BASE_BTC, EXPORT_WALLET);
export const importWalletActions = createCoinActionCreators(BASE_BTC, IMPORT_WALLET);
export const deleteWalletAction = createActionCreator(BASE_BTC, DELETE_WALLET);
export const getBalanceSuccessAction = createActionCreator(BASE_BTC, GET_BALANCE_SUCCESS);
