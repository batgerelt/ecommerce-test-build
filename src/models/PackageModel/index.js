/* eslint-disable no-restricted-globals */
/* eslint-disable no-lonely-if */
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
    packageCount: 8,
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

  // updateReduxStore = (
  //   products,
  //   product,
  //   shouldDecrement = false,
  //   shouldUpdateByQty = false,
  // ) => {
  //   try {
  //     let found = products.find(prod => prod.skucd === product.skucd);

  //     if (found) {
  //       const index = products.map(prod => prod.skucd).indexOf(found.skucd);

  //       if (index !== -1) {
  //         found.qty = found.qty === 0 ? 0 : (found.qty || found.addminqty || 1);

  //         if (shouldDecrement) {
  //           if (shouldUpdateByQty) {
  //             const qty = product.qty || product.addminqty || 1;
  //             if (found.qty - qty < found.addminqty) {
  //               found.qty = 0;
  //               found.error = "204";
  //             } else {
  //               found.qty -= qty;
  //             }
  //           } else if (found.qty - found.addminqty < found.addminqty) {
  //             found.qty = 0;
  //             found.error = "204";
  //           } else {
  //             found.qty -= found.addminqty;
  //           }
  //         } else if (shouldUpdateByQty) {
  //           const qty = product.qty || product.addminqty || 1;
  //           if (found.isgift) {
  //             found.qty += qty;
  //           } else if (found.availableqty > 0) {
  //             if (found.salemaxqty > 0) {
  //               if (found.qty + qty > found.salemaxqty) {
  //                 found.qty = found.salemaxqty;
  //                 found.error = "202";
  //               } else {
  //                 found.qty += qty;
  //               }
  //             } else if (found.qty + qty > found.availableqty) {
  //               found.qty = found.availableqty;
  //               found.error = "200";
  //             } else {
  //               found.qty += qty;
  //             }
  //           } else {
  //             found.error = "200";
  //           }
  //         } else {
  //           if (found.isgift) {
  //             found.qty += found.addminqty || 1;
  //           } else {
  //             if (found.availableqty > 0) {
  //               if (found.salemaxqty > 0) {
  //                 if (found.qty + found.addminqty > found.salemaxqty) {
  //                   found.qty = found.salemaxqty;
  //                   found.error = "202";
  //                 } else {
  //                   found.qty += found.addminqty || 1;
  //                 }
  //               } else if (found.qty + found.addminqty > found.availableqty) {
  //                 found.qty = found.availableqty;
  //                 found.error = "200";
  //               } else {
  //                 found.qty += found.addminqty || 1;
  //               }
  //             } else {
  //               found.error = "200";
  //             }
  //           }
  //         }
  //         products.splice(index, 1, found);
  //       } else {
  //         throw new Error("Бараа олдсонгүй");
  //       }
  //     } else {
  //       throw new Error("Бараа олдсонгүй");
  //     }
  //     return products;
  //   } catch (error) {
  //     return console.log('error: ', error);
  //   }
  // };

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

      if (from !== "cart") {
        product.insymd = new Date();
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
            // const qty = product.qty === 0 ? 0 : (product.qty || product.addminqty || 1);
            const qty = product.qty || product.addminqty || 1;

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
                const productQty = found.qty;
                found.qty = productQty + qty;
              }
            } else {
              found.error = from === "package"
                ? "205"
                : from === "recipe"
                  ? "206"
                  : "200";
            }
          } else {
            if (from === "recipe") {
              found.recipeid = product.recipeid;
            } else if (from === "package") {
              found.id = product.id;
            }

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
          if (product.isgift) {
            if (!product.qty || isNaN(product.qty)) {
              product.qty = product.addminqty;
            }
          } else {
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

  pushProduct = (products) => {
    let tmp = this.initialState.packageScroll;
    if (products.length !== 0) {
      tmp.push(products);
    }
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
          packageCount: state.packageCount + 8,
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
          images: action.payload.data.images,
          info: action.payload.data.products[0],
        };

      case "CART_INCREMENT_PACKAGE_PRODUCT_LOCALLY":
        try {
          let { products } = state.packageDetail;
          let product = action.payload;

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

          // const found = products.find(prod => prod.skucd === product.skucd);

          // if (!found) {
          //   product.qty = product.addminqty || 1;
          // }

          return {
            ...state,
            packageDetail: {
              ...state.packageDetail,
              products: this.updateReduxStore(products, product, '', false, true),
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

          // const found = products.find(prod => prod.skucd === product.skucd);

          // if (!found) {
          //   product.qty = product.addminqty || 1;
          // }

          return {
            ...state,
            packageDetail: {
              ...state.packageDetail,
              products: this.updateReduxStore(products, product, "", true),
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
