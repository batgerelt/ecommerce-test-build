import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { persistStore } from 'redux-persist';

import rootReducer from './reducer';

const configureStore = (initialState) => {
  const middleware = [thunk];
  let store = createStore(rootReducer, initialState, applyMiddleware(...middleware));
  let persistor = persistStore(store);
  return { persistor, store };
};

export default configureStore;
