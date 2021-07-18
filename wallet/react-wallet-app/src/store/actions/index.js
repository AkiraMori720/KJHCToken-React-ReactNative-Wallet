import { USER } from '../actionTypes';

export function addWallet(wallet){
    return {
        type: USER.ADD_WALLET,
        wallet
    };
}

export function setBalance(balance){
    return {
        type: USER.SET_BALANCE,
        balance
    }
}
