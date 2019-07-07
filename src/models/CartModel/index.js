import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    current: {
      error: false,
      errorMessage: '',
      isLoading: false,
      data: {},
    },
    products: [],
  }

  constructor(data = {}) {
    super(data);
    this.persist = true;
    if (data.model) {
      this.model = {
        products: {
          request: this.buildActionName('request', data.model, 'products'),
          response: this.buildActionName('response', data.model, 'products'),
          error: this.buildActionName('error', data.model, 'products'),
        },
        modifyAndSaveToDb: {
          request: this.buildActionName('request', data.model, 'modifyAndSaveToDb'),
          response: this.buildActionName('response', data.model, 'modifyAndSaveToDb'),
          error: this.buildActionName('error', data.model, 'modifyAndSaveToDb'),
        },
        addAndSaveToDb: {
          request: this.buildActionName('request', data.model, 'addAndSaveToDb'),
          response: this.buildActionName('response', data.model, 'addAndSaveToDb'),
          error: this.buildActionName('error', data.model, 'addAndSaveToDb'),
        },
        reduceAndSaveToDb: {
          request: this.buildActionName('request', data.model, 'reduceAndSaveToDb'),
          response: this.buildActionName('response', data.model, 'reduceAndSaveToDb'),
          error: this.buildActionName('error', data.model, 'reduceAndSaveToDb'),
        },
        saveAllToDb: {
          request: this.buildActionName('request', data.model, 'saveAllToDb'),
          response: this.buildActionName('response', data.model, 'saveAllToDb'),
          error: this.buildActionName('error', data.model, 'saveAllToDb'),
        },
        deleteFromDb: {
          request: this.buildActionName('request', data.model, 'deleteFromDb'),
          response: this.buildActionName('response', data.model, 'deleteFromDb'),
          error: this.buildActionName('error', data.model, 'deleteFromDb'),
        },
      };
    }
  }

  increment = item => ({
    type: 'PRODUCT_INCREMENT',
    payload: item,
  });

  decrement = item => ({
    type: 'PRODUCT_DECREMENT',
    payload: item,
  });

  replaceReduxStoreBy = item => ({
    type: 'PRODUCT_REPLACE_REDUX_STORE_BY',
    payload: item,
  });

  getProducts = custid => asyncFn({ url: `/basket/${custid}`, method: 'GET', model: this.model.products });

  modifyAndSaveToDb = (custid, skucd, qty, iscart) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`, method: 'GET', model: this.model.modifyAndSaveToDb,
  });

  addAndSaveToDb = (custid, skucd, qty, iscart) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`, method: 'GET', model: this.model.addAndSaveToDb,
  });

  reduceAndSaveToDb = (custid, skucd, qty, iscart) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`, method: 'GET', model: this.model.reduceAndSaveToDb,
  });

  saveAllToDb = ({ custid, iscart, body }) => asyncFn({
    body, url: `/basket/${custid}/${iscart}`, method: 'POST', model: this.model.saveAllToDb,
  });

  deleteFromDb = (custid, skucd) => asyncFn({
    url: `/basket/${custid}/${skucd}`, method: 'DELETE', model: this.model.deleteFromDb,
  });

  deleteFromLocal = item => ({
    type: 'PRODUCT_DELETE_FROM_LOCAL',
    payload: item,
  });

  deleteFromLocalStorage = (skucd) => {
    let serializedRoot = localStorage.getItem('persist:root');

    let root = serializedRoot;
    if (typeof serializedRoot === 'string') {
      root = JSON.parse(serializedRoot);
    }

    let serializedCart = root.cart;

    let { cart } = root;
    if (typeof cart === 'string') {
      cart = JSON.parse(serializedCart);
    }

    let { products } = cart;
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    products = products.filter(prod => prod.cd !== skucd);

    cart.products = products;
    root.cart = cart;
    serializedRoot = JSON.stringify(root);
    localStorage.setItem('persist:root', serializedRoot);
  };

  deleteFromReduxStore = (skucd, state) => {
    let { products } = state;

    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    products = products.filter(prod => prod.cd !== skucd);

    return { ...state, products };
  };

  modifyLocalStorage = (item, shouldDecrement = false, shouldOverride = false) => {
    let serializedRoot = localStorage.getItem('persist:root');

    let root = serializedRoot;
    if (typeof serializedRoot === 'string') {
      root = JSON.parse(serializedRoot);
    }

    let serializedCart = root.cart;

    let { cart } = root;
    if (typeof cart === 'string') {
      cart = JSON.parse(serializedCart);
    }

    let { products } = cart;
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    let found = products.find(prod => prod.cd === item.cd);
    if (found) {
      const index = products.map(prod => prod.cd).indexOf(found.cd);
      if (index !== -1) {
        if (shouldOverride) {
          found.qty = item.qty;
        } else if (shouldDecrement) {
          found.qty -= (item.addminqty || 1);
        } else {
          found.qty += (item.addminqty || 1);
        }
        products.splice(index, 1, found);
      }
    } else {
      if (!shouldOverride) {
        item.qty = item.saleminqty || 1;
      }
      products.push(item);
    }

    cart.products = products;
    root.cart = cart;
    serializedRoot = JSON.stringify(root);
    localStorage.setItem('persist:root', serializedRoot);
  };

  modifyReduxStore = (item, state, shouldDec = false, shouldOverride = false) => {
    let { products } = state;

    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    let found = products.find(prod => prod.cd === item.cd);
    if (found) {
      const index = products.map(prod => prod.cd).indexOf(found.cd);
      if (index !== -1) {
        if (shouldOverride) {
          found.qty = item.qty;
        } else if (shouldDec) {
          found.qty -= (item.addminqty || 1);
        } else {
          found.qty += (item.addminqty || 1);
        }
        products.splice(index, 1, found);
      }
    } else {
      if (!shouldOverride) {
        item.qty = item.qty || (item.saleminqty || 1);
      }
      products.push(item);
    }

    return { ...state, products };
  };

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case 'PRODUCT_INCREMENT':
        try {
          const item = action.payload;
          this.modifyLocalStorage(item);
          return this.modifyReduxStore(item, state);
        } catch (e) {
          console.log(e);
        }
        return state;

      case 'PRODUCT_DECREMENT':
        try {
          const item = action.payload;
          this.modifyLocalStorage(item, true);
          return this.modifyReduxStore(item, state, true);
        } catch (e) {
          console.log(e);
        }
        return state;

      case 'PRODUCT_REPLACE_REDUX_STORE_BY':
        try {
          const item = action.payload;
          return this.modifyReduxStore(item, state, false, true);
        } catch (e) {
          console.log(e);
        }
        return state;

      // SAVE ALL TO DB
      case this.model.saveAllToDb.response:
        try {
          console.log(action.payload);
        } catch (e) {
          console.log(e);
        }
        return state;

      // GET CART PRODUCTS
      case this.model.products.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.products.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.products.response:
        return { ...state, products: action.payload.data };

      // MODIFY AND SAVE TO REDUX
      case this.model.modifyAndSaveToDb.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.modifyAndSaveToDb.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.modifyAndSaveToDb.response:
        try {
          this.modifyLocalStorage(action.payload.data[0], false, true);
          return this.modifyReduxStore(action.payload.data[0], state, false, true);
        } catch (e) {
          console.log(e);
        }
        return state;

      // ADD AND SAVE TO REDUX
      case this.model.addAndSaveToDb.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.addAndSaveToDb.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.addAndSaveToDb.response:
        try {
          this.modifyLocalStorage(action.payload.data[0]);
          return this.modifyReduxStore(action.payload.data[0], state);
        } catch (e) {
          console.log(e);
        }
        return state;

      // REDUCE AND SAVE TO REDUX
      case this.model.reduceAndSaveToDb.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.reduceAndSaveToDb.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.reduceAndSaveToDb.response:
        try {
          this.modifyLocalStorage(action.payload.data[0], true);
          return this.modifyReduxStore(action.payload.data[0], state, true);
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.deleteFromDb.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.deleteFromDb.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.deleteFromDb.response:
        try {
          console.log(action.payload);
          return state;
          // return this.deleteFromReduxStore();
        } catch (e) {
          console.log(e);
        }
        return state;

      case 'PRODUCT_DELETE_FROM_LOCAL':
        try {
          const item = action.payload;
          this.deleteFromLocalStorage(item.cd);
          return this.deleteFromReduxStore(item.cd, state);
        } catch (e) {
          console.log(e);
        }
        return state;

      default:
        return state;
    }
  }
}

export default Model;
