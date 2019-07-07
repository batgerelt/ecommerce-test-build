import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import storage from "redux-persist/lib/storage";
import { createLogger } from "redux-logger";
import { persistReducer } from "redux-persist";
import { applyMiddleware, createStore, compose } from "redux";

import reducers from "../store/reducer";

const middleware = applyMiddleware(promise(), thunk, createLogger());
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, composeEnhancers(middleware));

export default store;
