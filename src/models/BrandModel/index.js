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
    brand: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        brand: {
          request: this.buildActionName('request', data.model, 'brand'),
          response: this.buildActionName('response', data.model, 'brand'),
          error: this.buildActionName('error', data.model, 'brand'),
        },
      };
    }
  }
  getBrand = () => asyncFn({ url: `/brand`, method: 'GET', model: this.model.brand });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET BRAND
      case this.model.brand.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.brand.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.brand.response:
        return { ...state, brand: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
