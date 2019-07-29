import _ from "lodash";
import { toast } from "react-toastify";
import { css } from "glamor";
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
    products: [],
  };

  constructor(data = {}) {
    super(data);
    this.persist = true;
    if (data.model) {
      this.model = {
        products: {
          request: this.buildActionName("request", data.model, "products"),
          response: this.buildActionName("response", data.model, "products"),
          error: this.buildActionName("error", data.model, "products"),
        },
        incrementProductRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "incrementProductRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "incrementProductRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "incrementProductRemotely",
          ),
        },
        decrementProductRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "decrementProductRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "decrementProductRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "decrementProductRemotely",
          ),
        },
        increaseProductByQtyRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "increaseProductByQtyRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "increaseProductByQtyRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "increaseProductByQtyRemotely",
          ),
        },
        updateProductByQtyRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "updateProductByQtyRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "updateProductByQtyRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "updateProductByQtyRemotely",
          ),
        },
        removeProductRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "removeProductRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "removeProductRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "removeProductRemotely",
          ),
        },
        increaseProductsByQtyRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "increaseProductsByQtyRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "increaseProductsByQtyRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "increaseProductsByQtyRemotely",
          ),
        },
        recipeProducts: {
          request: this.buildActionName(
            "request",
            data.model,
            "recipeProducts",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "recipeProducts",
          ),
          error: this.buildActionName("error", data.model, "recipeProducts"),
        },
        incrementRecipeProductsRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "incrementRecipeProductsRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "incrementRecipeProductsRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "incrementRecipeProductsRemotely",
          ),
        },
        packageProducts: {
          request: this.buildActionName(
            "request",
            data.model,
            "packageProducts",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "packageProducts",
          ),
          error: this.buildActionName("error", data.model, "packageProducts"),
        },
        incrementPackageProductsRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "incrementPackageProductsRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "incrementPackageProductsRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "incrementPackageProductsRemotely",
          ),
        },
        clearRemotely: {
          request: this.buildActionName("request", data.model, "clearRemotely"),
          response: this.buildActionName(
            "response",
            data.model,
            "clearRemotely",
          ),
          error: this.buildActionName("error", data.model, "clearRemotely"),
        },
        replaceProductsRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "replaceProductsRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "replaceProductsRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "replaceProductsRemotely",
          ),
        },
        confirmCartRemotely: {
          request: this.buildActionName(
            "request",
            data.model,
            "confirmCartRemotely",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "confirmCartRemotely",
          ),
          error: this.buildActionName(
            "error",
            data.model,
            "confirmCartRemotely",
          ),
        },
      };
    }
  }

  handleNotify = (message) => {
    toast(message, {
      autoClose: 5000,
      position: "top-center",
      progressClassName: css({
        background: "#feb415",
      }),
    });
  };

  getProducts = () =>
    asyncFn({
      url: `/basket/list`,
      method: "GET",
      model: this.model.products,
    });

  incrementProductLocally = product => ({
    type: "CART_INCREMENT_PRODUCT_LOCALLY",
    payload: product,
  });

  incrementProductRemotely = ({ skucd, qty, iscart }) =>
    asyncFn({
      url: `/basket/add/${skucd}/${qty}/${iscart}`,
      method: "POST",
      model: this.model.incrementProductRemotely,
    });

  decrementProductLocally = product => ({
    type: "CART_DECREMENT_PRODUCT_LOCALLY",
    payload: product,
  });

  decrementProductRemotely = ({ skucd, qty, iscart }) =>
    asyncFn({
      url: `/basket/add/${skucd}/${qty}/${iscart}`,
      method: "POST",
      model: this.model.decrementProductRemotely,
    });

  increaseProductByQtyLocally = product => ({
    type: "CART_INCREASE_PRODUCT_BY_QTY_LOCALLY",
    payload: product,
  });

  increaseProductByQtyRemotely = ({ skucd, qty, iscart }) =>
    asyncFn({
      url: `/basket/add/${skucd}/${qty}/${iscart}`,
      method: "POST",
      model: this.model.increaseProductByQtyRemotely,
    });

  updateProductByQtyLocally = product => ({
    type: "CART_UPDATE_PRODUCT_BY_QTY_LOCALLY",
    payload: product,
  });

  updateProductByQtyRemotely = ({ skucd, qty, iscart }) =>
    asyncFn({
      url: `/basket/add/${skucd}/${qty}/${iscart}`,
      method: "POST",
      model: this.model.updateProductByQtyRemotely,
    });

  removeProductLocally = product => ({
    type: "CART_REMOVE_PRODUCT_LOCALLY",
    payload: product,
  });

  removeProductRemotely = ({ skucd }) =>
    asyncFn({
      url: `/basket/delete/${skucd}`,
      method: "DELETE",
      model: this.model.removeProductRemotely,
    });

  increaseProductsByQtyRemotely = ({ body }) =>
    asyncFn({
      body,
      url: `/basket`,
      method: "POST",
      model: this.model.increaseProductsByQtyRemotely,
    });

  getRecipeProducts = ({ id }) =>
    asyncFn({
      url: `/cookrecipe/${id}/products`,
      method: "GET",
      model: this.model.recipeProducts,
    });

  incrementRecipeProductsLocally = products => ({
    type: "CART_INCREMENT_RECIPE_PRODUCTS_LOCALLY",
    payload: products,
  });

  incrementRecipeProductsRemotely = ({ recipeid }) =>
    asyncFn({
      url: `/basket/cookrecipe/${recipeid}`,
      method: "POST",
      model: this.model.incrementRecipeProductsRemotely,
    });

  getPackageProducts = ({ id }) =>
    asyncFn({
      url: `/package/${id}`,
      method: "GET",
      model: this.model.packageProducts,
    });

  incrementPackageProductsLocally = products => ({
    type: "CART_INCREMENT_PACKAGE_PRODUCTS_LOCALLY",
    payload: products,
  });

  incrementPackageProductsRemotely = ({ packageid }) =>
    asyncFn({
      url: `/basket/package/${packageid}`,
      method: "POST",
      model: this.model.incrementPackageProductsRemotely,
    });

  increasePackageProductsByQtyLocally = products => ({
    type: "CART_INCREASE_PACKAGE_PRODUCTS_BY_QTY_LOCALLY",
    payload: products,
  });

  clearLocally = () => ({
    type: "CART_CLEAR_LOCALLY",
  });

  clearRemotely = () =>
    asyncFn({
      url: `/basket/clear`,
      method: "DELETE",
      model: this.model.clearRemotely,
    });

  replaceProductsRemotely = ({ body }) =>
    asyncFn({
      body,
      url: `/basket/delete/list`,
      method: "DELETE",
      model: this.model.replaceProductsRemotely,
    });

  confirmCartRemotely = () =>
    asyncFn({
      url: `/basket/confirm`,
      method: "GET",
      model: this.model.confirmCartRemotely,
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
              found.qty = found.saleminqty;
            } else {
              found.qty = product.qty;
            }
          } else if (found.availableqty > 0) {
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
                found.qty = found.saleminqty;
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
                found.qty = found.saleminqty;
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
                ? found.saleminqty
                : found.qty - product.qty
              : found.qty - found.addminqty < found.saleminqty
                ? found.saleminqty
                : found.qty - found.addminqty;
            found.qty = productQty;
          } else {
            // eslint-disable-next-line no-lonely-if
            if (shouldUpdateByQty) {
              // eslint-disable-next-line no-lonely-if
              if (found.isgift === 1) {
                found.qty += product.qty;
              } else if (found.availableqty > 0) {
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
              } else if (found.availableqty > 0) {
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
                    found.qty += found.addminqty;
                  }
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (found.qty + found.addminqty > found.availableqty) {
                    found.qty = found.availableqty;
                    this.handleNotify(
                      `"${found.name}" барааны нөөц хүрэлцэхгүй байна.`,
                    );
                  } else {
                    found.qty += found.addminqty;
                  }
                }
              }
            }
          }
        }
        products.splice(index, 1, found);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (product.isgift === 1) {
        if (product.qty < product.saleminqty) {
          product.qty = product.saleminqty;
        }
        products.push(product);
      } else if (product.availableqty > 0) {
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
        products.push(product);
      }
    }

    return products;
  };

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.model.products.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.products.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.products.response:
        return { ...state, products: action.payload.data };

      case "CART_INCREMENT_PRODUCT_LOCALLY":
        try {
          return {
            ...state,
            products: this.updateReduxStore(state.products, action.payload),
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementProductRemotely.response:
        console.log(state);
        console.log(action.payload);
        return { ...state, products: action.payload.data };

      case "CART_DECREMENT_PRODUCT_LOCALLY":
        try {
          return {
            ...state,
            products: this.updateReduxStore(
              state.products,
              action.payload,
              false,
              true,
            ),
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.decrementProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.decrementProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.decrementProductRemotely.response:
        return { ...state, products: action.payload.data };

      case "CART_INCREASE_PRODUCT_BY_QTY_LOCALLY":
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found && product.qty < product.saleminqty) {
            product.qty = product.saleminqty || 1;
          }

          return {
            ...state,
            products: this.updateReduxStore(
              products,
              product,
              false,
              false,
              true,
            ),
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.increaseProductByQtyRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.increaseProductByQtyRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.increaseProductByQtyRemotely.response:
        return { ...state, products: action.payload.data };

      case "CART_UPDATE_PRODUCT_BY_QTY_LOCALLY":
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found && product.qty < product.saleminqty) {
            product.qty = product.saleminqty || 1;
          }

          return {
            ...state,
            products: this.updateReduxStore(products, product, true),
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.updateProductByQtyRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.updateProductByQtyRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.updateProductByQtyRemotely.response:
        console.log("action.payload.data: ", action.payload.data);
        return { ...state, products: action.payload.data };

      case "CART_REMOVE_PRODUCT_LOCALLY":
        try {
          let { products } = state;
          let product = action.payload;

          const found = products.find(prod => prod.cd === product.cd);

          if (!found) {
            throw new Error("Бараа олдсонгүй!");
          }

          products = products.filter(prod => prod.cd !== found.cd);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.removeProductRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.removeProductRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.removeProductRemotely.response:
        try {
          let { products } = state;

          const found = products.find(prod => prod.cd === action.payload.data);

          if (!found) {
            throw new Error("Бараа олдсонгүй!");
          }

          products = products.filter(prod => prod.cd !== found.cd);

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.increaseProductsByQtyRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.increaseProductsByQtyRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.increaseProductsByQtyRemotely.response:
        return { ...state, products: action.payload.data.success };

      case this.model.recipeProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.recipeProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.recipeProducts.response:
        return state;

      case "CART_INCREMENT_RECIPE_PRODUCTS_LOCALLY":
        try {
          let { products } = state;

          action.payload.forEach((prod) => {
            products = this.updateReduxStore(products, prod);
          });

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementRecipeProductsRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementRecipeProductsRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementRecipeProductsRemotely.response:
        return { ...state, products: action.payload.data.success };

      case this.model.packageProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.packageProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.packageProducts.response:
        return state;

      case "CART_INCREMENT_PACKAGE_PRODUCTS_LOCALLY":
        try {
          let { products } = state;

          action.payload.forEach((prod) => {
            products = this.updateReduxStore(products, prod);
          });

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementPackageProductsRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementPackageProductsRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementPackageProductsRemotely.response:
        return { ...state, products: action.payload.data.success };

      case "CART_INCREASE_PACKAGE_PRODUCTS_BY_QTY_LOCALLY":
        try {
          let { products } = state;

          action.payload.forEach((prod) => {
            products = this.updateReduxStore(
              products,
              prod,
              false,
              false,
              true,
            );
          });

          return { ...state, products };
        } catch (e) {
          console.log(e);
        }
        return state;

      case "CART_CLEAR_LOCALLY":
        return { ...state, products: [] };

      case this.model.clearRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.clearRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.clearRemotely.response:
        return {
          ...state,
          products: action.payload.data === null ? [] : action.payload.data,
        };

      case this.model.replaceProductsRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.replaceProductsRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.replaceProductsRemotely.response:
        return { ...state, products: action.payload.data };

      case this.model.confirmCartRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.confirmCartRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.confirmCartRemotely.response:
        return state;

      default:
        return state;
    }
  };
}

export default Model;
