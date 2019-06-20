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
      };
    }
  }
  getMenu = () => asyncFn({ url: `/menu`, method: 'GET', model: this.model.menu });
  getMenuSlug = ({ slug }) => asyncFn({ url: `/menu/${slug}`, method: 'GET', model: this.model.menuslug });

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

      default:
        return state;
    }
  }
}

export default Model;
