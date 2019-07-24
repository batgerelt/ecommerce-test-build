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
    widgetAll: [],
    pageWidget: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        all: {
          request: this.buildActionName('request', data.model, 'all'),
          response: this.buildActionName('response', data.model, 'all'),
          error: this.buildActionName('error', data.model, 'all'),
        },
        pagewidget: {
          request: this.buildActionName('request', data.model, 'pagewidget'),
          response: this.buildActionName('response', data.model, 'pagewidget'),
          error: this.buildActionName('error', data.model, 'pagewidget'),
        },
      };
    }
  }
  getWidget = () => asyncFn({ url: `/widget`, method: 'GET', model: this.model.all });
  getPageWidget = ({ id }) => asyncFn({ url: `/widget/page/${id}`, method: 'GET', model: this.model.pagewidget });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET WIDGET
      case this.model.all.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.all.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.all.response:
        return { ...state, widgetAll: action.payload.data };

      // GET WIDGET
      case this.model.pagewidget.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.pagewidget.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.pagewidget.response:
        return { ...state, pageWidget: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
