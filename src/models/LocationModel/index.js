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
    province: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        province: {
          request: this.buildActionName('request', data.model, 'province'),
          response: this.buildActionName('response', data.model, 'province'),
          error: this.buildActionName('error', data.model, 'province'),
        },
      };
    }
  }
  getProvince = () => asyncFn({ url: `/systemlocation`, method: 'GET', model: this.model.province });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET BRAND
      case this.model.province.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.province.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.province.response:
        return { ...state, province: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
