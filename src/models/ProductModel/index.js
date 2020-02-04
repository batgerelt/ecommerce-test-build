/* eslint-disable no-global-assign */
/* eslint-disable array-callback-return */
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
    emartproduct: [],
    discountproduct: [],
    newproduct: [],

    isProductDetail: true,
    detail: null,

    attribute: [],
    relational: [],
    collection: [],
    rate: 0,
    comment: [],
    detailimg: [],
    recipeproduct: [],
    categorymenu: [],
    count: 0,
    newCount: 0,
    newProductCount: 1,
    discountCount: 0,
    isFetching: false,
    discountFetching: false,
    allFetched: false,
    addedWishList: false,
    skumoreinfo: 0,
    isfeedbacks: {
      status: 0,
    },
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        emartproduct: {
          request: this.buildActionName('request', data.model, 'emartproduct'),
          response: this.buildActionName('response', data.model, 'emartproduct'),
          error: this.buildActionName('error', data.model, 'emartproduct'),
        },
        discountproduct: {
          request: this.buildActionName('request', data.model, 'discountproduct'),
          response: this.buildActionName('response', data.model, 'discountproduct'),
          error: this.buildActionName('error', data.model, 'discountproduct'),
        },
        newproduct: {
          request: this.buildActionName('request', data.model, 'newproduct'),
          response: this.buildActionName('response', data.model, 'newproduct'),
          error: this.buildActionName('error', data.model, 'newproduct'),
        },
        detail: {
          request: this.buildActionName('request', data.model, 'detail'),
          response: this.buildActionName('response', data.model, 'detail'),
          error: this.buildActionName('error', data.model, 'detail'),
        },
        attribute: {
          request: this.buildActionName('request', data.model, 'attribute'),
          response: this.buildActionName('response', data.model, 'attribute'),
          error: this.buildActionName('error', data.model, 'attribute'),
        },
        relational: {
          request: this.buildActionName('request', data.model, 'relational'),
          response: this.buildActionName('response', data.model, 'relational'),
          error: this.buildActionName('error', data.model, 'relational'),
        },
        collection: {
          request: this.buildActionName('request', data.model, 'collection'),
          response: this.buildActionName('response', data.model, 'collection'),
          error: this.buildActionName('error', data.model, 'collection'),
        },
        rate: {
          request: this.buildActionName('request', data.model, 'rate'),
          response: this.buildActionName('response', data.model, 'rate'),
          error: this.buildActionName('error', data.model, 'rate'),
        },
        comment: {
          request: this.buildActionName('request', data.model, 'comment'),
          response: this.buildActionName('response', data.model, 'comment'),
          error: this.buildActionName('error', data.model, 'comment'),
        },
        detailimg: {
          request: this.buildActionName('request', data.model, 'detailimg'),
          response: this.buildActionName('response', data.model, 'detailimg'),
          error: this.buildActionName('error', data.model, 'detailimg'),
        },
        prodavailablesku: {
          request: this.buildActionName('request', data.model, 'prodavailablesku'),
          response: this.buildActionName('response', data.model, 'prodavailablesku'),
          error: this.buildActionName('error', data.model, 'prodavailablesku'),
        },
        isfeedback: {
          request: this.buildActionName('request', data.model, 'isfeedback'),
          response: this.buildActionName('response', data.model, 'isfeedback'),
          error: this.buildActionName('error', data.model, 'isfeedback'),
        },
        productdetailcategorys: {
          request: this.buildActionName('request', data.model, 'productdetailcategorys'),
          response: this.buildActionName('response', data.model, 'productdetailcategorys'),
          error: this.buildActionName('error', data.model, 'productdetailcategorys'),
        },
        categorymenu: {
          request: this.buildActionName('request', data.model, 'categorymenu'),
          response: this.buildActionName('response', data.model, 'categorymenu'),
          error: this.buildActionName('error', data.model, 'categorymenu'),
        },
        recipe: {
          request: this.buildActionName('request', data.model, 'recipe'),
          response: this.buildActionName('response', data.model, 'recipe'),
          error: this.buildActionName('error', data.model, 'recipe'),
        },
        elasticmoreinfo: {
          request: this.buildActionName('request', data.model, 'elasticmoreinfo'),
          response: this.buildActionName('response', data.model, 'elasticmoreinfo'),
          error: this.buildActionName('error', data.model, 'elasticmoreinfo'),
        },
      };
    }
    this.addWishListModel = {
      request: this.buildActionName('request', 'addwishlist'),
      response: this.buildActionName('response', 'addwishlist'),
      error: this.buildActionName('error', 'addwishlist'),
    };
    this.addWishListPackageModel = {
      request: this.buildActionName('request', 'addwishlistpackage'),
      response: this.buildActionName('response', 'addwishlistpackage'),
      error: this.buildActionName('error', 'addwishlistpackage'),
    };
    this.addWishListRecipeModel = {
      request: this.buildActionName('request', 'addwishlistrecipe'),
      response: this.buildActionName('response', 'addwishlistrecipe'),
      error: this.buildActionName('error', 'addwishlistrecipe'),
    };
    this.addCommentModel = {
      request: this.buildActionName('request', 'addcomment'),
      response: this.buildActionName('response', 'addcomment'),
      error: this.buildActionName('error', 'addcomment'),
    };
    this.addRateModel = {
      request: this.buildActionName('request', 'addrate'),
      response: this.buildActionName('response', 'addrate'),
      error: this.buildActionName('error', 'addrate'),
    };
    this.AddViewModel = {
      request: this.buildActionName('request', 'addview'),
      response: this.buildActionName('response', 'addview'),
      error: this.buildActionName('error', 'addview'),
    };
  }

  pushNewProduct = (products) => {
    let tmp = this.initialState.newproduct;
    products.map((item, i) => {
      tmp.push(item);
    });
    return tmp;
  }

  getProductDetail = ({ skucd }) => asyncFn({ url: `/product/detail/${skucd}`, method: 'GET', model: this.model.detail });
  getProductAttribute = ({ skucd }) => asyncFn({ url: `/product/attribute/${skucd}`, method: 'GET', model: this.model.attribute });
  getProductRelational = ({ skucd }) => asyncFn({ url: `/product/relational/${skucd}`, method: 'GET', model: this.model.relational });
  getProductCollection = ({ skucd }) => asyncFn({ url: `/product/collection/${skucd}`, method: 'GET', model: this.model.collection });
  getProductRate = ({ skucd }) => asyncFn({ url: `/product/rate/${skucd}`, method: 'GET', model: this.model.rate });
  getProductComment = ({ skucd }) => asyncFn({ url: `/product/comment/${skucd}`, method: 'GET', model: this.model.comment });
  getProductDetailimg = ({ skucd }) => asyncFn({ url: `/product/detailimg/${skucd}`, method: 'GET', model: this.model.detailimg });
  getProductDetailCategory = ({ skucd }) => asyncFn({ url: `/product/productdetailcategorys/${skucd}`, method: 'GET', model: this.model.productdetailcategorys });
  getCategorys = () => asyncFn({ url: `/category/menu`, method: 'GET', model: this.model.categorymenu });
  getEmartProduct = ({
    jumcd = '99', start = 0, rowcnt = 20, order = `date_desc`,
  }) => asyncFn({ url: `/product/emartproduct/${jumcd}/${start}/${rowcnt}/${order}`, method: 'GET', model: this.model.emartproduct });
  getDiscountProduct = ({
    jumcd = '99', start = 0, rowcnt = 20, order = `price_asc`,
  }) => asyncFn({ url: `/product/discountproduct/${jumcd}/${start}/${rowcnt}/${order}`, method: 'GET', model: this.model.discountproduct });
  getNewProduct = ({
    jumcd = '99', start = 0, rowcnt = 20, order = `price_asc`,
  }) => asyncFn({ url: `/product/newproduct/${jumcd}/${start}/${rowcnt}/${order}`, method: 'GET', model: this.model.newproduct });
  getProductAvailable = ({
    custid, skucd, qty, iscart,
  }) => asyncFn({ url: `/prodavailablesku/${custid}/${skucd}/${qty}/${iscart}`, method: 'GET', model: this.model.prodavailablesku });
  isFeedBack = ({ orderid, skucd }) => asyncFn({ url: `/product/isfeedback/${orderid}/${skucd}`, method: 'GET', model: this.model.isfeedback });

  getRecipeProduct = () => asyncFn({ url: `/cookrecipe`, method: 'GET', model: this.model.recipe });
  addWishList = ({ skucd }) => asyncFn({ url: `/customer/wishlist/${skucd}`, method: 'POST', model: this.addWishListModel });
  addWishListPackage = ({ id }) => asyncFn({ url: `/customer/wishlist/package/${id}`, method: 'POST', model: this.addWishListPackageModel });
  addWishListRecipe = ({ id }) => asyncFn({ url: `/customer/wishlist/recipe/${id}`, method: 'POST', model: this.addWishListRecipeModel });
  removeAddedWishColor = () => ({ type: "REMOVE_ADDED_WISH_LIST_COLOR" });
  addRate = ({ body }) =>
    asyncFn({
      body, url: `/product/feedback`, method: 'POST', model: this.addRateModel,
    });
  addComment = ({ skucd, comm }) => asyncFn({ url: `/product/comment/${skucd}/${comm}`, method: 'POST', model: this.addCommentModel });
  addViewList = ({ skucd }) => asyncFn({ url: `/customer/viewlist/${skucd}`, method: 'POST', model: this.AddViewModel });
  getMoreInfoElastic = ({ skucd }) => asyncFn({ url: `/product/elastic/${skucd}`, method: 'GET', model: this.model.elasticmoreinfo });
  clearDetailModelState = () => ({
    type: "CLEAR_DETAIL",
  });
  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case "CLEAR_DETAIL":
        return {
          ...state,
          rate: 0,
        };
      // GET EMART PRODUCT
      case this.model.emartproduct.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.emartproduct.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.emartproduct.response:
        return { ...state, emartproduct: action.payload.data };

      // GET DISCOUNT PRODUCT
      case this.model.discountproduct.request:
        return { ...state, discountFetching: true, current: this.requestCase(state.current, action) };
      case this.model.discountproduct.error:
        return { ...state, discountFetching: false, current: this.errorCase(state.current, action) };
      case this.model.discountproduct.response:
        return { ...state, discountFetching: false, discountproduct: action.payload.data };

      // GET NEW PRODUCT
      case this.model.newproduct.request:
        return { ...state, isFetching: true, current: this.requestCase(state.current, action) };
      case this.model.newproduct.error:
        return { ...state, isFetching: false, current: this.errorCase(state.current, action) };
      case this.model.newproduct.response:
        return {
          ...state,
          isFetching: false,
          newProductCount: action.payload.data.count,
          // eslint-disable-next-line array-callback-return
          newproduct: this.pushNewProduct(action.payload.data.product),
          newCount: state.newCount + 20,
        };

      // GET DETAIL
      case this.model.detail.request: return { ...state, isProductDetail: true, detail: { images: [], products: [] } };
      case this.model.detail.error: return { ...state, isProductDetail: false };
      case this.model.detail.response: return { ...state, detail: action.payload.data, isProductDetail: false };

      // GET ATTRIBUTE
      case this.model.attribute.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.attribute.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.attribute.response:
        return { ...state, attribute: action.payload.data };

      // GET RELATIONAL
      case this.model.relational.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.relational.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.relational.response:
        return { ...state, relational: action.payload.data };

      // GET COLLECTION
      case this.model.collection.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.collection.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.collection.response:
        return { ...state, collection: action.payload.data };

      // GET RATE
      case this.model.rate.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.rate.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.rate.response:
        return { ...state, rate: action.payload.data };

      // GET COMMENT
      case this.model.comment.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.comment.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.comment.response:
        return { ...state, comment: action.payload.data };

      // GET DETAILIMG
      case this.model.detailimg.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.detailimg.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.detailimg.response:
        return { ...state, detailimg: action.payload.data };

      // GET PROD AVAILABLE SKU
      case this.model.prodavailablesku.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.prodavailablesku.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.prodavailablesku.response:
        return { ...state, prodavailablesku: action.payload.data };
      // GET FEEDBACK
      case this.model.isfeedback.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.isfeedback.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.isfeedback.response:
        return { ...state, isfeedbacks: action.payload.data };
      // GET PRODUCT DETAIL CATEGORYS
      case this.model.productdetailcategorys.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.productdetailcategorys.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.productdetailcategorys.response:
        return { ...state, productdetailcategorys: action.payload.data };

      // GET CATEGORY MENU
      case this.model.categorymenu.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.categorymenu.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.categorymenu.response:
        return { ...state, categorymenu: action.payload.data };

      // GET PRODUCT DETAIL CATEGORYS
      case this.model.recipe.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipe.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipe.response:
        return { ...state, recipeproduct: action.payload.data };

      // GET PRODUCT SKU ELASTIC MORE INFO
      case this.model.elasticmoreinfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.elasticmoreinfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.elasticmoreinfo.response:
        return { ...state, elasticmoreinfo: action.payload.data };

      // ADD WISH LIST MODEL
      case this.addWishListModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          addedWishList: true,
        };

      case this.addWishListModel.response:
        return state;

      // ADD WISH LIST PACKAGE MODEL
      case this.addWishListPackageModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          addedWishList: true,
        };

      // ADD WISH LIST RECIPE MODEL
      case this.addWishListRecipeModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          addedWishList: true,
        };

      // ADD RATE MODEL
      case this.addRateModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
        };

      // ADD COMMENT MODEL
      case this.addCommentModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
        };

      // ADD VIEWLIST MODEL
      case this.AddViewModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
        };

      case "REMOVE_ADDED_WISH_LIST_COLOR":
        return { ...state, addedWishList: false };

      default:
        return state;
    }
  }
}

export default Model;
