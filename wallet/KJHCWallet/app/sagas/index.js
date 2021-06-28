import { all } from 'redux-saga/effects';
import init from './init';
import btc from './btc';

const root = function* root() {
    yield all([
        init(),
        btc()
    ]);
};

export default root;
