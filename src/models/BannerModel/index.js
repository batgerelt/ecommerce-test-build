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
    pagebanner: [],
    banner: [],
    discountbanner: [],
    newbanner: [],
    packagebanner: [],
    recipebanner: [],
    seasonbanner: [],
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
        discountbanner: {
          request: this.buildActionName('request', data.model, 'discountbanner'),
          response: this.buildActionName('response', data.model, 'discountbanner'),
          error: this.buildActionName('error', data.model, 'discountbanner'),
        },
        newbanner: {
          request: this.buildActionName('request', data.model, 'newbanner'),
          response: this.buildActionName('response', data.model, 'newbanner'),
          error: this.buildActionName('error', data.model, 'newbanner'),
        },
        packagebanner: {
          request: this.buildActionName('request', data.model, 'packagebanner'),
          response: this.buildActionName('response', data.model, 'packagebanner'),
          error: this.buildActionName('error', data.model, 'packagebanner'),
        },
        recipebanner: {
          request: this.buildActionName('request', data.model, 'recipebanner'),
          response: this.buildActionName('response', data.model, 'recipebanner'),
          error: this.buildActionName('error', data.model, 'recipebanner'),
        },
        seasonbanner: {
          request: this.buildActionName('request', data.model, 'seasonbanner'),
          response: this.buildActionName('response', data.model, 'seasonbanner'),
          error: this.buildActionName('error', data.model, 'seasonbanner'),
        },
      };
    }
  }

  getHomePageBanner = () => asyncFn({ url: `/banner/homepage`, method: 'GET', model: this.model.homepagebanner });
  getPagesBanner = ({ id }) => asyncFn({ url: `/banner/pages/${id}`, method: 'GET', model: this.model.pagesbanner });
  getDiscountBanner = () => asyncFn({ url: `/banner/discount`, method: 'GET', model: this.model.discountbanner });
  getNewBanner = () => asyncFn({ url: `/banner/new`, method: 'GET', model: this.model.newbanner });
  getPackageBanner = () => asyncFn({ url: `/banner/package`, method: 'GET', model: this.model.packagebanner });
  getRecipeBanner = () => asyncFn({ url: `/banner/recipe`, method: 'GET', model: this.model.recipebanner });
  getSeasonBanner = () => asyncFn({ url: `/banner/season`, method: 'GET', model: this.model.seasonbanner });

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
        return { ...state, pagebanner: action.payload.data };

      // GET BANNER
      case this.model.banner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.banner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.banner.response:
        return { ...state, banner: action.payload.data };

      // GET DISCOUNT BANNER
      case this.model.discountbanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.discountbanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.discountbanner.response:
        return { ...state, discountbanner: action.payload.data };

      // GET NEWBANNER
      case this.model.newbanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.newbanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.newbanner.response:
        return { ...state, newbanner: action.payload.data };

      // GET PACKAGEBANNER
      case this.model.packagebanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.packagebanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.packagebanner.response:
        return { ...state, packagebanner: action.payload.data };

      // GET RECIPEBANNER
      case this.model.recipebanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipebanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipebanner.response:
        return { ...state, recipebanner: action.payload.data };

      // GET SEASONBANNER
      case this.model.seasonbanner.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.seasonbanner.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.seasonbanner.response:
        return { ...state, seasonbanner: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
