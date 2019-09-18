/* eslint-disable array-callback-return */
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
    recipeAll: [],
    recipeDetail: [],
    recipeProducts: [],
    recipeScroll: [],
    recipeCount: 6,
    recipeRowCount: 1,
    recipe: null,
    steps: [],
    recipeFetching: false,
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        recipeall: {
          request: this.buildActionName('request', data.model, 'recipeall'),
          response: this.buildActionName('response', data.model, 'recipeall'),
          error: this.buildActionName('error', data.model, 'recipeall'),
        },
        recipeScroll: {
          request: this.buildActionName('request', data.model, 'recipeScroll'),
          response: this.buildActionName('response', data.model, 'recipeScroll'),
          error: this.buildActionName('error', data.model, 'recipeScroll'),
        },
        recipedetail: {
          request: this.buildActionName('request', data.model, 'recipedetail'),
          response: this.buildActionName('response', data.model, 'recipedetail'),
          error: this.buildActionName('error', data.model, 'recipedetail'),
        },
        recipeproducts: {
          request: this.buildActionName('request', data.model, 'recipeproducts'),
          response: this.buildActionName('response', data.model, 'recipeproducts'),
          error: this.buildActionName('error', data.model, 'recipeproducts'),
        },
      };
    }
  }
  getRecipe = ({ order = `date_desc`, start = 0, rowcnt = 20 }) => asyncFn({ url: `/cookrecipe/${order}/${start}/${rowcnt}`, method: 'GET', model: this.model.recipeall });
  getRecipeScroll = ({ order = `date_desc`, start = 0, rowcnt = 6 }) => asyncFn({ url: `/cookrecipe/${order}/${start}/${rowcnt}`, method: 'GET', model: this.model.recipeScroll });
  getRecipeDetail = ({ id }) => asyncFn({ url: `/cookrecipe/${id}`, method: 'GET', model: this.model.recipedetail });
  getRecipeProducts = ({ id }) => asyncFn({ url: `/cookrecipe/${id}/products`, method: 'GET', model: this.model.recipeproducts });

  pushProduct = (products) => {
    let tmp = this.initialState.recipeScroll;
    if (products.length !== 0) {
      tmp.push(products);
    }
    return tmp;
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET RECIPEALL
      case this.model.recipeall.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeall.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeall.response:
        return { ...state, recipeAll: action.payload.data.products };

      case this.model.recipeScroll.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeScroll.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeScroll.response:
        return {
          ...state,
          recipeFetching: false,
          recipeScroll: this.pushProduct(action.payload.data.products),
          recipeRowCount: action.payload.data.count,
          recipeCount: state.recipeCount + 6,
        };

      // GET BRAND
      case this.model.recipedetail.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipedetail.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipedetail.response:
        return { ...state, recipe: action.payload.data[0].recipe, steps: action.payload.data[0].steps };

      // GET BRAND
      case this.model.recipeproducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeproducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeproducts.response:
        return { ...state, recipeProducts: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
