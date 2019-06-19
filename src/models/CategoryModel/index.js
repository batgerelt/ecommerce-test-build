import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class CrudModel extends BaseModel {
  initialState = {
    current: {
      error: false,
      errorMessage: '',
      isLoading: false,
      data: {},
    },
    categorymenu: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        categorymenu: {
          request: this.buildActionName('request', data.model, 'categorymenu'),
          response: this.buildActionName('response', data.model, 'categorymenu'),
          error: this.buildActionName('error', data.model, 'categorymenu'),
        },
      };
    }
  }
  getCategoryMenu = () => asyncFn({
    url: `/categorymenu`, method: 'GET', model: this.model.categorymenu,
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CATEGORY MENU
      case this.model.categorymenu.request:
        return {
          ...state,
          current: this.requestCase(state.current, action),
        };
      case this.model.categorymenu.error:
        return {
          ...state,
          current: this.errorCase(state.current, action),
        };
      case this.model.categorymenu.response:
        return { categorymenu: action.payload.data };

      default:
        return state;
    }
  }
}

export default CrudModel;
