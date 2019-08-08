/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Rate, message } from "antd";
import { Label, ElasticLabel } from "../";
import { CARD_TYPES, LABEL_TYPES } from "../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");

class Card extends React.Component {
  state = {
    changeHeart: false,
  };

  handleNotify = () => { };

  // eslint-disable-next-line consistent-return
  handleIncrement = async (item) => {
    const { intl } = this.props;

    try {
      if (this.props.auth.isLogged) {
        if (item.skucd) {
          const result = await this.props.incrementProductRemotely({
            skucd: item.skucd,
            qty: item.addminqty || 1,
            iscart: 0,
          });

          if (!result.payload.success) {
            const messages = defineMessages({
              warning: {
                id: result.payload.code,
              },
            });

            return message.warning(intl.formatMessage(messages.warning, { name: result.payload.data.values[0], qty: result.payload.data.values[1] }));
          }
        } else if (item.cd) {
          const result = await this.props.incrementProductRemotely({
            skucd: item.cd,
            qty: item.addminqty || 1,
            iscart: 0,
          });

          if (!result.payload.success) {
            const messages = defineMessages({
              warning: {
                id: result.payload.code,
              },
            });

            return message.warning(intl.formatMessage(messages.warning, { name: result.payload.data.values[0], qty: result.payload.data.values[1] }));
          }
        } else if (item.recipeid) {
          const result = await this.props.incrementRecipeProductsRemotely({
            recipeid: item.recipeid,
          });

          if (!result.payload.success) {
            return message.warning(result.payload.message);
          }

          if (result.payload.data.fail.length > 0) {
            result.payload.data.fail.forEach((msg) => {
              const messages = defineMessages({
                warning: {
                  id: msg.code,
                },
              });
              message.warning(intl.formatMessage(messages.warning, { name: msg.value.name, qty: msg.value.qty }));
            });
          }
        } else if (item.id) {
          const result = await this.props.incrementPackageProductsRemotely({
            packageid: item.id,
          });

          if (!result.payload.success) {
            return message.warning(result.payload.message);
          }

          if (result.payload.data.fail.length > 0) {
            result.payload.data.fail.forEach((msg) => {
              const messages = defineMessages({
                warning: {
                  id: msg.code,
                },
              });
              message.warning(intl.formatMessage(messages.warning, { name: msg.value.name, qty: msg.value.qty }));
            });
          }
        } else {
          //
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (item.skucd) {
          item.insymd = Date.now();
          item.cd = item.skucd;
          this.props.incrementProductLocally(item);

          const updated = this.props.products.find(prod => prod.cd === item.skucd);

          if (updated && updated.error !== undefined) {
            const messages = defineMessages({
              warning: {
                id: updated.error,
              },
            });
            message.warning(intl.formatMessage(messages.warning, { name: updated.name, qty: updated.qty }));
          }
        } else if (item.cd) {
          item.insymd = Date.now();
          this.props.incrementProductLocally(item);

          const updated = this.props.products.find(prod => prod.cd === item.cd);

          if (updated && updated.error !== undefined) {
            const messages = defineMessages({
              warning: {
                id: updated.error,
              },
            });
            message.warning(intl.formatMessage(messages.warning, { name: updated.name, qty: updated.qty }));
          }
        } else if (item.recipeid) {
          const result = await this.props.getRecipeProducts({
            id: item.recipeid,
          });

          if (!result.payload.success) {
            return message.warning(result.payload.message);
          }

          const products = result.payload.data.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementRecipeProductsLocally(products);

          const errors = this.props.errors.filter(prod => prod.recipeid === item.recipeid);

          errors.forEach((updated) => {
            const messages = defineMessages({
              warning: {
                id: updated.error,
              },
            });
            message.warning(intl.formatMessage(messages.warning, { name: updated.name, qty: updated.qty }));
          });
        } else if (item.id) {
          const result = await this.props.getPackageProducts({
            id: item.id,
          });

          if (!result.payload.success) {
            return message.warning(result.payload.message);
          }

          const products = result.payload.data.products.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementPackageProductsLocally(products);

          const errors = this.props.errors.filter(prod => prod.recipeid === item.recipeid);

          errors.forEach((updated) => {
            const messages = defineMessages({
              warning: {
                id: updated.error,
              },
            });
            message.warning(intl.formatMessage(messages.warning, { name: updated.name, qty: updated.qty }));
          });
        } else {
          //
        }
      }
    } catch (e) {
      return console.log(e);
    }
  };

  handleSaveClick = () => {
    if (localStorage.getItem("auth") === null) {
      this.props.LoginModal.handleLoginModal();
    } else {
      const { item } = this.props;
      this.setState({ changeHeart: true });
      if (item.skucd !== undefined) {
        this.addWishList(item.skucd);
      } else if (item.cd !== undefined) {
        this.addWishList(item.cd);
      } else if (item.recipeid !== undefined) {
        this.props.addWishListRecipe({ id: item.recipeid }).then((res) => {
          if (res.payload.success) {
            this.setState({ changeHeart: !this.state.changeHeart });
            this.removeAddedWishColorTime();
          }
        });
      } else {
        this.props.addWishListPackage({ id: item.id }).then((res) => {
          if (res.payload.success) {
            this.setState({ changeHeart: !this.state.changeHeart });
            this.removeAddedWishColorTime();
          }
        });
      }
    }
  }

  addWishList = (skucd) => {
    this.props.addWishList({ skucd }).then((res) => {
      const { addWishList, removeAddedWishColor } = this.props;
      addWishList({ skucd }).then((res) => {
        if (res.payload.success) {
          this.removeAddedWishColorTime();
        }
      });
    });
  }

  removeAddedWishColorTime = () => {
    const { removeAddedWishColor } = this.props;
    setTimeout(() => {
      removeAddedWishColor();
    }, 500);
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
          priceTitle = (
            <span style={{ fontWeight: "normal" }}><FormattedMessage id="card.package.label.price" />:</span>
          );
        } else if (item.recipeid) {
          priceTitle = <span style={{ fontWeight: "normal" }}><FormattedMessage id="card.recipe.label.price" />:</span>;
        }

        if (item.sprice) {
          prices = (
            <div className="row">
              {!!priceTitle && (
                <div
                  className="col-md-6 no-padding-r"
                  style={{ textAlign: "left" }}
                >
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
                <div
                  className="col-md-6 no-padding-r"
                  style={{ textAlign: "left" }}
                >
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
            <i
              className={
                this.state.changeHeart ? "fa fa-heart" : "fa fa-heart-o"
              }
              aria-hidden="true"
              style={{ color: "#feb415" }}
            />
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
                        backgroundSize: "contain",
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
                      {item.name ? item.name : item.packagenm ? item.packagenm : item.title ? item.title : item.recipenm}
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
                  {
                    item.id === undefined && item.recipeid === undefined ?
                      <Rate
                        allowHalf
                        disabled
                        defaultValue={0}
                        value={item.rate / 2}
                      /> : ""
                  }
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
                  <Link
                    to={item.route ? item.route : `/productdetail/${item.skucd ? item.skucd : item.cd}`}
                  // onClick={() => this.props.getProductDetail({ skucd: item.skucd ? item.skucd : item.cd })}
                  >
                    <span
                      className="image"
                      style={{
                        backgroundImage: `url(${process.env.IMAGE + (item.img === undefined ? item.imgnm : item.img)})`,
                        backgroundSize: "contain",
                      }}
                    />
                  </Link>
                  {/* elastic search тэй холбоотой барааны шошго өөр төрлөөр ирж байгаа */}
                  {
                    this.props.elastic ? <ElasticLabel data={item} tags={this.props.tags} /> :
                      item.tags && item.tags.map((label, index) => (
                        <Label
                          key={index}
                          type={LABEL_TYPES.vertical}
                          data={label}
                          seq={index}
                        />
                      ))
                  }
                  {hover}
                </div>
                <div className="info-container">
                  <Link to={item.route ? item.route : `productdetail/${item.skucd}`} className="name">
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name ? item.name : item.packagenm ? item.packagenm : item.title ? item.title : item.recipenm}
                    </span>
                  </Link>
                  <Link to={item.route ? item.route : `productdetail/${item.skucd}`} className="cat">
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.shortnm ? item.shortnm : item.featuretxt ? item.featuretxt : item.feature}
                    </span>
                  </Link>

                  {
                    item.id === undefined && item.recipeid === undefined ?
                      <Rate
                        allowHalf
                        disabled
                        defaultValue={0}
                        value={item.rate / 2}
                      /> : ""
                  }
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
            <div className={`single-product big-product food-post food-${className || "short"}`}>
              <div className="image-container">
                <Link to={item.route ? item.route : ""}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${process.env.IMAGE + (item.img === undefined ? item.imgnm : item.img)})`,
                      backgroundSize: "contain",
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
                      backgroundImage: `url(${process.env.IMAGE + (item.img === undefined ? item.imgnm : item.img)})`,
                      backgroundSize: "contain",
                    }}
                  />
                </Link>
              </div>
              <div className="info-container">
                <Link to={item.route ? item.route : ""} className="name">
                  <span>{item.name ? item.name : item.title}</span>
                </Link>
                <Link to={item.route ? item.route : ""} className="cat">
                  <span>{item.featuretxt ? item.featuretxt : item.feature}</span>
                </Link>
                {
                  item.id === undefined && item.recipeid === undefined ?
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={0}
                      value={item.rate / 2}
                    /> : ""
                }
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
                    <i
                      className={
                        this.state.changeHeart ? "fa fa-heart" : "fa fa-heart-o"
                      }
                      aria-hidden="true"
                    />
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
  };

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

export default injectIntl(connect(mapStateToProps)(Card));
