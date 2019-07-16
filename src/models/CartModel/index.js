/**
 * @author B.Batgerelt
 * @email batgereltb@gmail.com
 * @create date 2019-06-29 12:21:39
 * @modify date 2019-06-29 12:21:39
 * @desc [description]
 */

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
        incrementProductRemotely: {
          request: this.buildActionName('request', data.model, 'incrementProductRemotely'),
          response: this.buildActionName('response', data.model, 'incrementProductRemotely'),
          error: this.buildActionName('error', data.model, 'incrementProductRemotely'),
        },
        decrementProductRemotely: {
          request: this.buildActionName('request', data.model, 'decrementProductRemotely'),
          response: this.buildActionName('response', data.model, 'decrementProductRemotely'),
          error: this.buildActionName('error', data.model, 'decrementProductRemotely'),
        },
        increaseProductByQtyRemotely: {
          request: this.buildActionName('request', data.model, 'increaseProductByQtyRemotely'),
          response: this.buildActionName('response', data.model, 'increaseProductByQtyRemotely'),
          error: this.buildActionName('error', data.model, 'increaseProductByQtyRemotely'),
        },
        updateProductByQtyRemotely: {
          request: this.buildActionName('request', data.model, 'updateProductByQtyRemotely'),
          response: this.buildActionName('response', data.model, 'updateProductByQtyRemotely'),
          error: this.buildActionName('error', data.model, 'updateProductByQtyRemotely'),
        },
        removeProductRemotely: {
          request: this.buildActionName('request', data.model, 'removeProductRemotely'),
          response: this.buildActionName('response', data.model, 'removeProductRemotely'),
          error: this.buildActionName('error', data.model, 'removeProductRemotely'),
        },
        increaseProductsByQtyRemotely: {
          request: this.buildActionName('request', data.model, 'increaseProductsByQtyRemotely'),
          response: this.buildActionName('response', data.model, 'increaseProductsByQtyRemotely'),
          error: this.buildActionName('error', data.model, 'increaseProductsByQtyRemotely'),
        },
        recipeProducts: {
          request: this.buildActionName('request', data.model, 'recipeProducts'),
          response: this.buildActionName('response', data.model, 'recipeProducts'),
          error: this.buildActionName('error', data.model, 'recipeProducts'),
        },
        clearProducts: {
          request: this.buildActionName('request', data.model, 'clearProducts'),
          response: this.buildActionName('response', data.model, 'clearProducts'),
          error: this.buildActionName('error', data.model, 'clearProducts'),
        },
      };
    }
  }

  getProducts = ({ custid }) => asyncFn({
    url: `/basket/${custid}`,
    method: 'GET',
    model: this.model.products,
  });

  incrementProductLocally = product => ({
    type: 'CART_INCREMENT_PRODUCT_LOCALLY',
    payload: product,
  });

  incrementProductRemotely = ({
    custid, skucd, qty, iscart,
  }) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`,
    method: 'GET',
    model: this.model.incrementProductRemotely,
  });

  decrementProductLocally = product => ({
    type: 'CART_DECREMENT_PRODUCT_LOCALLY',
    payload: product,
  });

  decrementProductRemotely = ({
    custid, skucd, qty, iscart,
  }) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`,
    method: 'GET',
    model: this.model.decrementProductRemotely,
  });

  increaseProductByQtyLocally = product => ({
    type: 'CART_INCREASE_PRODUCT_BY_QTY_LOCALLY',
    payload: product,
  });

  increaseProductByQtyRemotely = ({
    custid, skucd, qty, iscart,
  }) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`,
    method: 'GET',
    model: this.model.increaseProductByQtyRemotely,
  });

  updateProductByQtyLocally = product => ({
    type: 'CART_UPDATE_PRODUCT_BY_QTY_LOCALLY',
    payload: product,
  });

  updateProductByQtyRemotely = ({
    custid, skucd, qty, iscart,
  }) => asyncFn({
    url: `/product/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`,
    method: 'GET',
    model: this.model.updateProductByQtyRemotely,
  });

  removeProductLocally = product => ({
    type: 'CART_REMOVE_PRODUCT_LOCALLY',
    payload: product,
  });

  clearProducts = () => asyncFn({
    url: `/basket/empty`,
    method: 'GET',
    model: this.model.clearProducts,
  });

  removeProductRemotely = ({ custid, skucd }) => asyncFn({
    url: `/basket/${custid}/${skucd}`,
    method: 'DELETE',
    model: this.model.removeProductRemotely,
  });

  increaseProductsByQtyRemotely = ({ custid, iscart, body }) => asyncFn({
    body,
    url: `/basket/${custid}/${iscart}`,
    method: 'POST',
    model: this.model.increaseProductsByQtyRemotely,
  });

  getRecipeProducts = ({ id }) => asyncFn({
    url: `/cookrecipe/${id}/products`,
    method: 'GET',
    model: this.model.recipeProducts,
  });

  incrementRecipeProductsLocally = products => ({
    type: 'CART_INCREMENT_RECIPE_PRODUCTS_LOCALLY',
    payload: products,
  });

  updateReduxStore = (
    state, product, shouldOverride = false, shouldDecrement = false, shouldUpdateByQty = false,
  ) => {
    let { products } = state;

    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    if (!product.qty) {
      product.qty = product.saleminqty || 1;
    }

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      const index = products.map(prod => prod.cd).indexOf(found.cd);

      if (index !== -1) {
        if (shouldOverride) {
          found.qty = found.availableqty !== 0 && product.qty > product.availableqty
            ? product.availableqty
            : (product.qty < product.saleminqty
              ? product.saleminqty
              : product.qty);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (shouldDecrement) {
            const productQty = shouldUpdateByQty
              ? (found.qty - product.qty < found.saleminqty
                ? found.saleminqty
                : found.qty - product.qty)
              : (found.qty - found.addminqty < found.saleminqty
                ? found.saleminqty
                : found.qty - found.addminqty);
            found.qty = productQty;
          } else {
            const productQty = shouldUpdateByQty
              ? (found.availableqty !== 0 && found.qty + product.qty > found.availableqty
                ? found.availableqty
                : found.qty + product.qty)
              : (found.availableqty !== 0 && found.qty + found.addminqty > found.availableqty
                ? found.availableqty
                : found.qty + found.addminqty);
            found.qty = productQty;
          }
        }
        products.splice(index, 1, found);
      }
    } else {
      product.qty = product.availableqty !== 0 && product.qty > product.availableqty
        ? product.availableqty
        : (product.qty < product.saleminqty
          ? product.saleminqty
          : product.qty);
      products.push(product);
    }

    return products;
  };

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.model.products.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.products.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.products.response:
        return { ...state, products: action.payload.data };

      case 'CART_INCREMENT_PRODUCT_LOCALLY':
        try {
          const products = this.updateReduxStore(state, action.payload);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementProductRemotely.response:
        return { ...state, products: action.payload.data };

      case 'CART_DECREMENT_PRODUCT_LOCALLY':
        try {
          const products = this.updateReduxStore(state, action.payload, false, true);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.decrementProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.decrementProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.decrementProductRemotely.response:
        return { ...state, products: action.payload.data };

      case 'CART_INCREASE_PRODUCT_BY_QTY_LOCALLY':
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            product.qty = product.saleminqty || 1;
          }

          products = this.updateReduxStore(state, product, false, false, true);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.increaseProductByQtyRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.increaseProductByQtyRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.increaseProductByQtyRemotely.response:
        return { ...state, products: action.payload.data };

      case 'CART_UPDATE_PRODUCT_BY_QTY_LOCALLY':
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            product.qty = product.saleminqty || 1;
          }

          products = this.updateReduxStore(state, product, true);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.updateProductByQtyRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.updateProductByQtyRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.updateProductByQtyRemotely.response:
        return { ...state, products: action.payload.data };

      case 'CART_REMOVE_PRODUCT_LOCALLY':
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            throw new Error('Бараа олдсонгүй!');
          }

          products = products.filter(prod => prod.cd !== found.cd);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.removeProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.removeProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.removeProductRemotely.response:
        try {
          let { products } = state;
          let product = action.payload.data[0];

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            throw new Error('Бараа олдсонгүй!');
          }

          products = products.filter(prod => prod.cd !== found.cd);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.recipeProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeProducts.response:
        return { ...state, products: action.payload.data };

      case 'CART_INCREMENT_RECIPE_PRODUCTS_LOCALLY':
        try {
          let products = [];
          action.payload.forEach((prod) => {
            console.log('prod: ', prod);
            // products = this.updateReduxStore(state.products[0], prod);
          });

          // return { ...state, products };
          return state;
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.clearProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.clearProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.clearProducts.response:
        return { ...state, products: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
