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
    recipe: null,
    steps: [],
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
  getRecipeAll = () => asyncFn({ url: `/cookrecipe`, method: 'GET', model: this.model.recipeall });
  getRecipeDetail = ({ id }) => asyncFn({ url: `/cookrecipe/${id}`, method: 'GET', model: this.model.recipedetail });
  getRecipeProducts = ({ id }) => asyncFn({ url: `/cookrecipe/${id}/products`, method: 'GET', model: this.model.recipeproducts });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET BRAND
      case this.model.recipeall.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeall.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeall.response:
        return { ...state, recipeAll: action.payload.data };

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
