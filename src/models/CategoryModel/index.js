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
    categorymenu: [],
    categoryinfo: [],
    categoryproducts: [],
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
        categoryinfo: {
          request: this.buildActionName('request', data.model, 'categoryinfo'),
          response: this.buildActionName('response', data.model, 'categoryinfo'),
          error: this.buildActionName('error', data.model, 'categoryinfo'),
        },
        categoryproducts: {
          request: this.buildActionName('request', data.model, 'categoryproducts'),
          response: this.buildActionName('response', data.model, 'categoryproducts'),
          error: this.buildActionName('error', data.model, 'categoryproducts'),
        },
      };
    }
  }
  getCategoryMenu = () => asyncFn({ url: `/category/menu`, method: 'GET', model: this.model.categorymenu });
  getCategoryInfo = ({
    id, rowcount = 20, ordercol = 'price_asc',
  }) => asyncFn({ url: `/category/info/${id}/${rowcount}/${ordercol}`, method: 'GET', model: this.model.categoryinfo });
  getCategoryProducts = ({
    id, startswith, rowcount, ordercol,
  }) => asyncFn({ url: `/category/products/${id}/${startswith}/${rowcount}/${ordercol}}`, method: 'GET', model: this.model.categoryproducts });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CATEGORY INFO
      case this.model.categoryinfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryinfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryinfo.response:
        return { ...state, categoryinfo: action.payload.data[0] };

      // GET CATEGORY MENU
      case this.model.categorymenu.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categorymenu.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categorymenu.response:
        return { ...state, categorymenu: action.payload.data };

      // GET CATEGORY PRODUCTS
      case this.model.categoryproducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryproducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryproducts.response:
        return { ...state, categoryproducts: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
