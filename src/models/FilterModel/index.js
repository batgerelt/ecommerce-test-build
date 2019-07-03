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
  }, console.log(body));

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
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categoryfilter.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categoryfilter.response:
        return { ...state, categoryfilter: action.payload.data };
      default:
        return state;
    }
  }
}

export default Model;
