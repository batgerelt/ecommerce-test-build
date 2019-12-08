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
    staticpage: [],
    staticinfo: null,
    staticpages: [],
    isLoadingStaticpage: false,
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        staticinfo: {
          request: this.buildActionName('request', data.model, 'staticinfo'),
          response: this.buildActionName('response', data.model, 'staticinfo'),
          error: this.buildActionName('error', data.model, 'staticinfo'),
        },
        staticpage: {
          request: this.buildActionName('request', data.model, 'staticpage'),
          response: this.buildActionName('response', data.model, 'staticpage'),
          error: this.buildActionName('error', data.model, 'staticpage'),
        },
        staticpages: {
          request: this.buildActionName('request', data.model, 'staticpages'),
          response: this.buildActionName('response', data.model, 'staticpages'),
          error: this.buildActionName('error', data.model, 'staticpages'),
        },
      };
    }
  }
  getStaticInfo = () => asyncFn({ url: `/staticinfo`, method: 'GET', model: this.model.staticinfo });
  getStaticPages = () => asyncFn({ url: `/staticpages`, method: 'GET', model: this.model.staticpages });
  getStaticPage = ({ id }) => asyncFn({ url: `/staticpages/${id}`, method: 'GET', model: this.model.staticpage });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET STATIC INFO
      case this.model.staticinfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.staticinfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.staticinfo.response:
        return { ...state, staticinfo: action.payload.data[0] };

      // GET STATIC PAGE
      case this.model.staticpage.request:
        return { ...state, current: this.requestCase(state.current, action), isLoadingStaticpage: true };
      case this.model.staticpage.error:
        return { ...state, current: this.errorCase(state.current, action), isLoadingStaticpage: false };
      case this.model.staticpage.response:
        return { ...state, staticpage: action.payload.data[0], isLoadingStaticpage: false };

      // GET STATIC PAGES
      case this.model.staticpages.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.staticpages.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.staticpages.response:
        return { ...state, staticpages: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
