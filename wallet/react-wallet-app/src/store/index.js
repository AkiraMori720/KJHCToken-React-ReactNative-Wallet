import { compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'
import { createStore, combineReducers } from 'redaction'
import { connectRouter, routerMiddleware } from 'connected-react-router'


import localReducers from './reducers'
import rootSaga from './sagas';

const history = createBrowserHistory()
const middleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware();
const initialState = (localStorage['redux-store']) ? JSON.parse(localStorage['redux-store']) : {}
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (v) => v

const _storeConfig = {
  reducers: {
    router: connectRouter(history),
    ...combineReducers(localReducers),
  },
  middleware: [
    middleware,
    sagaMiddleware
  ],
  enhancers: [
    devTools,
  ],
  initialState,
}

const store = createStore(_storeConfig);

sagaMiddleware.run(rootSaga);

export default store;
export { history };
