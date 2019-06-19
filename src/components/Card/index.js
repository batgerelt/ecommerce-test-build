/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Rate, message } from "antd";
import { connect } from "react-redux";

import { toast } from "react-toastify";
import { css } from "glamor";

import store from "../../store";
import { updateCart } from "../../actions/cart";
import { signOut, showLoginModal } from "../../actions/login";
import api from "../../api";
import Label from "../Label";
import withCart from "../HOC/withCart";
import { IMAGE, CARD_TYPES, LABEL_TYPES } from "../../utils/consts";

import "./Card.css";
import { UPDATE_CART } from "../../actions/types";

const formatter = new Intl.NumberFormat("en-US");

class Card extends React.Component {
  oneSave = (item) => {
    api.product
      .addWishList({ custid: this.props.user.id, skucd: item.cd })
      .then((res) => {
        if (res.success) {
          message.success("Амжилттай хадгаллаа.");
        }
      });
  };

  getPackageData = async (id) => {
    await api.packageInfo
      .findAllProducts({
        id,
      })
      .then((res) => {
        if (res.success) {
          res.data[0].products.map((item) => {
            this.oneSave(item);
          });
        }
      });
  };

  getRecipeData = async (recipeid) => {
    await api.recipe
      .findAllProducts({
        id: recipeid,
      })
      .then((res) => {
        if (res.success) {
          res.data[0].products.map((item) => {
            this.oneSave(item);
          });
        }
      });
  };

  handleSave = item => (e) => {
    e.preventDefault();
    if (this.props.isLoggedIn && this.props.user) {
      if (item.recipeid) {
        this.getRecipeData(item.recipeid);
      }
      if (item.id) {
        this.getPackageData(item.id);
      } else {
        this.oneSave(item);
      }
    } else {
      this.handleLoginClick(e);
    }
  };

  handleLoginClick = (e) => {
    e.preventDefault();
    this.props.showLoginModal();
  };

  handleAddToCart = item => (e) => {
    e.preventDefault();

    let products = [];
    if (item.recipeid) {
      // Хоолны жор
      api.recipe.findAllProducts({ id: item.recipeid }).then((res) => {
        if (res.success) {
          products = res.data[0].products;
          if (products.length) {
            products.reduce((acc, next) => acc.then(() => this.props.onUpdateCart(next)), Promise.resolve());
          }
        } else {
          /* this.props.onNotify(res.message); */
        }
      });
    } else if (item.id) {
      // Багц
      api.packageInfo.findAllProducts({ id: item.id }).then((res) => {
        if (res.success) {
          products = res.data[0].products;
          if (products.length) {
            products.reduce((acc, next) => acc.then(() => this.props.onUpdateCart(next)), Promise.resolve());
          }
        } else {
          /* this.props.onNotify(res.message); */
        }
      });
    } else {
      // Бараа
      this.handleUpdateCart(item);
    }
  };

  handleNotify = message =>
    toast(message, {
      autoClose: 5000,
      progressClassName: css({
        background: "#feb415",
      }),
    });

  getUnitPrice = (product) => {
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

  handleUpdateCart = (product, shouldOverride = false) => {
    if (!product) {
      this.handleNotify("Бараа олдсонгүй");
      return;
    }

    const {
      cd,
      name,
      saleminqty,
      salemaxqty,
      addminqty,
      availableqty,
      isgift,
    } = product;
    let { qty } = product;

    let { cart } = this.props;
    if (!cart) {
      cart = { products: [], totalQty: 0, totalPrice: 0 };
    }

    let found = cart.products.find(prod => prod.cd === cd);
    const qtyInCart = found ? found.qty : 0;

    if (isNaN(qty)) {
      if (qtyInCart > 0) {
        if (qtyInCart > saleminqty) {
          qty = addminqty;
        } else {
          qty = saleminqty;
        }
      } else {
        qty = saleminqty;
      }
    }

    let targetQty = shouldOverride
      ? Math.round(qty / addminqty) * addminqty
      : Math.round((qty + qtyInCart) / addminqty) * addminqty;

    if (targetQty < saleminqty) {
      this.handleNotify(
        `"${name}" барааг хамгийн багадаа "${saleminqty}" ширхэгээр худалдан авах боломжтой байна`,
      );
      return;
    } else if (targetQty > salemaxqty && salemaxqty !== 0 && isgift !== 0) {
      if (targetQty > availableqty) {
        this.handleNotify(`"${name}" барааны нөөц хүрэлцэхгүй байна`);
      } else {
        this.handleNotify(
          `"${name}" барааг хамгийн ихдээ "${salemaxqty}" ширхэгээр худалдан авах боломжтой байнаaaa`,
        );
      }
      return;
    }

    api.product
      .isAvailable({
        custid:
          this.props.isLoggedIn && this.props.user ? this.props.user.id : 0,
        skucd: cd,
        qty: targetQty,
        iscart: shouldOverride ? 1 : 0,
      })
      .then((res) => {
        if (res.success) {
          if (found) {
            found.qty = targetQty;
            const i = cart.products.map(prod => prod.cd).indexOf(found.cd);
            if (i !== -1) {
              cart.products.splice(i, 1, found);
            }
          } else {
            product.qty = targetQty;
            cart.products.push(product);
          }

          const qties = cart.products.map(prod => prod.qty);
          cart.totalQty = qties.reduce((acc, cur) => acc + cur);
          const prices = cart.products.map((prod) => {
            const price =
              this.getUnitPrice(prod).sprice || this.getUnitPrice(prod).price;
            return price * prod.qty;
          });
          cart.totalPrice = prices.reduce((acc, cur) => acc + cur);

          store.dispatch({
            type: UPDATE_CART,
            payload: {
              products: cart.products,
              totalQty: cart.totalQty,
              totalPrice: cart.totalPrice,
            },
          });

          // this.props.updateCart({
          //   products: cart.products,
          //   totalQty: cart.totalQty,
          //   totalPrice: cart.totalPrice
          // });

          this.handleNotify(`Таны сагсанд "${name}" бараа ${qty}ш нэмэгдлээ`);
        } else {
          this.handleNotify(res.message);
        }
      });
  };

  render() {
    const {
      type, item, isLastInRow, className,
    } = this.props;
    let prices;
    if (!item) {
      return null;
    }

    if (item.sprice || item.price) {
      let priceTitle = "";

      if (item.id) {
        priceTitle = <span style={{ fontWeight: "normal" }}>Багцын үнэ:</span>;
      } else if (item.recipeid) {
        priceTitle = <span style={{ fontWeight: "normal" }}>Орцын үнэ:</span>;
      }

      if (item.sprice) {
        prices = (
          <div className="row">
            {!!priceTitle && (
              <div className="col-md-6" style={{ textAlign: "left" }}>
                {priceTitle}
              </div>
            )}
            <div className={`col-md-${priceTitle ? "6" : "12"}`}>
              <small className="sale">
                {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
              </small>
              <span className="current">
                {isNaN(item.sprice) ? 0 : formatter.format(item.sprice)}₮
              </span>
            </div>
          </div>
        );
      } else {
        prices = (
          <div className="row">
            {!!priceTitle && (
              <div className="col-md-6" style={{ textAlign: "left" }}>
                {priceTitle}
              </div>
            )}
            <div className={`col-md-${priceTitle ? "6" : "12"}`}>
              <span className="current">
                {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
              </span>
            </div>
          </div>
        );
      }
    }

    let isDisabled = true;
    if (
      item.id ||
      item.recipeid ||
      item.availableqty > 0 ||
      item.isgift !== 0
    ) {
      isDisabled = false;
    }

    const hover = (
      <div className="search-hover">
        <Link to="" onClick={this.handleSave(item)}>
          <i className="fa fa-heart-o" aria-hidden="true" />
          <span />
        </Link>
        <Link
          to=""
          onClick={this.handleAddToCart(item)}
          style={{
            color: isDisabled ? "rgba(255, 155, 0, 0.5)" : "#ff9b00",
            fontSize: "1.6em",
            marginBottom: "8px",
            pointerEvents: isDisabled ? "none" : "auto",
          }}
        >
          <i className="fa fa-cart-plus" aria-hidden="true" />
        </Link>
      </div>
    );

    switch (type) {
      case CARD_TYPES.slim:
        return (
          <div
            className={`col-five pad10${
              isLastInRow ? " d-none d-xl-block lol" : " col-md-3 col-6"
            }`}
          >
            <div className="single-product small-product sale-product timed-product">
              <div className="image-container">
                <Link to={item.route ? item.route : ""}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${IMAGE + item.img})`,
                    }}
                  />
                </Link>
                {item.tags &&
                  item.tags.map((label, index) => (
                    <Label
                      key={index}
                      type={LABEL_TYPES.vertical}
                      data={label}
                      seq={index}
                    />
                  ))}
                {hover}
              </div>
              <div className="info-container">
                <Link to={item.route ? item.route : ""} className="name">
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name
                      ? item.name
                      : item.packagenm
                      ? item.packagenm
                      : ""}
                  </span>
                </Link>
                <Link to={item.route ? item.route : ""} className="cat">
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.shortnm
                      ? item.shortnm
                      : item.featuretxt
                      ? item.featuretxt
                      : ""}
                  </span>
                </Link>

                <Rate
                  allowHalf
                  disabled
                  defaultValue={0}
                  value={item.rate / 2}
                />
                <br />
                <Link to={item.route ? item.route : ""} className="price">
                  {prices}
                </Link>
              </div>
            </div>
          </div>
        );
      case CARD_TYPES.wide:
        return (
          <div className="col-md-4 pad10">
            <div className="single-product big-product sale-product timed-product">
              <div className="image-container">
                <Link to={item.route ? item.route : ""}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${IMAGE + item.img})`,
                    }}
                  />
                </Link>
                {item.tags &&
                  item.tags.map((label, index) => (
                    <Label
                      key={index}
                      type={LABEL_TYPES.vertical}
                      data={label}
                      seq={index}
                    />
                  ))}
                {hover}
              </div>
              <div className="info-container">
                <Link to={item.route ? item.route : ""} className="name">
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name
                      ? item.name
                      : item.packagenm
                      ? item.packagenm
                      : ""}
                  </span>
                </Link>
                <Link to={item.route ? item.route : ""} className="cat">
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.shortnm
                      ? item.shortnm
                      : item.featuretxt
                      ? item.featuretxt
                      : ""}
                  </span>
                </Link>

                <Rate
                  allowHalf
                  disabled
                  defaultValue={0}
                  value={item.rate / 2}
                />
                <br />
                <Link to={item.route ? item.route : ""} className="price">
                  {prices}
                </Link>
              </div>
            </div>
          </div>
        );
      case CARD_TYPES.tile:
        return (
          <div
            className={`single-product big-product food-post food-${
              className || "short"
            }`}
          >
            <div className="image-container">
              <Link to={item.route ? item.route : ""}>
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(${IMAGE + item.img})`,
                  }}
                />
              </Link>
              {item.tags &&
                item.tags.map((label, index) => (
                  <Label
                    key={index}
                    type={LABEL_TYPES.vertical}
                    data={label}
                    seq={index}
                  />
                ))}
              {hover}
            </div>
            <div className="info-container">
              <Link to={item.route ? item.route : ""} className="name">
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.recipenm}
                </span>
              </Link>
              <Link to={item.route ? item.route : ""} className="cat">
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.featuretxt}
                </span>
              </Link>
              <br />
              <Link to={item.route ? item.route : ""} className="price">
                {prices}
              </Link>
            </div>
          </div>
        );
      case CARD_TYPES.list:
        return (
          <div className="single-product list-product sale-product">
            <div className="image-container">
              <Link to={item.route ? item.route : ""}>
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(${IMAGE + item.img})`,
                  }}
                />
              </Link>
            </div>
            <div className="info-container">
              <Link to={item.route ? item.route : ""} className="name">
                <span>{item.name}</span>
              </Link>
              <Link to={item.route ? item.route : ""} className="cat">
                <span>{item.featuretxt}</span>
              </Link>
              <Rate allowHalf disabled defaultValue={0} value={item.rate / 2} />
              <Link
                to={item.route ? item.route : ""}
                className="price"
                style={{
                  padding: 0,
                  top: "auto",
                  bottom: "55px",
                  right: "20px",
                  left: "auto",
                  fontSize: "1rem",
                }}
              >
                {prices}
              </Link>
              {item.tags &&
                item.tags.map((label, index) => (
                  <Label
                    key={index}
                    type={LABEL_TYPES.horizontal}
                    data={label}
                    seq={index}
                  />
                ))}
              <div className="cart-container">
                <Link
                  to=""
                  className="wishlist"
                  onClick={this.handleSave(item)}
                >
                  <i className="fa fa-heart-o" aria-hidden="true" />
                </Link>
                <a
                  onClick={this.handleAddToCart(item)}
                  style={{
                    fontSize: "1.1rem",
                  }}
                >
                  <i className="fa fa-cart-plus" aria-hidden="true" />
                  <span />
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }
}

Card.propTypes = {
  type: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  isLastInRow: PropTypes.bool,
  className: PropTypes.string,
};

export default withCart(
  connect(
    null,
    { updateCart, showLoginModal },
  )(Card),
);
