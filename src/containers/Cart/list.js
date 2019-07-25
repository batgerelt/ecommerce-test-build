/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { css } from "glamor";

const formatter = new Intl.NumberFormat("en-US");

class Cart extends React.Component {
  state = { deliveryInfo: null };

  async componentDidMount() {
    const result = await this.props.getStaticInfo();

    if (result.payload.success) {
      this.setState({ deliveryInfo: result.payload.data[0].deliverytxt });
    }
  }

  // eslint-disable-next-line arrow-parens
  handleNotify = message => {
    toast(message, {
      autoClose: 5000,
      position: "top-center",
      progressClassName: css({
        // eslint-disable-next-line comma-dangle
        background: "#feb415"
        // eslint-disable-next-line comma-dangle
      })
    });
  };

  // eslint-disable-next-line consistent-return
  handleClearClick = async () => {
    if (this.props.isLogged) {
      const result = await this.props.clearRemotely();
      if (!result.payload.success) {
        this.handleNotify(result.payload.message);
      }
    } else {
      this.props.clearLocally();
    }
  };

  handleSaveClick = (e, product) => {
    e.preventDefault();
    this.props.addWish({ skucd: product.cd }).then((res) => {
      if (res.payload.success) {
        this.props.getWish();
      }
    });
  }

  // eslint-disable-next-line consistent-return
  handleRemoveClick = product => async (e) => {
    e.preventDefault();

    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      if (this.props.isLogged) {
        const result = await this.props.removeProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: found.cd,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
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
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);

    if (found) {
      found.qty = parseInt(e.target.value, 10);

      // eslint-disable-next-line no-restricted-globals
      if (isNaN(found.qty)) {
        found.qty = found.saleminqty || 1;
      }

      if (this.props.isLogged) {
        const result = await this.props.updateProductByQtyRemotely({
          skucd: found.cd,
          qty: found.qty,
          iscart: 1,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
        }
      } else {
        this.props.updateProductByQtyLocally(found);
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line consistent-return
  handleIncrementClick = async (product) => {
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);

    let productQty = product.saleminqty;
    if (found) {
      productQty = found.qty + (found.addminqty || 1);
    }
    product.qty = productQty;

    if (this.props.isLogged) {
      const result = await this.props.incrementProductRemotely({
        skucd: product.cd,
        qty: productQty,
        iscart: 1,
      });
      if (!result.payload.success) {
        this.handleNotify(result.payload.message);
      }
    } else {
      this.props.incrementProductLocally(product);
    }
  };

  // eslint-disable-next-line consistent-return
  handleDecrementClick = async (product) => {
    let { products } = this.props;

    let found = products.find(prod => prod.cd === product.cd);
    if (found) {
      if (this.props.isLogged) {
        const productQty =
          found.qty - found.addminqty < found.saleminqty
            ? found.saleminqty
            : found.qty - found.addminqty;
        const result = await this.props.decrementProductRemotely({
          skucd: found.cd,
          qty: productQty,
          iscart: 1,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
        }
      } else {
        this.props.decrementProductLocally(found);
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
          <p className="price">
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
        <p className="price">
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
        <p className="price">
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
      <p className="price">
        <strong>{formatter.format(this.getUnitPrice(product).price)}₮</strong>
      </p>
    );
  };

  renderTotalQty = () => {
    const { products } = this.props;

    return products && products.reduce((acc, cur) => acc + cur.qty, 0);
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

    return (
      wishlistProducts &&
      wishlistProducts.length > 0 && (
        <div className="block fav-products">
          <p className="title">
            <strong>Хадгалсан бараа</strong>
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
                        <span>{wishlistProd.skunm}</span>
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
            <span className="text-uppercase">Бүх барааг үзэх</span>
          </Link>
        </div>
      )
    );
  };

  renderContent = () => {
    try {
      let { products } = this.props;

      let content = (
        <div style={{ textAlign: "center" }}>
          <FontAwesomeIcon icon={["fas", "shopping-basket"]} /> Таны сагс хоосон
          байна
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
                <th className="column-1" style={{ width: "30%" }}>
                  <span>Бүтээгдэхүүний нэр</span>
                </th>
                <th className="column-2" style={{ width: "24%" }}>
                  Нэгжийн үнэ
                </th>
                <th className="column-3" style={{ width: "24%" }}>
                  Тоо ширхэг
                </th>
                <th className="column-4">
                  <p className="price total">
                    <strong>Барааны үнэ</strong>
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
                                }${prod.img || prod.url || ""})`,
                            }}
                          />
                        </Link>
                      </div>
                      <div className="info-container">
                        <Link
                          to={prod.route || ""}
                          style={{ color: "#6c757d" }}
                        >
                          <strong>{prod.name}</strong>
                          {console.log(prod)}
                          <span>{prod.featuretxt || ""}</span>
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
                        // onKeyDown={this.handleQtyKeyDown(prod)}
                        // onBlur={this.handleQtyBlur(prod)}
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
                  <td colSpan="5" style={{ paddinRight: "30px" }}>
                    <div className="text-right single-action">
                      <ul className="list-unstyled">
                        <li>
                          <Link to="" onClick={e => this.handleSaveClick(e, prod)}>
                            <i className="fa fa-heart" aria-hidden="true" />{" "}
                            <span>Хадгалах</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="" onClick={this.handleRemoveClick(prod)}>
                            <i className="fa fa-times" aria-hidden="true" />{" "}
                            <span>Устгах</span>
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
    const { products } = this.props;
    return (
      <div className="section">
        <div className="container pad10">
          <div className="cart-container">
            <h1 className="title">
              <span className="text-uppercase">Миний сагс</span>
            </h1>
            <div className="row row10">
              <div className="col-xl-8 col-lg-8 pad10">
                <div className="row">
                  <div className="col">
                    <h5 className="title">
                      <span>Сагсан дахь бараанууд</span>
                    </h5>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-link pull-right"
                      style={{ marginTop: "15px" }}
                      onClick={this.handleClearClick}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />{" "}
                      <span className="text-uppercase">Сагс хоослох</span>
                    </button>
                  </div>
                </div>
                <div className="cart-table table-responsive">
                  {this.renderContent()}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 pad10">
                <div className="cart-info">
                  <h5 className="title">
                    <span>Төлбөр</span>
                  </h5>

                  <div className="block cart-info-container">
                    <p className="count">
                      <span>Нийт бараа: </span>
                      <span>{this.renderTotalQty()}ш</span>
                    </p>
                    {this.state.deliveryInfo && (
                      <p className="delivery">
                        <span>Хүргэлт:</span>
                        <span>{this.state.deliveryInfo}</span>
                      </p>
                    )}
                    <p className="total flex-space">
                      <span>Нийт дүн:</span>
                      <strong>
                        {formatter.format(this.renderTotalPrice())}₮
                      </strong>
                    </p>
                    <Link
                      to="/checkout"
                      className={`btn btn-main btn-block${
                        products && products.length ? "" : " disabled"
                        }`}
                    >
                      <span className="text-uppercase">Баталгаажуулах</span>
                    </Link>
                  </div>

                  {this.renderWishlistProducts()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
