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
      };
    }
  }

  seasonFilter = ({ body } = {}) => asyncFn({
    body, url: `/seasonfilter`, method: 'POST', model: this.model.seasonfilter,
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

      default:
        return state;
    }
  }
}

export default Model;
