/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
import _ from "lodash";
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
    from = "",
    shouldOverride = false,
    shouldDecrement = false,
    shouldUpdateByQty = false,
  ) => {
    try {
      if (typeof products === "string") {
        products = JSON.parse(products);
      }

      if (product.error !== undefined) {
        product.error = undefined;
      }

      let found = products.find(prod => prod.skucd === product.skucd);

      if (found) {
        const index = products.map(prod => prod.skucd).indexOf(found.skucd);

        if (index !== -1) {
          if (shouldOverride) {
            let qty = product.qty || product.addminqty || 1;
            qty = product.addminqty > 1
              ? Math.round(qty / product.addminqty) * product.addminqty
              : qty;

            if (found.isgift) {
              if (found.qty < found.addminqty) {
                found.qty = found.addminqty;
                found.error = "204";
              } else {
                found.qty = qty;
              }
            } else {
              if (found.availableqty > 0) {
                if (found.salemaxqty > 0) {
                  if (qty > found.salemaxqty) {
                    found.qty = found.salemaxqty;
                    found.error = "202";
                  } else if (qty < found.addminqty) {
                    found.qty = found.addminqty;
                    found.error = "204";
                  } else {
                    found.qty = qty;
                  }
                } else if (qty > found.availableqty) {
                  found.qty = found.availableqty;
                  found.error = from === "package"
                    ? "205"
                    : from === "recipe"
                      ? "206"
                      : "200";
                } else if (qty < found.addminqty) {
                  found.qty = found.addminqty;
                  found.error = "204";
                } else {
                  found.qty = qty;
                }
              } else {
                found.error = from === "package"
                  ? "205"
                  : from === "recipe"
                    ? "206"
                    : "200";
              }
            }
          } else if (shouldDecrement) {
            if (shouldUpdateByQty) {
              const qty = product.qty || product.addminqty || 1;
              if (found.qty - qty < found.addminqty) {
                found.qty = found.addminqty;
                found.error = "204";
              } else {
                found.qty -= qty;
              }
            } else if (found.qty - found.addminqty < found.addminqty) {
              found.qty = found.addminqty;
              found.error = "204";
            } else {
              found.qty -= found.addminqty;
            }
          } else if (shouldUpdateByQty) {
            const qty = product.qty === 0 ? 0 : (product.qty || product.addminqty || 1);
            if (found.isgift) {
              found.qty += qty;
            } else if (found.availableqty > 0) {
              if (found.salemaxqty > 0) {
                if (found.qty + qty > found.salemaxqty) {
                  found.qty = found.salemaxqty;
                  found.error = "202";
                } else {
                  found.qty += qty;
                }
              } else if (found.qty + qty > found.availableqty) {
                found.qty = found.availableqty;
                found.error = from === "package"
                  ? "205"
                  : from === "recipe"
                    ? "206"
                    : "200";
              } else {
                found.qty += qty;
              }
            } else {
              found.error = from === "package"
                ? "205"
                : from === "recipe"
                  ? "206"
                  : "200";
            }
          } else {
            if (found.isgift) {
              found.qty += found.addminqty || 1;
            } else {
              if (found.availableqty > 0) {
                if (found.salemaxqty > 0) {
                  if (found.qty + found.addminqty > found.salemaxqty) {
                    found.qty = found.salemaxqty;
                    found.error = "202";
                  } else {
                    found.qty += found.addminqty || 1;
                  }
                } else if (found.qty + found.addminqty > found.availableqty) {
                  found.qty = found.availableqty;
                  found.error = from === "package"
                    ? "205"
                    : from === "recipe"
                      ? "206"
                      : "200";
                } else {
                  found.qty += found.addminqty || 1;
                }
              } else {
                found.error = from === "package"
                  ? "205"
                  : from === "recipe"
                    ? "206"
                    : "200";
              }
            }
          }
          products.splice(index, 1, found);
        } else {
          throw new Error("Бараа олдсонгүй");
        }
      } else {
        if (shouldUpdateByQty) {
          const qty = product.qty === 0
            ? 0
            : (product.qty || product.addminqty || 1);

          if (product.isgift) {
            product.qty = qty;
          } else {
            if (product.availableqty > 0) {
              if (product.salemaxqty > 0) {
                if (qty > product.salemaxqty) {
                  product.qty = product.salemaxqty;
                  product.error = "202";
                } else {
                  product.qty = qty;
                }
              } else {
                if (qty > product.availableqty) {
                  product.qty = product.availableqty;
                  product.error = from === "package"
                    ? "205"
                    : from === "recipe"
                      ? "206"
                      : "200";
                } else {
                  product.qty = qty;
                }
              }
            } else {
              product.error = from === "package"
                ? "205"
                : from === "recipe"
                  ? "206"
                  : "200";
            }
          }
        } else {
          if (!product.isgift) {
            if (product.availableqty > 0) {
              if (product.salemaxqty > 0) {
                if (product.qty) {
                  if (product.qty > product.salemaxqty) {
                    product.qty = product.salemaxqty;
                    product.error = "202";
                  } else {
                    // NOT NECESSARY
                  }
                } else {
                  product.qty = product.addminqty || 1;
                }
              } else {
                if (product.qty) {
                  if (product.qty > product.availableqty) {
                    product.qty = product.availableqty;
                    product.error = from === "package"
                      ? "205"
                      : from === "recipe"
                        ? "206"
                        : "200";
                  } else {
                    // NOT NECESSARY
                  }
                } else {
                  product.qty = product.addminqty || 1;
                }
              }
            } else {
              product.error = from === "package"
                ? "205"
                : from === "recipe"
                  ? "206"
                  : "200";
            }
          }
        }

        products.push(product);
      }
      return products;
    } catch (error) {
      return console.log('error: ', error);
    }
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
          console.log('action.payload: ', action.payload);
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
        let products = action.payload.success ? action.payload.data : action.payload.data.items;
        return { ...state, products };

      case "CART_DECREMENT_PRODUCT_LOCALLY":
        try {
          return {
            ...state,
            products: this.updateReduxStore(
              state.products,
              action.payload,
              "",
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
        products = action.payload.success ? action.payload.data : action.payload.data.items;
        return { ...state, products };

      case "CART_INCREASE_PRODUCT_BY_QTY_LOCALLY":
        try {
          let { products } = state;
          let product = action.payload;
          console.log('action.payload: ', action.payload);
          console.log('state: ', state);

          // const found = products.find(prod => prod.skucd === product.skucd || product.skucd);

          // if (!found && product.qty < product.addminqty) {
          //   product.qty = product.addminqty || 1;
          // }

          return {
            ...state,
            products: this.updateReduxStore(
              products,
              product,
              "",
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
        products = action.payload.success ? action.payload.data : action.payload.data.items;
        return { ...state, products };

      case "CART_UPDATE_PRODUCT_BY_QTY_LOCALLY":
        try {
          const { products } = state;
          const product = action.payload;

          // const found = products.find(prod => prod.skucd === product.skucd);

          // if (!found && product.qty < product.addminqty) {
          //   product.qty = product.addminqty || 1;
          // }

          return {
            ...state,
            products: this.updateReduxStore(products, product, "", true),
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
        products = action.payload.success ? action.payload.data : action.payload.data.items;
        return { ...state, products };

      case "CART_REMOVE_PRODUCT_LOCALLY":
        try {
          let { products } = state;
          let product = action.payload;

          // const found = products.find(prod => prod.skucd === product.skucd);

          // if (!found) {
          //   throw new Error("Бараа олдсонгүй!");
          // }

          products = products.filter(prod => prod.skucd !== product.skucd);

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

          // const found = products.find(prod => prod.skucd === action.payload.data);

          // if (!found) {
          //   throw new Error("Бараа олдсонгүй!");
          // }

          products = products.filter(prod => prod.skucd !== action.payload.data);

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
        return { ...state, products: action.payload.data.items };

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
            products = this.updateReduxStore(products, prod, "recipe");
          });

          const errors = products.filter(prod => prod.error !== undefined);

          return {
            ...state,
            products: products.filter(prod => prod.error === undefined),
            errors: errors.length > 0 ? errors : [],
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementRecipeProductsRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementRecipeProductsRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementRecipeProductsRemotely.response:
        return { ...state, products: action.payload.data.items };

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
            products = this.updateReduxStore(products, prod, "package");
          });

          const errors = products.filter(prod => prod.error !== undefined);

          return {
            ...state,
            products: products.filter(prod => prod.error === undefined),
            errors: errors.length > 0 ? errors : [],
          };
        } catch (e) {
          console.log(e);
        }
        return state;

      case this.model.incrementPackageProductsRemotely.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.incrementPackageProductsRemotely.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.incrementPackageProductsRemotely.response:
        return { ...state, products: action.payload.data.items };

      case "CART_INCREASE_PACKAGE_PRODUCTS_BY_QTY_LOCALLY":
        try {
          let { products } = state;

          action.payload.forEach((prod) => {
            products = this.updateReduxStore(
              products,
              prod,
              "package",
              false,
              false,
              true,
            );
          });

          const errors = products.filter(prod => prod.error !== undefined);

          return {
            ...state,
            products: products.filter(prod => prod.error === undefined),
            errors: errors.length > 0 ? errors : [],
          };
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
