/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import React from "react";
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message, Affix } from 'antd';
import { isMobile } from "react-device-detect";

const formatter = new Intl.NumberFormat("en-US");

class Cart extends React.Component {
  state = {
    proceedRoute: "/checkout",
  };

  changeQties = products => products.map((product) => {
    if (product.addminqty > 1) {
      product.qty /= product.addminqty;
    }

    return product;
  });

  // eslint-disable-next-line consistent-return
  handleConfirmClick = async () => {
    try {
      if (this.props.isLogged) {
        let result = await this.props.confirmCartRemotely();
        const { intl } = this.props;

        if (result.payload && result.payload.data && result.payload.data.length > 0) {
          if (result.payload.data[0].data.values.length > 0) {
            result.payload.data.forEach(msg => (
              message.warning(intl.formatMessage(
                { id: msg.code },
                { names: msg.data.values.join(", ") },
              ))
            ));
            this.setState({ proceedRoute: "/cart" });
          }
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  // eslint-disable-next-line consistent-return
  handleClearClick = async () => {
    const { intl } = this.props;

    if (this.props.isLogged) {
      const result = await this.props.clearRemotely();
      if (!result.payload.success) {
        message.warning(intl.formatMessage({ id: result.payload.code }));
      }
    } else {
      this.props.clearLocally();
    }
  };

  handleSaveClick = (e, product) => {
    e.preventDefault();
    if (this.props.isLogged) {
      this.props.addWishList({ skucd: product.skucd || product.skucd }).then((res) => {
        if (res.payload.success) {
          setTimeout(() => {
            this.props.removeAddedWishColor();
          }, 500);
          this.props.getWish();
        }
      });
    } else {
      this.props.LoginModal.handleLoginModal();
    }
  };

  // eslint-disable-next-line consistent-return
  handleRemoveClick = product => async (e) => {
    e.preventDefault();

    const { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);

    if (found) {
      if (this.props.isLogged) {
        const result = await this.props.removeProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: found.skucd,
        });
        if (!result.payload.success) {
          message.warning(intl.formatMessage({ id: result.payload.code }));
        }
      } else {
        this.props.removeProductLocally(product);
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line consistent-return
  handleInputChange = product => async (e) => {
    let { intl, products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);

    if (found) {
      const qty = isNaN(e.target.value)
        ? found.addminqty
        : parseInt(e.target.value);
      found.qty = parseInt(qty, 10);

      if (this.props.isLogged) {
        const result = await this.props.updateProductByQtyRemotely({
          skucd: found.skucd,
          qty: found.addminqty > 1 ? Math.round(found.qty / found.addminqty) * found.addminqty : found.qty,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }));
        }
      } else {
        console.log('found: ', found);
        this.props.updateProductByQtyLocally(found);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.title,
            qty: updated.qty,
          }));
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line consistent-return
  handleIncrementClick = async (product) => {
    let { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);
    if (found) {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          skucd: found.skucd,
          qty: found.qty + found.addminqty,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }));
        }
      } else {
        this.props.incrementProductLocally(found);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
          message.warning(intl.formatMessage(messages.error, {
            name: updated.title,
            qty: updated.qty,
          }));
        }
      }
    } else {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          skucd: product.skucd,
          qty: product.addminqty || 1,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }));
        }
      }
    }
  };

  // eslint-disable-next-line consistent-return
  handleDecrementClick = async (product) => {
    let { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);
    if (found) {
      if (this.props.isLogged) {
        // const productQty =
        //   found.qty - found.addminqty < found.addminqty
        //     ? found.addminqty
        //     : found.qty - found.addminqty;
        const result = await this.props.decrementProductRemotely({
          skucd: found.skucd,
          qty: found.qty - found.addminqty,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }));
        }
      } else {
        this.props.decrementProductLocally(found);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
          message.warning(intl.formatMessage(messages.error, {
            name: updated.title,
            qty: updated.qty,
          }));
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line arrow-parens
  renderUnitPrice = product => {
    if (product.discountprice || product.salepercent) {
      if (product.issalekg) {
        return (
          <p className="price">
            <span className="discount">
              {formatter.format(product.discountprice || product.currentprice)}₮
            </span>
            <span className="current">
              {formatter.format(product.price)}₮
            </span>
            <span className="pricetag">
              {product.pricetag}-н үнэ
            </span>
          </p>
        );
      }

      return (
        <p className="price">
          <span className="current">
            {formatter.format(product.saleminqty > 1
              ? product.currentprice / product.saleminqty
              : product.currentprice,
            )}₮
          </span>
          <span className="discount">
            {formatter.format(product.saleminqty > 1
              ? product.price / product.saleminqty
              : product.price,
            )}₮
          </span>
        </p>
      );
    }

    if (product.issalekg) {
      return (
        <p className="price">
          <span className="current">
            {formatter.format(product.currentprice)}₮
          </span>
          <span className="pricetag">
            {product.pricetag}-н үнэ
          </span>
        </p>
      );
    }

    return (
      <p className="price">
        <span className="current">
          {formatter.format(product.saleminqty > 1
            ? product.price / product.saleminqty
            : product.price,
          )}₮
        </span>
      </p>
    );
  };

  renderTotalQty = () => {
    const { products } = this.props;

    return products && products.reduce((acc, cur) => (
      acc + (cur.qty ? cur.qty : 0)
    ), 0);
  };

  renderTotalPrice = (product = null) => {
    if (product) {
      let { price } = product;

      if (product.addminqty > 1) {
        price = product.currentunitprice;

        if (product.salepercent && product.discountunitprice) {
          price = product.discountunitprice;
        }
      } else if (product.issalekg && product.currentprice) {
        price = product.currentprice;

        if (product.salepercent && product.discountprice) {
          price = product.discountprice;
        }
      } else if (product.salepercent && product.discountprice) {
        price = product.discountprice;
      }

      return (
        <span className="price total">
          <strong>{formatter.format(price * product.qty)}₮</strong>
        </span>
      );
    }

    const { products } = this.props;

    return (
      products &&
      products.reduce((acc, cur) => {
        let { price } = cur;

        if (cur.addminqty > 1) {
          price = cur.currentunitprice;

          if (cur.salepercent && cur.discountunitprice) {
            price = cur.discountunitprice;
          }
        } else if (cur.issalekg && cur.currentprice) {
          price = cur.currentprice;

          if (cur.salepercent && cur.discountprice) {
            price = cur.discountprice;
          }
        } else if (cur.salepercent && cur.discountprice) {
          price = cur.discountprice;
        }

        return acc + (price * (cur.qty ? cur.qty : 0));
      }, 0)
    );
  };

  renderWishlistProducts = () => {
    if (!this.props.isLogged) {
      return null;
    }
    const wishlistProducts = this.props.wish;
    const lang = this.props.intl.locale;
    return (
      wishlistProducts &&
      wishlistProducts.length > 0 && (
        <div className="block fav-products">
          <p className="title">
            <FormattedMessage id="shared.sidebar.title.wishlist" />
          </p>
          <ul className="list-unstyled">
            {wishlistProducts.map((wishlistProd, index) => (
              <li className="flex-this" key={index}>
                <div className="image-container default">
                  <Link to={wishlistProd.route || ""}>
                    <span
                      className="image"
                      style={{
                        backgroundImage: `url(${process.env.IMAGE}${
                          wishlistProd.img
                          })`,
                      }}
                    />
                  </Link>
                </div>
                <div className="info-container">
                  <div className="flex-space">
                    <Link to={wishlistProd.route || ""}>
                      <div className="text">
                        <span>{lang === "mn" ? wishlistProd.title : wishlistProd.title_en}</span>
                        <strong>
                          {formatter.format(
                            wishlistProd.discountprice
                              ? wishlistProd.discountprice || wishlistProd.currentprice
                              : wishlistProd.price
                                ? wishlistProd.price
                                : 0,
                          )}
                          ₮
                        </strong>
                      </div>
                    </Link>
                    <button
                      className="action btn btn-link"
                      onClick={() => this.handleIncrementClick(wishlistProd)}
                    >
                      <i className="fa fa-cart-plus" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/profile/wish" className="btn btn-gray btn-block">
            <span className="text-uppercase">
              <FormattedMessage id="shared.sidebar.button.showAll" />
            </span>
          </Link>
        </div>
      )
    );
  };

  renderContent = () => {
    try {
      let { products } = this.props;
      const lang = this.props.intl.locale;

      let content = (
        <div className="empty-cart">
          <FontAwesomeIcon icon={["fas", "shopping-basket"]} /> <FormattedMessage id="cart.info.empty" />
        </div>
      );

      if (products && products.length > 0) {
        products = products.filter(product => product.qty);

        products.sort((a, b) => {
          if (typeof a.insymd === "string") {
            a.insymd = new Date(a.insymd).getTime();
          }

          if (typeof b.insymd === "string") {
            b.insymd = new Date(b.insymd).getTime();
          }

          return b.insymd - a.insymd;
        });

        content = (
          <table className="table table-borderless">
            <thead className="thead-light">
              <tr>
                <th className="column-1">
                  <FormattedMessage id="cart.table.productName" />
                </th>
                <th className="column-2">
                  <FormattedMessage id="cart.table.unitPrice" />
                </th>
                <th className="column-3">
                  <FormattedMessage id="cart.table.count" />
                </th>
                <th className="column-4">
                  <p className="price total">
                    <FormattedMessage id="cart.table.price" />
                  </p>
                </th>
              </tr>
            </thead>
            {products.map((prod, index) => (
              <tbody key={index}>
                <tr>
                  <td className="column-1">
                    <div className="flex-this">
                      <div className="image-container default">
                        <Link to={prod.route || `/productdetail/${prod.skucd}` || ""}>
                          <span
                            className="image"
                            style={{
                              backgroundImage: `url(${process.env.IMAGE}${prod.img || prod.imgnm || prod.url || ""})`,
                            }}
                          />
                        </Link>
                      </div>
                      <div className="info-container">
                        <Link
                          to={prod.route || ""}
                          style={{ color: "#6c757d" }}
                        >
                          <strong>
                            {lang === "mn"
                              ? prod.title || prod.title
                              : prod.title_en || prod.title_en
                            }
                          </strong>
                          <span className="featured">
                            {lang === "mn"
                              ? prod.featuretxt || prod.feature
                              : prod.featuretxt_en || prod.feature_en
                            }
                          </span>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="column-2">{this.renderUnitPrice(prod)}</td>
                  <td className="column-3">
                    <form>
                      <div className="input-group e-input-group">
                        <div className="input-group-prepend" id="button-addon4">
                          <button
                            onClick={() => this.handleDecrementClick(prod)}
                            className="btn"
                            type="button"
                          >
                            <i className="fa fa-minus" aria-hidden="true" />
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={prod.qty}
                          name="productQty"
                          maxLength={5}
                          onChange={this.handleInputChange(prod)}
                        />
                        <div className="input-group-append" id="button-addon4">
                          <button
                            onClick={() => this.handleIncrementClick(prod)}
                            className="btn"
                            type="button"
                          >
                            <i className="fa fa-plus" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>
                  <td className="column-4">
                    {this.renderTotalPrice(prod)}
                  </td>
                </tr>
                <tr className="table-action">
                  <td colSpan="2">
                    {lang === "mn" ? prod.deliveryinfo : prod.deliveryInfo_en}
                  </td>
                  <td colSpan="2">
                    <div className="text-right single-action">
                      <ul className="list-unstyled">
                        <li>
                          <Link
                            to=""
                            className="upper-first"
                            onClick={e => this.handleSaveClick(e, prod)}
                          >
                            <i className="fa fa-heart" aria-hidden="true" />{" "}
                            {
                              !isMobile
                                ? (
                                  <span>
                                    <FormattedMessage id="cart.table.button.save" />
                                  </span>
                                )
                                : ""
                            }
                          </Link>
                        </li>
                        <li>
                          <Link to="" onClick={this.handleRemoveClick(prod)}>
                            <i className="fa fa-times" aria-hidden="true" />{" "}
                            {
                              !isMobile
                                ? (
                                  <span>
                                    <FormattedMessage id="cart.table.button.remove" />
                                  </span>
                                )
                                : ""
                            }
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        );
      }

      return content;
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    const { products, staticinfo } = this.props;
    const lang = this.props.intl.locale;
    return (
      <div className="section">
        <div className="container pad10">
          <div className="cart-container">
            <h1 className="title">
              <span className="text-uppercase"><FormattedMessage id="cart.title" /></span>
            </h1>
            <div className="row row10">
              <div className="col-xl-8 col-lg-8 pad10">
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-link pull-right upper-first btn-clear"
                      onClick={this.handleClearClick}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />{" "}
                      <span className="basket-clear">
                        <FormattedMessage id="cart.button.clear" />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="cart-table table-responsive" id="cart-table-wrapper">
                  {this.renderContent()}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 pad10">
                {/* <Affix offsetTop={170}> */}
                <div className="cart-info filter-sticky">
                  <div className="block cart-info-container">
                    {staticinfo && (
                      <p className="delivery">
                        <span className="title">
                          <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
                        </span>
                        <span>
                          {lang === "mn" ? staticinfo.deliverytxt : staticinfo.deliverytxt_en}
                        </span>
                      </p>
                    )}
                    <div className="total">
                      <p className="flex-space count">
                        <span>
                          <FormattedMessage id="cart.sidebar.label.total" />:{" "}
                        </span>
                        <span>
                          {this.renderTotalQty()}<FormattedMessage id="cart.sidebar.label.unit" />
                        </span>
                      </p>
                      <p className="flex-space">
                        <span>
                          <FormattedMessage id="shared.sidebar.label.totalPrice" />:{" "}
                        </span>
                        <span>
                          {formatter.format(this.renderTotalPrice())}₮
                        </span>
                      </p>
                    </div>
                    <Link
                      to={this.state.proceedRoute}
                      className={`btn btn-main btn-block${
                        products && products.length ? "" : " disabled"
                        }`}
                      onClick={() => this.handleConfirmClick()}
                    >
                      <span className="text-uppercase">
                        <FormattedMessage id="shared.sidebar.button.proceed" />
                      </span>
                    </Link>
                  </div>
                  {this.renderWishlistProducts()}
                </div>
                {/* </Affix> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Cart);
