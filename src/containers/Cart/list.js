/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import React from "react";
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message, Affix } from 'antd';

const formatter = new Intl.NumberFormat("en-US");

class Cart extends React.Component {
  changeQties = products => products.map((product) => {
    if (product.saleminqty > 1) {
      product.qty /= product.saleminqty;
    }

    return product;
  });

  // eslint-disable-next-line consistent-return
  handleConfirmClick = async () => {
    if (this.props.isLogged) {
      const result = await this.props.confirmCartRemotely();
      const { intl } = this.props;

      if (!result.payload.success) {
        result.payload.data.forEach(code => message.warning(intl.formatMessage({ id: code })));

        return <Redirect to="/cart" />;
      }
    } else {
      return <Redirect to={{ pathname: "/checkout" }} push />;
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
    this.props.addWishList({ skucd: product.cd }).then((res) => {
      if (res.payload.success) {
        setTimeout(() => {
          this.props.removeAddedWishColor();
        }, 500);
        this.props.getWish();
      }
    });
  };

  // eslint-disable-next-line consistent-return
  handleRemoveClick = product => async (e) => {
    e.preventDefault();

    const { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      if (this.props.isLogged) {
        const result = await this.props.removeProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: found.cd,
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
    let { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      found.qty = parseInt(e.target.value, 10);

      found.qty = found.saleminqty || 1;

      if (this.props.isLogged) {
        const result = await this.props.updateProductByQtyRemotely({
          skucd: found.cd,
          qty: found.qty,
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
        this.props.updateProductByQtyLocally(found);

        const updated = this.props.products.find(prod => prod.cd === found.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
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

    let found = products.find(prod => prod.cd === product.cd);
    if (found) {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          skucd: found.cd,
          qty: found.qty + found.saleminqty,
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

        const updated = this.props.products.find(prod => prod.cd === found.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
            qty: updated.qty,
          }));
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line consistent-return
  handleDecrementClick = async (product) => {
    let { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);
    if (found) {
      if (this.props.isLogged) {
        // const productQty =
        //   found.qty - found.saleminqty < found.saleminqty
        //     ? found.saleminqty
        //     : found.qty - found.saleminqty;
        const result = await this.props.decrementProductRemotely({
          skucd: found.cd,
          qty: found.qty - found.saleminqty,
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

        const updated = this.props.products.find(prod => prod.cd === found.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
            qty: updated.qty,
          }));
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line arrow-parens
  getUnitPrice = product => {
    if (product.sprice) {
      if (
        product.issalekg &&
        product.kgproduct &&
        product.kgproduct[0] &&
        product.kgproduct[0].salegramprice
      ) {
        // Хямдарсан бөгөөд кг-ын бараа
        return {
          price: product.kgproduct[0].salegramprice,
          sprice: product.kgproduct[0].salegramprice,
        };
      }

      // Хямдарсан бараа
      return { price: product.price, sprice: product.sprice };
    }

    if (
      product.issalekg &&
      product.kgproduct &&
      product.kgproduct[0] &&
      product.kgproduct[0].salegramprice
    ) {
      // Хямдраагүй бөгөөд кг-ын бараа
      return { price: product.kgproduct[0].salegramprice, sprice: null };
    }

    // Хямдраагүй бараа
    return { price: product.price, sprice: null };
  };

  // eslint-disable-next-line arrow-parens
  renderUnitPrice = product => {
    if (product.sprice) {
      if (product.issalekg && product.kgproduct && product.kgproduct[0]) {
        return (
          <p className="price" style={{ textAlign: 'end' }}>
            <strong>
              {formatter.format(this.getUnitPrice(product).sprice)}₮
            </strong>
            {product.kgproduct[0].salegram && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.8em",
                  color: "#999",
                }}
              >
                {product.kgproduct[0].salegram} гр-н үнэ
              </span>
            )}
          </p>
        );
      }

      return (
        <p className="price" style={{ textAlign: 'end' }}>
          <strong>
            {formatter.format(this.getUnitPrice(product).sprice)}₮
          </strong>
          <span
            style={{
              display: "block",
              fontSize: "0.8em",
              textDecoration: "line-through",
              color: "#999",
            }}
          >
            {formatter.format(this.getUnitPrice(product).price)}
          </span>
        </p>
      );
    }

    if (product.issalekg && product.kgproduct && product.kgproduct[0]) {
      return (
        <p className="price" style={{ textAlign: 'end' }}>
          <strong>{formatter.format(this.getUnitPrice(product).price)}₮</strong>
          {product.kgproduct[0].salegram && (
            <span
              style={{
                display: "block",
                fontSize: "0.8em",
                color: "#999",
              }}
            >
              {product.kgproduct[0].salegram} гр-н үнэ
            </span>
          )}
        </p>
      );
    }

    return (
      <p className="price" style={{ textAlign: 'end' }}>
        <strong>{formatter.format(this.getUnitPrice(product).price)}₮</strong>
      </p>
    );
  };

  renderTotalQty = () => {
    const { products } = this.props;

    return products && products.reduce((acc, cur) => (
      acc + (cur.saleminqty > 1 ? cur.qty / cur.saleminqty : cur.qty)
    ), 0);
  };

  renderTotalPrice = (product = null) => {
    if (product) {
      const price =
        this.getUnitPrice(product).sprice || this.getUnitPrice(product).price;

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
        const unitPrice =
          this.getUnitPrice(cur).sprice || this.getUnitPrice(cur).price;
        // eslint-disable-next-line no-mixed-operators
        return acc + unitPrice * cur.qty;
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
            <strong><FormattedMessage id="shared.sidebar.title.wishlist" /></strong>
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
                        <span>{lang === "mn" ? wishlistProd.skunm : wishlistProd.skunm_en}</span>
                        <strong>
                          {formatter.format(
                            wishlistProd.sprice
                              ? wishlistProd.sprice
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
            <span className="text-uppercase"><FormattedMessage id="shared.sidebar.button.showAll" /></span>
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
        <div style={{ textAlign: "center" }}>
          <FontAwesomeIcon icon={["fas", "shopping-basket"]} /> <FormattedMessage id="cart.info.empty" />
        </div>
      );

      if (products && products.length > 0) {
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
                <th className="column-1 cart-table-product-name">
                  <FormattedMessage id="cart.table.productName" />
                </th>
                <th className="column-2 cart-table-unit-price">
                  <FormattedMessage id="cart.table.unitPrice" />
                </th>
                <th className="column-3 cart-table-qty">
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
                  <td>
                    <div className="flex-this">
                      <div className="image-container default">
                        <Link to={prod.route || ""}>
                          <span
                            className="image"
                            style={{
                              backgroundImage: `url(${
                                process.env.IMAGE
                                }${prod.img || prod.imgnm || prod.url || ""})`,
                            }}
                          />
                        </Link>
                      </div>
                      <div className="info-container">
                        <Link
                          to={prod.route || ""}
                          style={{ color: "#6c757d" }}
                        >
                          <strong>{lang === "mn" ? prod.name || prod.title : prod.name_en || prod.title_en}</strong>
                          <span>{lang === "mn" ? prod.featuretxt || prod.feature : prod.featuretxt_en || prod.feature_en}</span>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>{this.renderUnitPrice(prod)}</td>
                  <td>
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
                  <td
                    style={{
                      paddingRight: "20px",
                      textAlign: "right",
                    }}
                  >
                    {this.renderTotalPrice(prod)}
                  </td>
                </tr>
                <tr className="table-action">
                  <td colSpan="2" style={{ fontSize: "0.8em" }}>
                    {lang === "mn" ? prod.deliveryinfo : prod.deliveryInfo_en}
                  </td>
                  <td colSpan="2" style={{ paddinRight: "30px" }}>
                    <div className="text-right single-action">
                      <ul className="list-unstyled">
                        <li>
                          <Link
                            to=""
                            onClick={e => this.handleSaveClick(e, prod)}
                          >
                            <i className="fa fa-heart" aria-hidden="true" />{" "}
                            <span><FormattedMessage id="cart.table.button.save" /></span>
                          </Link>
                        </li>
                        <li>
                          <Link to="" onClick={this.handleRemoveClick(prod)}>
                            <i className="fa fa-times" aria-hidden="true" />{" "}
                            <span><FormattedMessage id="cart.table.button.remove" /></span>
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
                    <h5 className="title">
                      <span><FormattedMessage id="cart.table.title" /></span>
                    </h5>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-link pull-right"
                      style={{ marginTop: "15px" }}
                      onClick={this.handleClearClick}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />{" "}
                      <span className="text-uppercase"><FormattedMessage id="cart.button.clear" /></span>
                    </button>
                  </div>
                </div>
                <div className="cart-table table-responsive">
                  {this.renderContent()}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 pad10">
                <Affix offsetTop={170}>
                  <div className="cart-info">
                    <h5 className="title">
                      <span><FormattedMessage id="shared.sidebar.title.payment" /></span>
                    </h5>

                    <div className="block cart-info-container">
                      <p className="count">
                        <span><FormattedMessage id="shared.sidebar.label.total" />: </span>
                        <span>{this.renderTotalQty()}<FormattedMessage id="shared.sidebar.label.unit" /></span>
                      </p>
                      {staticinfo && (
                        <p className="delivery">
                          <span><FormattedMessage id="shared.sidebar.title.deliveryInfo" />: </span>
                          {/* {console.log(this.state)} */}
                          <span>{lang === "mn" ? staticinfo.deliverytxt : staticinfo.deliverytxt_en}</span>
                        </p>
                      )}
                      <p className="total flex-space">
                        <span><FormattedMessage id="shared.sidebar.label.totalPrice" />: </span>
                        <strong>
                          {formatter.format(this.renderTotalPrice())}₮
                        </strong>
                      </p>
                      <Link
                        to="/checkout"
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
                </Affix>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Cart);
