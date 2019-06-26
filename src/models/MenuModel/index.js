/**
 * MODEL NAME:                                          STATIC INFO
 * CREATED BY:                                          **BATGERELT**
 * CREARED DATED:                                       2019-06-18
 * DESCRIPTION:                                         USER WEB-IIN STATIC DATA-UUDIIG AVAH HADGALAH ASHIGLANA
 */

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
    mainmenu: [],
    menuslug: [],
    menuDiscount: [],
    menuNew: [],
    menuRecipe: [],
    menuPackage: [],
    menuSeason: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        menu: {
          request: this.buildActionName('request', data.model, 'menu'),
          response: this.buildActionName('response', data.model, 'menu'),
          error: this.buildActionName('error', data.model, 'menu'),
        },
        menuslug: {
          request: this.buildActionName('request', data.model, 'menuslug'),
          response: this.buildActionName('response', data.model, 'menuslug'),
          error: this.buildActionName('error', data.model, 'menuslug'),
        },
        discount: {
          request: this.buildActionName('request', data.model, 'discount'),
          response: this.buildActionName('response', data.model, 'discount'),
          error: this.buildActionName('error', data.model, 'discount'),
        },
        new: {
          request: this.buildActionName('request', data.model, 'new'),
          response: this.buildActionName('response', data.model, 'new'),
          error: this.buildActionName('error', data.model, 'new'),
        },
        recipe: {
          request: this.buildActionName('request', data.model, 'recipe'),
          response: this.buildActionName('response', data.model, 'recipe'),
          error: this.buildActionName('error', data.model, 'recipe'),
        },
        package: {
          request: this.buildActionName('request', data.model, 'package'),
          response: this.buildActionName('response', data.model, 'package'),
          error: this.buildActionName('error', data.model, 'package'),
        },
        season: {
          request: this.buildActionName('request', data.model, 'season'),
          response: this.buildActionName('response', data.model, 'season'),
          error: this.buildActionName('error', data.model, 'season'),
        },
      };
    }
  }
  getMenu = () => asyncFn({ url: `/menu`, method: 'GET', model: this.model.menu });
  getMenuSlug = ({ id }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.menuslug });
  getDiscountMenu = ({ id = 'discount' }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.discount });
  getNewMenu = ({ id = 'new' }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.new });
  getRecipeMenu = ({ id = 'recipe' }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.recipe });
  getPackageMenu = ({ id = 'package' }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.package });
  getSeasonMenu = ({ id = 'season' }) => asyncFn({ url: `/menu/${id}`, method: 'GET', model: this.model.season });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET MENU
      case this.model.menu.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.menu.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.menu.response:
        return { ...state, mainmenu: action.payload.data };

      // GET MENU SLUG
      case this.model.menuslug.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.menuslug.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.menuslug.response:
        return { ...state, menuslug: action.payload.data };

      // GET SEASON
      case this.model.season.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.season.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.season.response:
        return { ...state, menuSeason: action.payload.data };

      // GET DISCOUNT
      case this.model.discount.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.discount.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.discount.response:
        return { ...state, menuDiscount: action.payload.data };

      // GET NEW
      case this.model.new.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.new.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.new.response:
        return { ...state, menuNew: action.payload.data };

      // GET RECIPE
      case this.model.recipe.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipe.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipe.response:
        return { ...state, menuRecipe: action.payload.data };

      // GET PACKAGE
      case this.model.package.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.package.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.package.response:
        return { ...state, menuPackage: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
