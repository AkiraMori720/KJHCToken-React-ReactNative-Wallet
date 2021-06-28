import {flattenDeep} from 'lodash';

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';
const defaultTypes = [REQUEST, SUCCESS, FAILURE];

export const BASE_BTC = 'BTC';
export const BASE_ETH = 'ETH';
export const BASE_API = 'API';

export const SELECT_ACTIVE_WALLET = 'SELECT_ACTIVE_WALLET';
export const DELETE_WALLET = 'DELETE_WALLET';
export const CREATE_WALLET = 'CREATE_WALLET';
export const GENERATE_ADDRESS = 'GENERATE_ADDRESS';
export const SEND_TRANSACTION = 'SEND_TRANSACTION';
export const GET_ADDRESSES = 'GET_ADDRESSES';
export const GET_TX_HISTORY = 'GET_TX_HISTORY';
export const EXPORT_WALLET = 'EXPORT_WALLET';
export const IMPORT_WALLET = 'IMPORT_WALLET';
export const GET_BALANCE_SUCCESS = 'GET_BALANCE_SUCCESS';

export const START_API_CALL = 'START_API_CALL';
export const FINISH_API_CALL = 'FINISH_API_CALL';

export const createActionType = (...parts) => flattenDeep(parts).join('_');

function createRequestTypes(base, types = []) {
	const res = {};
	types.forEach(type => (res[type] = createActionType(base, type)));
	return res;
}

function createCoinActionTypes(base, types) {
	const res = {};
	types.forEach(type => {
		res[type] = {};
		defaultTypes.forEach(dt => res[type][dt] = createActionType(base, type, dt));
	});
	return res;
}

export const createActionCreator = (...type) => (payload) => ({
	type: createActionType(type),
	payload,
});

export const createCoinActionCreators = (...type) => ({
	request: createActionCreator(type, REQUEST),
	success: createActionCreator(type, SUCCESS),
	failure: createActionCreator(type, FAILURE),
});



export const APP = createRequestTypes('APP', ['START', 'READY', 'INIT', 'INIT_LOCAL_SETTINGS', 'SET_MASTER_DETAIL']);
export const APP_STATE = createRequestTypes('APP_STATE', ['FOREGROUND', 'BACKGROUND', 'INACTIVE']);

export const BTC = {
	...createRequestTypes(BASE_BTC, [SELECT_ACTIVE_WALLET, DELETE_WALLET, GET_BALANCE_SUCCESS]),
	...createCoinActionTypes(BASE_BTC, [CREATE_WALLET, GENERATE_ADDRESS, GET_ADDRESSES, SEND_TRANSACTION, GET_TX_HISTORY, EXPORT_WALLET, IMPORT_WALLET])
};

export const ETH = {
	...createRequestTypes(BASE_ETH, [SELECT_ACTIVE_WALLET, DELETE_WALLET, GET_BALANCE_SUCCESS]),
	...createCoinActionTypes(BASE_ETH, [CREATE_WALLET, GENERATE_ADDRESS, GET_ADDRESSES, SEND_TRANSACTION, GET_TX_HISTORY, EXPORT_WALLET, IMPORT_WALLET])
};

export const API = createRequestTypes(BASE_API, [START_API_CALL, FINISH_API_CALL]);
