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
    productbrand: [],
    searchattribute: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        productbrand: {
          request: this.buildActionName('request', data.model, 'productbrand'),
          response: this.buildActionName('response', data.model, 'productbrand'),
          error: this.buildActionName('error', data.model, 'productbrand'),
        },
        searchattribute: {
          request: this.buildActionName('request', data.model, 'searchattribute'),
          response: this.buildActionName('response', data.model, 'searchattribute'),
          error: this.buildActionName('error', data.model, 'searchattribute'),
        },
      };
    }
  }
  searchProductBrand = ({
    id, start = 0, rowcnt = 20, order = `price_asc`,
  }) => asyncFn({ url: `/search/brand/${id}/${start}/${rowcnt}/${order}`, method: 'GET', model: this.model.productbrand });
  searchAttribute = ({ body } = {}) => asyncFn({
    body, url: `/search/att`, method: 'POST', model: this.model.searchattribute,
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET PRODUCT BRAND
      case this.model.productbrand.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.productbrand.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.productbrand.response:
        return { ...state, productbrand: action.payload.data };

        // GET SEARCH ATTRIBUTE
      case this.model.searchattribute.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.searchattribute.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.searchattribute.response:
        return { ...state, searchattribute: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
