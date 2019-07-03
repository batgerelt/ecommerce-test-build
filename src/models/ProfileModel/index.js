import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    history: [],
    wish: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        history: {
          request: this.buildActionName('request', data.model, 'history'),
          response: this.buildActionName('response', data.model, 'history'),
          error: this.buildActionName('error', data.model, 'history'),
        },
        wish: {
          request: this.buildActionName('request', data.model, 'wish'),
          response: this.buildActionName('response', data.model, 'wish'),
          error: this.buildActionName('error', data.model, 'wish'),
        },
      };
    }
  }
  getHistory = ({ custid }) => asyncFn({ url: `/customer/viewlist/${custid}`, method: 'GET', model: this.model.history });
  getWish = ({ custid }) => asyncFn({ url: `/customer/wishlist/${custid}`, method: 'GET', model: this.model.wish });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET Histrory products
      case this.model.history.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.history.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.history.response:
        return { ...state, history: action.payload.data };
      // Get Wish products
      case this.model.wish.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.wish.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.wish.response:
        return { ...state, wish: action.payload.data };
      default:
        return state;
    }
  }
}

export default Model;
