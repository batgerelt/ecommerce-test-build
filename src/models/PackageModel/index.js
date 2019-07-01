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
    packageAll: [],
    packageDetail: [],
    packageInfo: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        all: {
          request: this.buildActionName('request', data.model, 'all'),
          response: this.buildActionName('response', data.model, 'all'),
          error: this.buildActionName('error', data.model, 'all'),
        },
        detail: {
          request: this.buildActionName('request', data.model, 'detail'),
          response: this.buildActionName('response', data.model, 'detail'),
          error: this.buildActionName('error', data.model, 'detail'),
        },
        info: {
          request: this.buildActionName('request', data.model, 'info'),
          response: this.buildActionName('response', data.model, 'info'),
          error: this.buildActionName('error', data.model, 'info'),
        },
      };
    }
  }
  getAllPackage = () => asyncFn({ url: `/package`, method: 'GET', model: this.model.all });
  getDetailPackage = ({ id }) => asyncFn({ url: `/package/${id}`, method: 'GET', model: this.model.detail });
  getInfoPackage = ({ id }) => asyncFn({ url: `/packageimf/${id}`, method: 'GET', model: this.model.info });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET ALL PACKAGE
      case this.model.all.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.all.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.all.response:
        return { ...state, packageAll: action.payload.data };

      // GET PACKAGE DETAIL
      case this.model.detail.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.detail.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.detail.response:
        return { ...state, packageDetail: action.payload.data[0] };

      // GET PACKAGE INFORMATION
      case this.model.info.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.info.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.info.response:
        return { ...state, images: action.payload.data[0].images, info: action.payload.data[0].products[0] };

      default:
        return state;
    }
  }
}

export default Model;
