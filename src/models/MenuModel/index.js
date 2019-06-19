/**
 * MODEL NAME:                                          STATIC INFO
 * CREATED BY:                                          **BATGERELT**
 * CREARED DATED:                                       2019-06-18
 * DESCRIPTION:                                         USER WEB-IIN STATIC DATA-UUDIIG AVAH HADGALAH ASHIGLANA
 */

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
    mainmenu: [],
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
      };
    }
  }
  getMenu = () => asyncFn({
    url: `/menu`, method: 'GET', model: this.model.menu,
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET STATIC INFO
      case this.model.menu.request:
        return {
          ...state,
          current: this.requestCase(state.current, action),
        };
      case this.model.menu.error:
        return {
          ...state,
          current: this.errorCase(state.current, action),
        };
      case this.model.menu.response:
        return { mainmenu: action.payload.data };

      default:
        return state;
    }
  }
}

export default CrudModel;
