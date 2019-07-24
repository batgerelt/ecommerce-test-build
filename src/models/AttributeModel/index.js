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
    attrall: [],
    attrvalue: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        attrall: {
          request: this.buildActionName('request', data.model, 'attrall'),
          response: this.buildActionName('response', data.model, 'attrall'),
          error: this.buildActionName('error', data.model, 'attrall'),
        },
        attrvalue: {
          request: this.buildActionName('request', data.model, 'attrvalue'),
          response: this.buildActionName('response', data.model, 'attrvalue'),
          error: this.buildActionName('error', data.model, 'attrvalue'),
        },
      };
    }
  }
  getAttributeAll = () => asyncFn({ url: `/search/attribute`, method: 'GET', model: this.model.attrall });
  getAttributeValue = () => asyncFn({ url: `/search/attributevalue`, method: 'GET', model: this.model.attrvalue });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET ATTRIBUTE ALL
      case this.model.attrall.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.attrall.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.attrall.response:
        return { ...state, attrall: action.payload.data };

      // GET ATTRIBUTE VALUE
      case this.model.attrvalue.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.attrvalue.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.attrvalue.response:
        return { ...state, attrvalue: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
