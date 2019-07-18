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
    package: [],
    packageAll: [],
    packageDetail: [],
    packageInfo: [],
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
        detail: {
          request: this.buildActionName('request', data.model, 'detail'),
          response: this.buildActionName('response', data.model, 'detail'),
          error: this.buildActionName('error', data.model, 'detail'),
        },
        info: {
          request: this.buildActionName('request', data.model, 'info'),
          response: this.buildActionName('response', data.model, 'info'),
          error: this.buildActionName('error', data.model, 'info'),
        },
      };
    }
  }

  getAllPackage = () => asyncFn({ url: `/package`, method: 'GET', model: this.model.all });
  getDetailPackage = ({ id }) => asyncFn({ url: `/package/${id}`, method: 'GET', model: this.model.detail });
  getInfoPackage = ({ id }) => asyncFn({ url: `/packageimf/${id}`, method: 'GET', model: this.model.info });

  incrementPackageProductLocally = product => ({
    type: 'CART_INCREMENT_PACKAGE_PRODUCT_LOCALLY',
    payload: product,
  });

  decrementPackageProductLocally = product => ({
    type: 'CART_DECREMENT_PACKAGE_PRODUCT_LOCALLY',
    payload: product,
  });

  updatePackageProductByQtyLocally = product => ({
    type: 'CART_UPDATE_PACKAGE_PRODUCT_BY_QTY_LOCALLY',
    payload: product,
  });

  updateReduxStore = (
    products, product, shouldOverride = false, shouldDecrement = false, shouldUpdateByqty = false,
  ) => {
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    if (!product.qty) {
      product.qty = product.saleminqty || 1;
    }

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      const index = products.map(prod => prod.cd).indexOf(found.cd);

      if (index !== -1) {
        if (shouldOverride) {
          found.qty = found.availableqty !== 0 && product.qty > product.availableqty
            ? product.availableqty
            : (product.qty < product.saleminqty
              ? product.saleminqty
              : product.qty);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (shouldDecrement) {
            const productqty = shouldUpdateByqty
              ? (found.qty - product.qty < found.saleminqty
                ? found.saleminqty
                : found.qty - product.qty)
              : (found.qty - found.addminqty < found.saleminqty
                ? found.saleminqty
                : found.qty - found.addminqty);
            found.qty = productqty;
          } else {
            const productqty = shouldUpdateByqty
              ? (found.availableqty !== 0 && found.qty + product.qty > found.availableqty
                ? found.availableqty
                : found.qty + product.qty)
              : (found.availableqty !== 0 && found.qty + found.addminqty > found.availableqty
                ? found.availableqty
                : found.qty + found.addminqty);
            found.qty = productqty;
          }
        }
        products.splice(index, 1, found);
      }
    } else {
      product.qty = product.availableqty !== 0 && product.qty > product.availableqty
        ? product.availableqty
        : (product.qty < product.saleminqty
          ? product.saleminqty
          : product.qty);
      products.push(product);
    }

    return products;
  };

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET ALL PACKAGE
      case this.model.all.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.all.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.all.response:
        return { ...state, packageAll: action.payload.data };

      // GET PACKAGE DETAIL
      case this.model.detail.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.detail.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.detail.response:
        return { ...state, packageDetail: action.payload.data };

      // GET PACKAGE INFORMATION
      case this.model.info.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.info.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.info.response:
        return { ...state, images: action.payload.data[0].images, info: action.payload.data[0].products[0] };

      case 'CART_INCREMENT_PACKAGE_PRODUCT_LOCALLY':
        try {
          let { products } = state.packageDetail;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            product.qty = product.saleminqty || 1;
          }

          console.log(state);

          return {
            ...state,
            packageDetail: {
              ...state.packageDetail,
              products: this.updateReduxStore(products, product),
            },
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case 'CART_DECREMENT_PACKAGE_PRODUCT_LOCALLY':
        try {
          let { products } = state.packageDetail;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            product.qty = product.saleminqty || 1;
          }

          return {
            ...state,
            packageDetail: {
              ...state.packageDetail,
              products: this.updateReduxStore(products, product, false, true),
            },
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case 'CART_UPDATE_PACKAGE_PRODUCT_BY_QTY_LOCALLY':
        try {
          let { products } = state.packageDetail;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            product.qty = product.saleminqty || 1;
          }

          return {
            ...state,
            packageDetail: {
              ...state.packageDetail,
              products: this.updateReduxStore(products, product, true),
            },
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      default:
        return state;
    }
  }
}

export default Model;
