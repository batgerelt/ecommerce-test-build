// import { combineReducers } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
// import rootReducer from '../containers/Survey/modules';

import * as Models from '../models';

const config = {
  key: 'root',
  storage,
  whitelist: [],
  blacklist: [],
};

let reducer = {};

Object.keys(Models).forEach((entry) => {
  if (Models[entry].persist) {
    config.whitelist.push(Models[entry].modelName);
  } else {
    config.blacklist.push(Models[entry].modelName);
  }
  reducer[Models[entry].modelName] = Models[entry].reducer;
});

// console.log({ rootReducer, reducer });

export default persistCombineReducers(config, { ...reducer });
