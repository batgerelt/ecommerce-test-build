/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-lonely-if */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { Fragment } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Rate, notification } from "antd";
import { store } from 'react-notifications-component';
import windowSize from 'react-window-size';
import { Label, ElasticLabel, Notification } from "../";
import { CARD_TYPES, LABEL_TYPES } from "../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");

class Card extends React.Component {
  state = {
    changeHeart: false,
  };

  // eslint-disable-next-line consistent-return
  handleIncrement = async (item) => {
    const { intl, elastic } = this.props;
    try {
      if (localStorage.getItem('auth') !== null) {
        if (item.skucd) {
          const result = await this.props.incrementProductRemotely({
            skucd: item.skucd,
            qty: item.addminqty || 1,
            iscart: 0,
          });

          if (!result.payload.success) {
            const messages = defineMessages({
              error: {
                id: result.payload.code,
              },
            });
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage(messages.error, { name: result.payload.data.values[1], qty: result.payload.data.values[2] })} />,
            });
          }
        } else if (item.recipeid) {
          const result = await this.props.incrementRecipeProductsRemotely({
            recipeid: item.recipeid,
          });

          const failedProducts = result.payload.data.fail;

          if (failedProducts.length > 0) {
            const names = failedProducts.map(prod => prod.values[1]);
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification
                type="warning"
                text={intl.formatMessage(
                  { id: result.payload.code },
                  {
                    names: names.join(", "),
                    qty: result.payload.data.qty,
                  },
                )}
              />,
            });
          }
        } else if (item.id) {
          const result = await this.props.incrementPackageProductsRemotely({
            packageid: item.id,
          });

          const failedProducts = result.payload.data.fail;

          if (failedProducts.length > 0) {
            const names = failedProducts.map(prod => prod.values[1]);
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification
                type="warning"
                text={intl.formatMessage(
                  { id: result.payload.code },
                  {
                    names: names.join(", "),
                    qty: result.payload.data.qty,
                  },
                )}
              />,
            });
          }
        } else {
          //
        }
      } else {
        if (item.skucd) {
          item.insymd = Date.now();
          if (elastic) { // elastic -аас явуулах боломжгүй барааны нэмэлт мэдээлэл
            return this.props.getMoreInfoElastic({ skucd: item.skucd }).then((res) => {
              if (item.addminqty <= res.payload.data.availableqty) {
                item.availableqty = res.payload.data.availableqty;
                item.price = res.payload.data.unitprice;
                item.sprice = res.payload.data.unitdiscountprice;
                item.addminqty = res.payload.data.addminqty;
                return this.props.incrementProductLocally(item);
              }
              return store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false,
                },
                content: <Notification
                  type="warning"
                  text={intl.formatMessage(
                    { id: "200" },
                    {
                      name: item.title,
                      qty: item.qty,
                    },
                  )}
                />,
              });
            });
          }
          this.props.incrementProductLocally(item);
          const updated = this.props.products.find(prod => prod.skucd === item.skucd);

          if (updated && updated.error !== undefined) {
            const messages = defineMessages({
              error: {
                id: updated.error,
              },
            });
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification
                type="warning"
                text={intl.formatMessage(
                  messages.error,
                  {
                    name: updated.title,
                    qty: updated.qty,
                  },
                )}
              />,
            });
          }
        } else if (item.recipeid) {
          const result = await this.props.getRecipeProducts({
            id: item.recipeid,
          });

          const products = result.payload.data.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementRecipeProductsLocally(products);

          const errors = this.props.errors.filter(prod => prod.recipeid === item.recipeid);

          if (errors.length > 0) {
            const titles = errors.map(err => err.title);
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification
                type="warning"
                text={intl.formatMessage(
                  { id: "206" },
                  {
                    names: titles.join(", "),
                    qty: products.length - errors.length,
                  },
                )}
              />,
            });
          }
        } else if (item.id) {
          const result = await this.props.getPackageProducts({
            id: item.id,
          });

          const products = result.payload.data.products.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementPackageProductsLocally(products);

          const errors = this.props.errors.filter(prod => prod.recipeid === item.recipeid);

          if (errors.length > 0) {
            const titles = errors.map(err => err.title);
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification
                type="warning"
                text={intl.formatMessage(
                  { id: "205" },
                  {
                    names: titles.join(", "),
                    qty: products.length - errors.length,
                  },
                )}
              />,
            });
          }
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
      } else if (item.skucd !== undefined) {
        this.addWishList(item.skucd);
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
        shape, item, isLastInRow, className, elastic, tags, list, windowWidth, isDiscount,
      } = this.props;
      const lang = this.props.intl.locale;

      let prices;
      if (!item) {
        return null;
      }

      let priceTagSpacing;
      if (windowWidth >= 1200) {
        priceTagSpacing = 60;

        if (shape === CARD_TYPES.wide) {
          priceTagSpacing = 180;
        }
      } else if (windowWidth >= 992) {
        priceTagSpacing = 50;

        if (shape === CARD_TYPES.wide) {
          priceTagSpacing = 120;
        }
      } else if (windowWidth >= 768) {
        priceTagSpacing = 10;

        if (shape === CARD_TYPES.wide) {
          priceTagSpacing = 60;
        }
      } else if (windowWidth >= 568) {
        priceTagSpacing = 60;

        if (shape === CARD_TYPES.wide) {
          priceTagSpacing = 10;
        }
      } else {
        priceTagSpacing = 10;

        if (shape === CARD_TYPES.wide) {
          priceTagSpacing = 150;
        }
      }

      let priceTitle = "";

      if (item.id) {
        priceTitle = (
          <span className="price-title">
            <FormattedMessage id="card.package.label.price" />:
          </span>
        );
      } else if (item.recipeid) {
        priceTitle = (
          <span className="price-title">
            <FormattedMessage id="card.recipe.label.price" />:
          </span>
        );
      }

      if (item.discountprice && item.discountprice !== 0) {
        prices = (
          <Fragment>
            {priceTitle
              ? item.id
                ? <span>{priceTitle}</span>
                : <Fragment>{priceTitle}</Fragment>
              : null
            }

            {/* elastic search price tag */}
            {!item.pricetag ? null : (
              <span className="pricetag" style={{ marginRight: priceTagSpacing }}>
                {lang === "mn"
                  ? item.pricetag
                  : item.pricetag_en === null
                    ? item.pricetag
                    : item.pricetag_en
                }
              </span>
            )}

            <small className="sale">
              {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
            </small>
            <span className="current">
              {isNaN(item.discountprice) ? 0 : formatter.format(item.discountprice)}₮
            </span>
          </Fragment>
        );
        item.discountprice === 0 ?
          prices = (
            <Fragment>
              {!!priceTitle && (
                <Fragment>
                  {priceTitle}
                </Fragment>
              )}

              {/* elastic search price tag */}
              {item.pricetag === null ? null : (
                <span className="pricetag" style={{ marginRight: priceTagSpacing }}>
                  {lang === "mn"
                    ? item.pricetag
                    : item.pricetag_en === null
                      ? item.pricetag
                      : item.pricetag_en
                  }
                </span>
              )}

              <span className="current" >
                {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
              </span>
            </Fragment>
          ) : null;
      } else {
        prices = (
          <Fragment>
            {!!priceTitle && (
              <Fragment>
                {priceTitle}
              </Fragment>
            )}

            {/* elastic search price tag */}
            {item.id || item.recipeid || !item.pricetag ? null : (
              <span className="pricetag" style={{ marginRight: priceTagSpacing }}>
                {lang === "mn"
                  ? item.pricetag
                  : item.pricetag_en === null
                    ? item.pricetag
                    : item.pricetag_en
                }
              </span>
            )}

            <span className="current">
              {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
            </span>
          </Fragment>
        );
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

      let itemName = "";
      let featureText = "";

      if (lang === "mn") {
        if (item.name) {
          itemName = item.name;
        } else if (item.packagenm) {
          itemName = item.packagenm;
        } else if (item.title) {
          itemName = item.title;
        } else if (item.recipenm) {
          itemName = item.recipenm;
        }

        if (item.shortnm) {
          featureText = item.shortnm;
        } else if (item.feature) {
          featureText = item.feature;
        } else if (item.featuretxt) {
          featureText = item.featuretxt;
        }
      } else {
        if (item.name_en) {
          itemName = item.name_en;
        } else if (item.packagenm_en) {
          itemName = item.packagenm_en;
        } else if (item.title_en) {
          itemName = item.title_en;
        } else if (item.title_en === null) {
          itemName = item.title;
        } else if (item.recipenm_en) {
          itemName = item.recipenm_en;
        }

        if (item.shortnm_en) {
          featureText = item.shortnm_en;
        } else if (item.feature_en) {
          featureText = item.feature_en;
        } else if (item.featuretxt_en) {
          featureText = item.featuretxt_en;
        } else if (item.feature_en) {
          featureText = item.feature_en;
        } else if (item.feature_en === null) {
          featureText = item.feature;
        }
      }
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
                  <Link to={item.route ? item.route : `/productdetail/${item.skucd}`}>
                    <span
                      className="image"
                      style={{
                        backgroundImage: `url(${process.env.IMAGE + (item.img === undefined ? item.imgnm : item.img)})`,
                        backgroundSize: "contain",
                      }}
                    />
                  </Link>
                  {elastic ? <ElasticLabel data={item} tags={tags} isDiscount={isDiscount} /> :
                    item.tags && item.tags.map((label, index) => (
                      <Label
                        key={index}
                        type={LABEL_TYPES.vertical}
                        data={label}
                        seq={index}
                        lang={lang}
                        isDiscount
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
                      {itemName}
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
                      {featureText}
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
                  <div className="price">
                    {prices}
                  </div>
                </div>
              </div>
            </div>
          );
        case CARD_TYPES.wide:
          return (
            <div className="col-sm-4 pad10">
              <div className="single-product big-product sale-product timed-product">
                <div className="image-container">
                  <Link
                    to={item.route ? item.route : `/productdetail/${item.skucd}`}
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
                    elastic ? <ElasticLabel wide data={item} tags={tags} isDiscount={isDiscount} /> :
                      item.tags && item.tags.map((label, index) => (
                        <Label
                          key={index}
                          type={LABEL_TYPES.vertical}
                          data={label}
                          seq={index}
                          lang={lang}
                          isDiscount
                        />
                      ))
                  }
                  {hover}
                </div>
                <div className="info-container">
                  <Link to={item.route ? item.route : `/productdetail/${item.skucd}`} className="name">
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {itemName}
                    </span>
                  </Link>

                  <Link to={item.route ? item.route : `/productdetail/${item.skucd}`} className="cat">
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {featureText}
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
                  <div className="price">
                    {prices}
                  </div>
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
                      lang={this.props.intl.locale}
                      isDiscount
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
                    {itemName}
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
                    {featureText}
                  </span>
                </Link>
                <div className="price">
                  {prices}
                </div>
              </div>
            </div>
          );
        case CARD_TYPES.list:
          return (
            <div className="single-product list-product sale-product">
              <div className="image-container">
                <Link to={item.route ? item.route : `/productdetail/${item.skucd}`}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${process.env.IMAGE + (item.img === undefined ? item.imgnm : item.img)})`,
                      backgroundSize: "100%",
                      margin: "0px",
                      paddin: "0px",
                      height: "85px",
                      width: "85px",
                    }}
                  />
                </Link>
              </div>
              <div className="info-container">
                <Link to={item.route ? item.route : `/productdetail/${item.skucd}`} className="name">
                  <span>{itemName}</span>
                </Link>
                <Link to={item.route ? item.route : `/productdetail/${item.skucd}`} className="cat">
                  <span>{featureText}</span>
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
                  to={item.route ? item.route : `/productdetail/${item.skucd}`}
                  className="price"
                >
                  {prices}
                </Link>
                {elastic ? <ElasticLabel list data={item} tags={tags} isDiscount={isDiscount} /> :
                  item.tags && item.tags.map((label, index) => (
                    <Label
                      key={index}
                      type={LABEL_TYPES.horizontal}
                      data={label}
                      seq={index}
                      lang={this.props.intl.locale}
                      isDiscount
                    />
                  ))}
                <span className="cart-container">
                  <a className="wishlist" onClick={this.handleSaveClick}>
                    <i
                      className={
                        this.state.changeHeart ? "fa fa-heart" : "fa fa-heart-o"
                      }
                      aria-hidden="true"
                    />
                  </a>
                  <a onClick={() => this.handleIncrement(item)}>
                    <i className="fa fa-cart-plus" aria-hidden="true" />
                    <span />
                  </a>
                </span>
              </div>
            </div >
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

export default windowSize(injectIntl(connect(mapStateToProps)(Card)));
