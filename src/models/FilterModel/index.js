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
    seasonfilter: [],
    categoryfilter: [],
    count: 0,
    isFetching: false,
    allFetched: false,
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        seasonfilter: {
          request: this.buildActionName('request', data.model, 'seasonfilter'),
          response: this.buildActionName('response', data.model, 'seasonfilter'),
          error: this.buildActionName('error', data.model, 'seasonfilter'),
        },
        categoryfilter: {
          request: this.buildActionName('request', data.model, 'categoryfilter'),
          response: this.buildActionName('response', data.model, 'categoryfilter'),
          error: this.buildActionName('error', data.model, 'categoryfilter'),
        },
      };
    }
  }

  seasonFilter = ({ body } = {}) => asyncFn({
    body, url: `/seasonfilter`, method: 'POST', model: this.model.seasonfilter,
  });
  categoryFilter = ({ body } = {}) => asyncFn({
    body, url: `/categoryfilter`, method: 'POST', model: this.model.categoryfilter,
  });

  resetCategory = () => ({
    type: 'resetcategory',
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET SEASON FILTER
      case this.model.seasonfilter.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.seasonfilter.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.seasonfilter.response:
        return { ...state, seasonfilter: action.payload.data[0] };

      // GET CATEGORY FILTER
      case this.model.categoryfilter.request:
        return { ...state, isFetching: true, current: this.requestCase(state.current, action) };
      case this.model.categoryfilter.error:
        return { ...state, isFetching: false, current: this.errorCase(state.current, action) };
      case this.model.categoryfilter.response:
        return {
          ...state, isFetching: false, categoryfilter: state.categoryfilter.concat(action.payload.data), count: this.initialState.count + 20,
        };
      case 'resetcategory':
        return { ...state, categoryfilter: state.categoryfilter.splice(0, 20), count: 20 };

      default:
        return state;
    }
  }
}

export default Model;
