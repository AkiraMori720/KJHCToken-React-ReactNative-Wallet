import {combineReducers} from 'redux';
import app from './app';
import btc from './btc';
import eth from './eth';

export default combineReducers({
    app,
    btc,
    eth
});
