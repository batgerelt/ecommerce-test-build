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
    useraddress: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        useraddress: {
          request: this.buildActionName('request', data.model, 'useraddress'),
          response: this.buildActionName('response', data.model, 'useraddress'),
          error: this.buildActionName('error', data.model, 'useraddress'),
        },
      };
    }
  }

  getUserInfo = ({ id } = {}) => asyncFn({ url: `/customer/address/${id}`, method: 'GET', model: this.model.useraddress });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET HOMEPAGE BANNER
      case this.model.useraddress.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.useraddress.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.useraddress.response:
        return { ...state, useraddress: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
