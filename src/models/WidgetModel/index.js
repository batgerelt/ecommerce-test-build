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
    widget: [],
    pagewidget: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        widget: {
          request: this.buildActionName('request', data.model, 'widget'),
          response: this.buildActionName('response', data.model, 'widget'),
          error: this.buildActionName('error', data.model, 'widget'),
        },
        pagewidget: {
          request: this.buildActionName('request', data.model, 'pagewidget'),
          response: this.buildActionName('response', data.model, 'pagewidget'),
          error: this.buildActionName('error', data.model, 'pagewidget'),
        },
      };
    }
  }
  getWidget = () => asyncFn({ url: `/widget`, method: 'GET', model: this.model.widget });
  getPageWidget = ({ id }) => asyncFn({ url: `/pagewidget/${id}`, method: 'GET', model: this.model.pagewidget });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET WIDGET
      case this.model.widget.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.widget.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.widget.response:
        return { ...state, widget: action.payload.data };

      // GET WIDGET
      case this.model.pagewidget.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.pagewidget.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.pagewidget.response:
        return { ...state, pagewidget: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
