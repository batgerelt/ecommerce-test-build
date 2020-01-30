/* eslint-disable no-dupe-keys */
import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    newproducts: [],
    newproductCount: 0,
    isFetchingnew: false,
    newproductTotal: 0,
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        newproduct: {
          request: this.buildActionName('request', data.model, 'newproducts'),
          response: this.buildActionName('response', data.model, 'newproducts'),
          error: this.buildActionName('error', data.model, 'newproducts'),
        },
        elasticmoreinfo: {
          request: this.buildActionName('request', data.model, 'elasticmoreinfo'),
          response: this.buildActionName('response', data.model, 'elasticmoreinfo'),
          error: this.buildActionName('error', data.model, 'elasticmoreinfo'),
        },
      };
    }
  }

  getNewProducts = ({ body } = {}) => asyncFn({
    body, url: `/search/elastic`, method: 'POST', model: this.model.newproduct,
  })

  resetNewProducts = () => ({ type: 'NEW_PRODUCTS_RESET' });

    // Elastic-ийн явуулах боломжгүй барааны датаг авах (availableqty, unitprice, unitdiscountprice, currentunitprice)
    getMoreInfoElastic = ({ skucd }) => asyncFn({
      url: `/product/elastic/${skucd}`, method: 'GET', model: this.model.elasticmoreinfo,
    });

  pushProduct = (products) => {
    let tmp = this.initialState.newproducts;
    if (products.length !== 0) { products.map(i => tmp.push(i._source)); }
    return tmp;
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.model.newproduct.request: return { ...state, isFetchingnew: true, current: this.requestCase(state.current, action) };
      case this.model.newproduct.error: return { ...state, isFetchingnew: false, current: this.errorCase(state.current, action) };
      case this.model.newproduct.response:
        return {
          ...state,
          isFetchingnew: false,
          newproductTotal: action.payload.data.hits.total.value,
          newproducts: this.pushProduct(action.payload.data.hits.hits),
          newproductCount: state.newproductCount + 20,
        };

      case 'RESET_NEW_PRODUCTS': return { ...state, newproductCount: [], newproductCount: 0 };

      case this.model.elasticmoreinfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.elasticmoreinfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.elasticmoreinfo.response:
        return { ...state, elasticmoreinfo: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
