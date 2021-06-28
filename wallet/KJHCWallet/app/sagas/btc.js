import { put, takeLatest, fork, call, delay, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
	BASE_BTC,
	CREATE_WALLET,
	createActionType, EXPORT_WALLET,
	GENERATE_ADDRESS, GET_ADDRESSES, GET_TX_HISTORY, IMPORT_WALLET, REQUEST,
	SELECT_ACTIVE_WALLET, SEND_TRANSACTION, SUCCESS,
} from '../actions/actionsTypes';

import * as btcService from '../lib/btcService';
import AlertService from '../lib/alertService';
import Config from '../config';
import {
	createWalletActions, exportWalletActions,
	generateAddressActions,
	getAddressesActions, getBalanceSuccessAction,
	getTxHistoryActions, importWalletActions,
	sendTransactionActions,
} from '../actions/btc';
import {apiCallIds} from '../constants/coin';
import {finishApiCall, startApiCall} from '../actions/api';

export const selectBtcWallet = (state) => state.btc;

export const selectActiveWalletId = (state) => selectBtcWallet(state).activeWalletId;
export const selectWallets = (state) => selectBtcWallet(state).wallets;
export const selectWalletsExtraData = (state) => selectBtcWallet(state).walletsExtraData;

export const selectActiveWallet = createSelector(
	selectActiveWalletId,
	selectWallets,
	(activeWalletId, wallets) => activeWalletId && wallets.find((w) => w.walletId === activeWalletId)
);

export const selectActiveWalletExtraData = createSelector(
	selectActiveWalletId,
	selectWalletsExtraData,
	(activeWalletId, walletsExtraData) => activeWalletId && walletsExtraData[activeWalletId]
);


function* createWallet({ payload: { walletName, network } }) {
	yield put(startApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));

	try {
		const wallet = yield call(btcService.createWallet, walletName, network);

		yield put(createWalletActions.success(wallet));

		AlertService.success('Wallet was created successfully. You can select it now.');
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));
}

function* generateAddress() {
	yield put(startApiCall({ apiCallId: apiCallIds.GENERATE_ADDRESS }));

	const activeWallet = yield select(selectActiveWallet);

	try {
		const address = yield call(btcService.generateAddress, activeWallet);

		yield put(
			generateAddressActions.success({
				walletId: activeWallet.walletId,
				address,
			})
		);
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.GENERATE_ADDRESS }));
}

function* sendTransaction({ payload: { address, amount, feeLevel } }) {
	yield put(startApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));

	const activeWallet = yield select(selectActiveWallet);

	try {
		yield call(btcService.sendTransaction, activeWallet, address, amount, feeLevel);

		yield put(sendTransactionActions.success());

		AlertService.success('Transaction was sent successfully.');
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));
}

function* getAddresses() {
	yield put(startApiCall({ apiCallId: apiCallIds.GET_ADDRESSES }));

	const activeWallet = yield select(selectActiveWallet);

	try {
		const addresses = yield call(btcService.getAddresses, activeWallet);

		yield put(
			getAddressesActions.success({
				walletId: activeWallet.walletId,
				addresses,
			})
		);
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.GET_ADDRESSES }));
}

function* getTxHistory() {
	yield put(startApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));

	const activeWallet = yield select(selectActiveWallet);

	try {
		const txs = yield call(btcService.getTxHistory, activeWallet);

		yield put(
			getTxHistoryActions.success({
				walletId: activeWallet.walletId,
				txs,
			})
		);
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));
}

function* exportWallet() {
	yield put(startApiCall({ apiCallId: apiCallIds.EXPORT_WALLET }));

	const activeWallet = yield select(selectActiveWallet);

	try {
		const exported = yield call(btcService.exportWallet, activeWallet);

		yield put(
			exportWalletActions.success({
				walletId: activeWallet.walletId,
				exported,
			})
		);
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.EXPORT_WALLET }));
}

function* importWallet({ payload: { mnemonic, network, from3rdParty, walletData } }) {
	yield put(startApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));

	try {
		let wallet;

		if (mnemonic) {
			wallet = yield call(btcService.importWalletFromMnemonic, mnemonic, network, from3rdParty);
		} else {
			wallet = yield call(btcService.importWalletFromData, walletData);
		}

		const existingWallets = yield select(selectWallets);
		const alreadyExists = !!existingWallets.filter((w) => w.walletId === wallet.walletId).length;

		if (alreadyExists) {
			throw new Error('This wallet already exists in the device');
		} else {
			yield put(importWalletActions.success(wallet));

			AlertService.success('Wallet was imported successfully. You can select it now.');
		}
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));
}

function* getBalance() {
	yield put(startApiCall({ apiCallId: apiCallIds.GET_BALANCE }));

	const activeWallet = yield select(selectActiveWallet);

	if (!activeWallet) {
		return;
	}

	try {
		const balance = yield call(btcService.getBalance, activeWallet);

		yield put(
			getBalanceSuccessAction({
				walletId: activeWallet.walletId,
				balance,
			})
		);
	} catch (error) {
		AlertService.error(error.message);
	}

	yield put(finishApiCall({ apiCallId: apiCallIds.GET_BALANCE }));
}

function* updateBalanceContinuously() {
	while (true) {
		yield call(getBalance);

		yield delay(Config.fetchBalanceInterval);
	}
}

const root = function* root() {
	yield takeLatest(createActionType(BASE_BTC, CREATE_WALLET, REQUEST), createWallet);
	yield takeLatest(createActionType(BASE_BTC, GENERATE_ADDRESS, REQUEST), generateAddress);
	yield takeLatest(createActionType(BASE_BTC, SEND_TRANSACTION, REQUEST), sendTransaction);
	yield takeLatest(createActionType(BASE_BTC, GET_ADDRESSES, REQUEST), getAddresses);
	yield takeLatest(createActionType(BASE_BTC, GET_TX_HISTORY, REQUEST), getTxHistory);
	yield takeLatest(createActionType(BASE_BTC, EXPORT_WALLET, REQUEST), exportWallet);
	yield takeLatest(createActionType(BASE_BTC, IMPORT_WALLET, REQUEST), importWallet);

	yield takeLatest(BASE_BTC, SELECT_ACTIVE_WALLET, getBalance);
	yield takeLatest(createActionType(BASE_BTC, CREATE_WALLET, SUCCESS), getBalance);
	yield takeLatest(createActionType(BASE_BTC, IMPORT_WALLET, SUCCESS), getBalance);
	yield takeLatest(createActionType(BASE_BTC, SEND_TRANSACTION, SUCCESS), getBalance);

	yield fork(updateBalanceContinuously);
};
export default root;
