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
    addedProducts: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        products: {
          request: this.buildActionName('request', data.model, 'products'),
          response: this.buildActionName('response', data.model, 'products'),
          error: this.buildActionName('error', data.model, 'products'),
        },
        addedProducts: {
          request: this.buildActionName('request', data.model, 'addedProducts'),
          response: this.buildActionName('response', data.model, 'addedProducts'),
          error: this.buildActionName('error', data.model, 'addedProducts'),
        },
      };
    }
  }

  getProducts = custid => asyncFn({ url: `/basket/${custid}`, method: 'GET', model: this.model.cart });

  addToCart = ({ custid, body } = {}) => asyncFn({
    body, url: `/basket/${custid}`, method: 'PUT', model: this.model.addedProducts,
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CART PRODUCTS
      case this.model.products.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.products.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.products.response:
        return { ...state, products: action.payload.data };

      // GET ADDED PRODUCTS
      case this.model.addedProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.addedProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.addedProducts.response:
        return { ...state, addedProducts: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
