/* eslint-disable no-dupe-keys */
import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    dynamicMenuProducts: [],
    dynamicMenuProductCount: 0,
    isFetchingDynamicMenu: false,
    dynamicMenuProductCount: 0,
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        discountproduct: {
          request: this.buildActionName('request', data.model, 'dynamicMenuProducts'),
          response: this.buildActionName('response', data.model, 'dynamicMenuProducts'),
          error: this.buildActionName('error', data.model, 'dynamicMenuProducts'),
        },

        elasticmoreinfo: {
          request: this.buildActionName('request', data.model, 'elasticmoreinfo'),
          response: this.buildActionName('response', data.model, 'elasticmoreinfo'),
          error: this.buildActionName('error', data.model, 'elasticmoreinfo'),
        },
      };
    }
  }

  // Elastic search-ээс барааны мэдээллийг татах
  getDynamicMenuProducts = ({ body } = {}) => asyncFn({
    body, url: `/search/elastic`, method: 'POST', model: this.model.discountproduct,
  });

  // redux-ийн хямдралтай барааны мэдээллийг устгах
  resetDiscountProducts = () => ({ type: 'DYNAMIC_MENU_PRODUCTS_RESET' });

  // Elastic-ийн явуулах боломжгүй барааны датаг авах (availableqty, unitprice, unitdiscountprice, currentunitprice)
  getMoreInfoElastic = ({ skucd }) => asyncFn({
    url: `/product/elastic/${skucd}`, method: 'GET', model: this.model.elasticmoreinfo,
  });

  //
  pushProduct = (products) => {
    let tmp = this.initialState.discountproducts;
    if (products.length !== 0) { products.map(i => tmp.push(i._source)); }
    return tmp;
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.model.discountproduct.request: return { ...state, isFetchingDynamicMenu: true, current: this.requestCase(state.current, action) };
      case this.model.discountproduct.error: return { ...state, isFetchingDynamicMenu: false, current: this.errorCase(state.current, action) };
      case this.model.discountproduct.response:
        return {
          ...state,
          isFetchingDynamicMenu: false,
          dynamicMenuProductCount: action.payload.data.hits.total.value,
          discountproducts: this.pushProduct(action.payload.data.hits.hits),
          dynamicMenuProductCount: state.dynamicMenuProductCount + 20,
        };

      case 'DYNAMIC_MENU_PRODUCTS_RESET': return { ...state, dynamicMenuProductCount: [], dynamicMenuProductCount: 0 };

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
