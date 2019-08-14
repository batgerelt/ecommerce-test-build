/* eslint-disable array-callback-return */
/* eslint-disable indent */
import BaseModel from "../BaseModel";
import { asyncFn } from "../utils";

class Model extends BaseModel {
  initialState = {
    current: {
      error: false,
      errorMessage: "",
      isLoading: false,
      data: {},
    },
    package: [],
    packageAll: [],
    packageScroll: [],
    packageDetail: [],
    packageInfo: [],
    packageCount: 0,
    packageRowCount: 1,
    packageFetching: false,
  };

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        all: {
          request: this.buildActionName("request", data.model, "all"),
          response: this.buildActionName("response", data.model, "all"),
          error: this.buildActionName("error", data.model, "all"),
        },
        packageScroll: {
          request: this.buildActionName("request", data.model, "packageScroll"),
          response: this.buildActionName("response", data.model, "packageScroll"),
          error: this.buildActionName("error", data.model, "packageScroll"),
        },
        detail: {
          request: this.buildActionName("request", data.model, "detail"),
          response: this.buildActionName("response", data.model, "detail"),
          error: this.buildActionName("error", data.model, "detail"),
        },
        info: {
          request: this.buildActionName("request", data.model, "info"),
          response: this.buildActionName("response", data.model, "info"),
          error: this.buildActionName("error", data.model, "info"),
        },
      };
    }
  }

  getPackage = ({ order = `price_desc`, start = 0, rowcnt = 20 }) =>
    asyncFn({ url: `/package/${order}/${start}/${rowcnt}`, method: "GET", model: this.model.all });
  getPackageScroll = ({ order = `price_desc`, start = 0, rowcnt = 20 }) =>
    asyncFn({ url: `/package/${order}/${start}/${rowcnt}`, method: "GET", model: this.model.packageScroll });
  getDetailPackage = ({ id }) =>
    asyncFn({ url: `/package/${id}`, method: "GET", model: this.model.detail });
  getInfoPackage = ({ id }) =>
    asyncFn({
      url: `/package/inf/${id}`,
      method: "GET",
      model: this.model.info,
    });

  incrementPackageProductLocally = product => ({
    type: "CART_INCREMENT_PACKAGE_PRODUCT_LOCALLY",
    payload: product,
  });

  decrementPackageProductLocally = product => ({
    type: "CART_DECREMENT_PACKAGE_PRODUCT_LOCALLY",
    payload: product,
  });

  updatePackageProductByQtyLocally = product => ({
    type: "CART_UPDATE_PACKAGE_PRODUCT_BY_QTY_LOCALLY",
    payload: product,
  });

  updateReduxStore = (
    products,
    product,
    shouldOverride = false,
    shouldDecrement = false,
    shouldUpdateByQty = false,
  ) => {
    if (typeof products === "string") {
      products = JSON.parse(products);
    }

    if (product.qty === undefined) {
      product.qty = product.saleminqty || 1;
    }

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      const index = products.map(prod => prod.cd).indexOf(found.cd);

      if (index !== -1) {
        if (shouldOverride) {
          // eslint-disable-next-line no-lonely-if
          if (found.isgift === 1) {
            if (found.qty < found.saleminqty) {
              found.qty = 0;
            } else {
              found.qty = product.qty;
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (found.salemaxqty > 0) {
              // eslint-disable-next-line no-lonely-if
              if (found.qty > found.salemaxqty) {
                found.qty = found.salemaxqty;
                this.handleNotify(
                  `"${found.name}" барааг хамгийн ихдээ "${
                  found.salemaxqty
                  }"-г худалдан авах боломжтой.`,
                );
              } else if (found.qty < found.saleminqty) {
                found.qty = 0;
              } else {
                found.qty = product.qty;
              }
            } else {
              // eslint-disable-next-line no-lonely-if
              if (found.qty > found.availableqty) {
                found.qty = found.availableqty;
                this.handleNotify(
                  `"${found.name}" барааны нөөц хүрэлцэхгүй байна.`,
                );
              } else if (found.qty < found.saleminqty) {
                found.qty = 0;
              } else {
                found.qty = product.qty;
              }
            }
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (shouldDecrement) {
            const productQty = shouldUpdateByQty
              ? found.qty - product.qty < found.saleminqty
                ? 0
                : found.qty - product.qty
              : found.qty - found.addminqty < found.saleminqty
                ? 0
                : found.qty - found.addminqty;
            found.qty = productQty;
          } else {
            // eslint-disable-next-line no-lonely-if
            if (shouldUpdateByQty) {
              // eslint-disable-next-line no-lonely-if
              if (found.isgift === 1) {
                found.qty += product.qty;
              } else {
                // eslint-disable-next-line no-lonely-if
                if (found.salemaxqty > 0) {
                  // eslint-disable-next-line no-lonely-if
                  if (found.qty + product.qty > found.salemaxqty) {
                    found.qty = found.salemaxqty;
                    this.handleNotify(
                      `"${found.name}" барааг хамгийн ихдээ "${
                      found.salemaxqty
                      }"-г худалдан авах боломжтой.`,
                    );
                  } else {
                    found.qty += product.qty;
                  }
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (found.qty + product.qty > found.availableqty) {
                    found.qty = found.availableqty;
                    this.handleNotify(
                      `"${found.name}" барааны нөөц хүрэлцэхгүй байна.`,
                    );
                  } else {
                    found.qty += product.qty;
                  }
                }
              }
            } else {
              // eslint-disable-next-line no-lonely-if
              if (found.isgift === 1) {
                found.qty += found.addminqty;
              } else {
                // eslint-disable-next-line no-lonely-if
                if (found.salemaxqty > 0) {
                  // eslint-disable-next-line no-lonely-if
                  if (found.qty + found.addminqty > found.salemaxqty) {
                    found.qty = found.salemaxqty;
                    this.handleNotify(
                      `"${found.name}" барааг хамгийн ихдээ "${
                      found.salemaxqty
                      }"-г худалдан авах боломжтой.`,
                    );
                  } else {
                    found.qty +=
                      found.qty === 0 ? found.saleminqty : found.addminqty;
                  }
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (found.qty + found.addminqty > found.availableqty) {
                    found.qty = found.availableqty;
                    this.handleNotify(
                      `"${found.name}" барааны нөөц хүрэлцэхгүй байна.`,
                    );
                  } else {
                    console.log("found.qty: ", found.qty);
                    found.qty +=
                      found.qty === 0 ? found.saleminqty : found.addminqty;
                  }
                }
              }
            }
          }
        }
        products.splice(index, 1, found);
      }
    } else {
      if (product.isgift === 1) {
        if (product.qty < product.saleminqty) {
          product.qty = 0;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (product.salemaxqty > 0) {
          // eslint-disable-next-line no-lonely-if
          if (product.qty > product.salemaxqty) {
            product.qty = product.salemaxqty;
            this.handleNotify(
              `"${product.name}" барааг хамгийн ихдээ "${
              product.salemaxqty
              }"-г худалдан авах боломжтой.`,
            );
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (product.qty > product.availableqty) {
            product.qty = product.availableqty;
            this.handleNotify(
              `"${product.name}" барааны нөөц хүрэлцэхгүй байна.`,
            );
          }
        }
      }

      products.push(product);
    }

    return products;
  };

  pushProduct = (products) => {
    let tmp = this.initialState.packageScroll;
    products.map((item, i) => {
      tmp.push(item);
    });
    return tmp;
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET ALL PACKAGE
      case this.model.all.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.all.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.all.response:
        return { ...state, packageAll: action.payload.data.products };

      // GET PACKAGE SCROLL
      case this.model.packageScroll.request:
        return { ...state, packageFetching: true, current: this.requestCase(state.current, action) };
      case this.model.packageScroll.error:
        return { ...state, packageFetching: false, current: this.errorCase(state.current, action) };
      case this.model.packageScroll.response:
        return {
          ...state,
          packageFetching: false,
          packageScroll: this.pushProduct(action.payload.data.products),
          packageRowCount: action.payload.data.count,
          packageCount: state.packageCount + 20,
        };
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
        return {
          ...state,
          images: action.payload.data[0].images,
          info: action.payload.data[0].products[0],
        };

      case "CART_INCREMENT_PACKAGE_PRODUCT_LOCALLY":
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
              products: this.updateReduxStore(products, product),
            },
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case "CART_DECREMENT_PACKAGE_PRODUCT_LOCALLY":
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

      case "CART_UPDATE_PACKAGE_PRODUCT_BY_QTY_LOCALLY":
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
  };
}

export default Model;
