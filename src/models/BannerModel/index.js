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
    homepagebanner: [],
    pagesbanner: [],
    banner: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        homepagebanner: {
          request: this.buildActionName('request', data.model, 'homepagebanner'),
          response: this.buildActionName('response', data.model, 'homepagebanner'),
          error: this.buildActionName('error', data.model, 'homepagebanner'),
        },
        pagesbanner: {
          request: this.buildActionName('request', data.model, 'pagesbanner'),
          response: this.buildActionName('response', data.model, 'pagesbanner'),
          error: this.buildActionName('error', data.model, 'pagesbanner'),
        },
        banner: {
          request: this.buildActionName('request', data.model, 'banner'),
          response: this.buildActionName('response', data.model, 'banner'),
          error: this.buildActionName('error', data.model, 'banner'),
        },
      };
    }
  }

  getHomePageBanner = () => asyncFn({ url: `/homepagebanners`, method: 'GET', model: this.model.homepagebanner });
  getPagesBanner = ({ id }) => asyncFn({ url: `/pagesbanner/${id}`, method: 'GET', model: this.model.pagesbanner });
  getBanner= ({ id }) => asyncFn({ url: `/banner/${id}`, method: 'GET', model: this.model.banner });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET HOMEPAGE BANNER
      case this.model.homepagebanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.homepagebanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.homepagebanner.response:
        return { ...state, homepagebanner: action.payload.data };

      // GET PAGE BANNER
      case this.model.pagesbanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.pagesbanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.pagesbanner.response:
        return { ...state, pagesbanner: action.payload.data };

      // GET BANNER
      case this.model.banner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.banner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.banner.response:
        return { ...state, banner: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
