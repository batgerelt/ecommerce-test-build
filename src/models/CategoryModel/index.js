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
    categoryall: [],
    categoryparents: [],
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
        categoryall: {
          request: this.buildActionName('request', data.model, 'categoryall'),
          response: this.buildActionName('response', data.model, 'categoryall'),
          error: this.buildActionName('error', data.model, 'categoryall'),
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
        categoryparents: {
          request: this.buildActionName('request', data.model, 'categoryparents'),
          response: this.buildActionName('response', data.model, 'categoryparents'),
          error: this.buildActionName('error', data.model, 'categoryparents'),
        },
      };
    }
  }
  getCategoryAll = () => asyncFn({ url: `/search/category`, method: 'GET', model: this.model.categoryall });
  getCategoryMenu = () => asyncFn({ url: `/category/menu`, method: 'GET', model: this.model.categorymenu });
  getCategoryParents = ({ id }) => asyncFn({ url: `/category/parent/${id}`, method: 'GET', model: this.model.categoryparents });
  getCategoryInfo = ({
    id, rowcount = 20, ordercol = 'price_asc',
  }) => asyncFn({ url: `/category/info/${id}/${rowcount}/${ordercol}`, method: 'GET', model: this.model.categoryinfo });
  getCategoryProducts = ({
    id, startswith, rowcount, ordercol,
  }) => asyncFn({ url: `/category/products/${id}/${startswith}/${rowcount}/${ordercol}}`, method: 'GET', model: this.model.categoryproducts });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CATEGORY ALL
      case this.model.categoryall.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryall.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryall.response:
        return { ...state, categoryall: action.payload.data };

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
        const root = [];
        action.payload.data.forEach((entry, index) => {
          if (entry.parentid === 0) {
            entry.children = [];
            root.push(entry);
          }
          root.forEach((ent) => {
            if (ent.id === entry.parentid) {
              ent.children.push(entry);
            }
          });
        });
        return { ...state, categorymenu: action.payload.data, categoryRootMenu: root };

      // GET CATEGORY PRODUCTS
      case this.model.categoryproducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryproducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryproducts.response:
        return { ...state, categoryproducts: action.payload.data };

      // GET CATEGORY PARENTS
      case this.model.categoryparents.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryparents.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryparents.response:
        return { ...state, categoryparents: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
