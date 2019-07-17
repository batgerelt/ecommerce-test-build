/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React from "react";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { Rate, message } from "antd";
import { toast } from "react-toastify";
import { css } from "glamor";
import { Label } from "../";
import { CARD_TYPES, LABEL_TYPES } from "../../utils/Consts";
import { LoginModal } from "../Login";
import {
  Auth as AuthModel,
  Cart as CartModel,
} from "../../models";

const formatter = new Intl.NumberFormat("en-US");

class Card extends React.Component {
  handleNotify = (message) => {
    toast(message, {
      autoClose: 5000,
      position: 'top-center',
      progressClassName: css({
        background: "#feb415",
      }),
    });
  };

  // eslint-disable-next-line consistent-return
  handleIncrement = async (item) => {
    try {
      if (this.props.auth.isLogged) {
        // eslint-disable-next-line no-lonely-if
        if (item.cd) {
          const result = await this.props.incrementProductRemotely({
            custid: this.props.auth.data[0].info.customerInfo.id,
            skucd: item.cd,
            qty: item.addminqty || 1,
            iscart: 0,
          });
          if (!result.payload.success) {
            return this.handleNotify(result.payload.message);
          }
        } else if (item.recipeid) {
          //
        } else if (item.id) {
          //
        } else {
          //
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (item.cd) {
          this.props.incrementProductLocally(item);
        } else if (item.recipeid) {
          const result = await this.props.getRecipeProducts({
            id: item.recipeid,
          });

          if (!result.payload.success) {
            return this.handleNotify(result.payload.message);
          }

          this.props.incrementRecipeProductsLocally(result.payload.data[0].products);
        } else if (item.id) {
          //
        } else {
          //
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleSaveClick = () => {
    if (localStorage.getItem('auth') === null) {
      this.props.LoginModal.handleLoginModal();
    } else {
      const { item, addWishList } = this.props;
      let skucd = item.cd;
      addWishList({ skucd }).then((res) => {
        if (res.payload.success) {
          message.success(res.payload.message);
        }
      });
    }
  }

  renderCards = () => {
    try {
      const {
        shape, item, isLastInRow, className,
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
                <div className="col-md-6 no-padding-r" style={{ textAlign: "left" }}>
                  {priceTitle}
                </div>
              )}
              <div className={`col-md-${priceTitle ? "6" : "12"} no-padding-l`}>
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
                <div className="col-md-6 no-padding-r" style={{ textAlign: "left" }}>
                  {priceTitle}
                </div>
              )}
              <div className={`col-md-${priceTitle ? "6" : "12"} no-padding-l`}>
                <span className="current">
                  {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
                </span>
              </div>
            </div>
          );
        }
      }

      let heartDisabled = true;

      let cartDisabled = true;
      if (
        item.id ||
        item.recipeid ||
        item.availableqty > 0 ||
        item.isgift !== 0
      ) {
        cartDisabled = false;
      }

      const hover = (
        <div className="search-hover">
          <button className="btn btn-link" onClick={this.handleSaveClick}>
            <i className="fa fa-heart-o" aria-hidden="true" />
          </button>
          <button
            onClick={() => this.handleIncrement(item)}
            className="btn btn-link"
            disabled={false}
          >
            <i className="fa fa-cart-plus" aria-hidden="true" />
          </button>
        </div>
      );
      switch (shape) {
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
                        backgroundImage: `url(${process.env.IMAGE + item.img})`,
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
                        backgroundImage: `url(${process.env.IMAGE + item.img})`,
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
                      backgroundImage: `url(${process.env.IMAGE + item.img})`,
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
                      backgroundImage: `url(${process.env.IMAGE + item.img})`,
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
                <div className="cart-container d-flex">
                  <a
                    className="wishlist"
                    style={{
                      fontSize: "1.1rem",
                    }}
                    onClick={this.handleSaveClick}
                  >
                    <i className="fa fa-heart-o" aria-hidden="true" />
                  </a>
                  <a
                    onClick={() => this.handleIncrement(item)}
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
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderCards();
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

Card.propTypes = {
  shape: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  isLastInRow: PropTypes.bool,
  className: PropTypes.string,
};

export default connect(mapStateToProps)(Card);
