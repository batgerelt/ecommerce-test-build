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
    searchword: [],
    searchkeyword: [],
    searchKeyWordResponse: [],
    isFetchingSearch: false,
    promotionall: [],
    tags: [],
    newproducts: [],
    newproductCount: 10,
    isFetchingNew: false,
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
        searchword: {
          request: this.buildActionName('request', data.model, 'searchword'),
          response: this.buildActionName('response', data.model, 'searchword'),
          error: this.buildActionName('error', data.model, 'searchword'),
        },
        searchkeyword: {
          request: this.buildActionName('request', data.model, 'searchkeyword'),
          response: this.buildActionName('response', data.model, 'searchkeyword'),
          error: this.buildActionName('error', data.model, 'searchkeyword'),
        },
        searchProduct: {
          request: this.buildActionName('request', data.model, 'searchProduct'),
          response: this.buildActionName('response', data.model, 'searchProduct'),
          error: this.buildActionName('error', data.model, 'searchProduct'),
        },
        promotionAll: {
          request: this.buildActionName('request', data.model, 'promotionAll'),
          response: this.buildActionName('response', data.model, 'promotionAll'),
          error: this.buildActionName('error', data.model, 'promotionAll'),
        },
        tags: {
          request: this.buildActionName('request', data.model, 'tags'),
          response: this.buildActionName('response', data.model, 'tags'),
          error: this.buildActionName('error', data.model, 'tags'),
        },
        newproduct: {
          request: this.buildActionName('request', data.model, 'newproduct'),
          response: this.buildActionName('response', data.model, 'newproduct'),
          error: this.buildActionName('error', data.model, 'newproduct'),
        },
      };
    }
  }

  searchWord = ({ keyword, rownum = 20 }) => asyncFn({ url: `/search/searchkeyword/${keyword}/${rownum}`, method: 'GET', model: this.model.searchword });

  getTags = () => asyncFn({ url: `/search/tag`, method: 'GET', model: this.model.tags });

  searchProductBrand = ({
    id, start = 0, rowcnt = 20, order = `price_asc`,
  }) => asyncFn({ url: `/search/brand/${id}/${start}/${rowcnt}/${order}`, method: 'GET', model: this.model.productbrand });

  searchAttribute = ({ body } = {}) => asyncFn({
    body, url: `/search/att`, method: 'POST', model: this.model.searchattribute,
  });

  searchProduct = ({ body } = {}) => asyncFn({
    body, url: `/search/elastic`, method: 'POST', model: this.model.searchProduct,
  })

  getNewProducts = ({ body } = {}) => asyncFn({
    body, url: `/search/elastic`, method: 'POST', model: this.model.newproduct,
  })

  resetSearch = () => ({
    type: 'resetsearch',
  });

  getAllPromotion = () => asyncFn({
    url: `/search/promotion`, method: 'GET', model: this.model.promotionAll,
  })

  pushProduct = (products) => {
    let tmp = this.initialState.newproducts;
    if (products.length !== 0) {
      products.map(i => tmp.push(i._source));
    }
    return tmp;
  }

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

      // GET SEARCH WORD
      case this.model.searchword.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.searchword.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.searchword.response:
        return { ...state, searchword: action.payload.data };

        // GET SEARCH KEY WORD
      case this.model.searchkeyword.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.searchkeyword.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.searchkeyword.response:
        return { ...state, searchkeyword: action.payload.data[0] };

      // GET SEARCH KEY WORD FILTER
      case this.model.searchProduct.request:
        return { ...state, isFetchingSearch: true, current: this.requestCase(state.current, action) };
      case this.model.searchProduct.error:
        return { ...state, isFetchingSearch: false, current: this.errorCase(state.current, action) };
      case this.model.searchProduct.response:
        return { ...state, isFetchingSearch: false, searchKeyWordResponse: action.payload.data };

      // GET SEARCH NEW PRODUCT
      case this.model.newproduct.request:
        return { ...state, isFetchingNew: true, current: this.requestCase(state.current, action) };
      case this.model.newproduct.error:
        return { ...state, isFetchingNew: false, current: this.errorCase(state.current, action) };
      case this.model.newproduct.response:
        return {
          ...state,
          isFetchingNew: false,
          newproducts: this.pushProduct(action.payload.data.hits.hits),
          newproductCount: state.newproductCount + 20,
        };

      // GET ALL PROMOTION
      case this.model.promotionAll.request:
        return { ...state, isFetchingSearch: true, current: this.requestCase(state.current, action) };
      case this.model.promotionAll.error:
        return { ...state, isFetchingSearch: false, current: this.errorCase(state.current, action) };
      case this.model.promotionAll.response:
        return { ...state, promotionall: action.payload.data };

      // RESET SEARCH
      case 'resetsearch':
        return { ...state, searchKeyWordResponse: state.searchKeyWordResponse.hits.hits.splice(0, 20) };

      // GET ALL TAGS
      case this.model.tags.request:
        return { ...state, isFetchingSearch: true, current: this.requestCase(state.current, action) };
      case this.model.tags.error:
        return { ...state, isFetchingSearch: false, current: this.errorCase(state.current, action) };
      case this.model.tags.response:
        return { ...state, tags: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
