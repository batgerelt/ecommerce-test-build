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
    cartProducts: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        cartProducts: {
          request: this.buildActionName('request', data.model, 'cartProducts'),
          response: this.buildActionName('response', data.model, 'cartProducts'),
          error: this.buildActionName('error', data.model, 'cartProducts'),
        },
        addProduct: {
          request: this.buildActionName('request', data.model, 'addProduct'),
          response: this.buildActionName('response', data.model, 'addProduct'),
          error: this.buildActionName('error', data.model, 'addProduct'),
        },
      };
    }
  }

  getCartProducts = custid => asyncFn({ url: `/basket/${custid}`, method: 'GET', model: this.model.cart });

  addToProduct = skucd => asyncFn({ url: `/basket/${custid}`, method: 'GET', model: this.model.cart });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CART PRODUCTS
      case this.model.cartProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.cartProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.cartProducts.response:
        return { ...state, cartProducts: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
