import {
    ETH,
    CREATE_WALLET,
    createCoinActionCreators, EXPORT_WALLET,
    GENERATE_ADDRESS,
    GET_ADDRESSES, GET_TX_HISTORY, IMPORT_WALLET,
    SEND_TRANSACTION, BASE_ETH, createActionCreator, SELECT_ACTIVE_WALLET, DELETE_WALLET, GET_BALANCE_SUCCESS,
} from './actionsTypes';

export const selectActiveWalletAction = createActionCreator(BASE_ETH, SELECT_ACTIVE_WALLET);
export const createWalletActions = createCoinActionCreators(BASE_ETH, CREATE_WALLET);
export const generateAddressActions = createCoinActionCreators(BASE_ETH, GENERATE_ADDRESS);
export const sendTransactionActions = createCoinActionCreators(BASE_ETH, SEND_TRANSACTION);
export const getAddressesActions = createCoinActionCreators(BASE_ETH, GET_ADDRESSES);
export const getTxHistoryActions = createCoinActionCreators(BASE_ETH, GET_TX_HISTORY);
export const exportWalletActions = createCoinActionCreators(BASE_ETH, EXPORT_WALLET);
export const importWalletActions = createCoinActionCreators(BASE_ETH, IMPORT_WALLET);
export const deleteWalletAction = createActionCreator(BASE_ETH, DELETE_WALLET);
export const getBalanceSuccessAction = createActionCreator(BASE_ETH, GET_BALANCE_SUCCESS);
