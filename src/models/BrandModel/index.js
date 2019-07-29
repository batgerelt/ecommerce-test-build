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
    brandall: [],
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
        brandall: {
          request: this.buildActionName('request', data.model, 'brandall'),
          response: this.buildActionName('response', data.model, 'brandall'),
          error: this.buildActionName('error', data.model, 'brandall'),
        },
      };
    }
  }
  getBrand = () => asyncFn({ url: `/brand`, method: 'GET', model: this.model.brand });
  getAllBrand = () => asyncFn({ url: `/search/brand`, method: 'GET', model: this.model.brandall });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET BRAND
      case this.model.brand.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.brand.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.brand.response:
        return { ...state, brand: action.payload.data };

        // GET BRAND ALL
      case this.model.brandall.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.brandall.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.brandall.response:
        return { ...state, brandall: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
