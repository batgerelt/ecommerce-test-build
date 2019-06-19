import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
// start of persist
import { persistStore } from 'redux-persist';

import rootReducer from './reducer';


export default function configureStore(initialState = {}) {
  const middlewares = [thunkMiddleware];

  let composeEnhancers = compose;

  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const loggerMiddleware = createLogger({
      collapsed: true,
    });
    middlewares.push(loggerMiddleware);
  }

  let store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  let persistor = persistStore(store);

  return { persistor, store };
}
