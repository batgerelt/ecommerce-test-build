/* eslint-disable no-restricted-globals */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Button, Rate, message, notification } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { css } from "glamor";

const formatter = new Intl.NumberFormat("en-US");
class Detail extends Component {
  state = {
    productQty: this.props.detail.products.addminqty || 1,
    rate: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.detail.products.skucd !== nextProps.detail.products.skucd) {
      this.setState({ productQty: nextProps.detail.products.addminqty || 1 });
    }
  }

  checkError = (value) => {
    if (value === "null" || value === null || value === undefined) {
      return "";
    }
    return `(${value})`;
  }

  renderDetails = () => {
    const {
      categorymenu, rate, isLoggedIn, intl, attributes,
    } = this.props;
    const lang = intl.locale;
    const detail = this.props.detail.products ? this.props.detail.products : null;
    const selectedCat = detail.catid && categorymenu.find(cat => cat.id === detail.catid);
    return (
      <div className="col-xl-7 col-lg-7 col-md-7 product-info-wrapper">
        <div className="product-info">
          <h5 className="title">{lang === "mn" ? detail.title : detail.title_en}</h5>
          <span className="small-title">
            {detail.back && lang === "mn" ? `${this.checkError(detail.back)}` : `${this.checkError(detail.back_en)}`}
          </span>
          {/* selectedCat && (
            <p className="big-text">
              <strong>
                <Link to={selectedCat.route} style={{ color: "#6c757d" }}>
                  {lang === "mn" ? selectedCat.name : selectedCat.name_en}
                </Link>
              </strong>
            </p>
          ) */}
          {
            detail.feature && (
              <p className="big-text">
                <strong>
                  {lang === "mn" ? detail.feature : detail.feature_en}
                </strong>
              </p>
            )
          }

          <div className="main-rating" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
            <Rate
              allowHalf
              value={isLoggedIn ? rate / 2 : 0}
              onChange={this.handleRateChange}
            />
            <p className="text upper-first">
              {/* ({isLoggedIn ? `Таны өгсөн үнэлгээ` : " Та одоогоор үнэлгээ өгөөгүй байна"}) */}
              ({isLoggedIn ? intl.formatMessage({ id: "productDetail.rate.text" }) : intl.formatMessage({ id: "productDetail.rate.text2" })})
            </p>
          </div>
          {!!attributes && !!attributes.length && (
            <div className="detail-attribute-container">
              <div className="product-bottom-info">
                {attributes.map((attr, index) => (
                  <div key={index} className="row">
                    <div className="col col-sm-6">
                      <dt>
                        {lang === "mn" ? attr.value : attr.value_en}
                        {/* {attr.value} */}
                      </dt>
                    </div>
                    <div className="col col-sm-6">
                      <dd>
                        {lang === "mn" ? attr.name : attr.name_en}
                        {/* {attr.title} */}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {
            attributes.length === 0 ?
              <div className="gift">
                <div className="image-container" />
                <div className="info-container" />
              </div> : null
          }

          {this.renderCartInfo()}
        </div>
      </div>
    );
  };

  handleRateChange = (e) => {
    const {
      isLoggedIn, detail, addRate, getProductRate, intl,
    } = this.props;
    if (isLoggedIn) {
      let skucd = detail.products.skucd;
      let rate = e * 2;
      addRate({ skucd, rate }).then((res) => {
        if (res.payload.success) {
          getProductRate({ skucd });
        } else {
          notification.warning({
            message: intl.formatMessage({ id: res.payload.code }),
            duration: 3,
          });
        }
      });
    } else {
      this.props.LoginModal.handleLoginModal();
    }
  };

  round = (value, step) => {
    // eslint-disable-next-line no-unused-expressions
    step || (step = 1.0);
    const inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  };

  renderCartInfo = () => {
    const detail = this.props.detail.products ? this.props.detail.products : null;
    if (!detail) {
      return null;
    }
    const { intl } = this.props;
    const { productQty } = this.state;
    let priceInfo = null;
    let priceTitle = `${intl.formatMessage({ id: "productDetail.label.price" })}: `;
    let kiloPrice = null;
    if (detail.issalekg) {
      priceTitle = `${detail.pricetag} ${intl.formatMessage({ id: "productDetail.label.gramPrice" })}: `;
      kiloPrice = (
        <div className="count-text text-right">
          <div className="price product-detail">
            <span style={{ fontSize: "16px" }}>
              {intl.formatMessage({ id: "productDetail.label.kilogramPrice" })}
            </span>
            {
              detail.discountprice !== 0 ?
                <small className="sale">
                  {formatter.format(detail.volumeprice)}₮
                </small> : ""
            }
            <span className="current" style={{ marginLeft: "5px", fontSize: "16px" }}>
              {formatter.format(detail.totprice)}₮
            </span>
          </div>
        </div>
      );
    }

    // eslint-disable-next-line prefer-destructuring
    let price = detail.price;

    if (detail.salepercent && detail.salepercent !== 100) {
      // Хямдарсан үед
      let salePrice = detail.discountunitprice;
      price = detail.unitprice;
      if (detail.issalekg && detail.discountunitprice !== 0) {
        salePrice = detail.discountunitprice;
      }

      priceInfo = (
        <div className="unit-price">
          <div className="count-text text-right">
            <span className="price-text upper-first">
              {priceTitle}
            </span>
            <div className="price product-detail">
              <small className="sale">
                {formatter.format(price)}₮
              </small>
              <span className="current" style={{ marginLeft: "5px", fontSize: "16px" }}>
                {formatter.format(salePrice)}₮
              </span>
            </div>
          </div>
          {kiloPrice}
        </div>
      );
    } else {
      priceInfo = (
        <div className="unit-price">
          <div className="count-text text-right">
            <span className="price-text upper-first">
              {priceTitle}
            </span>
            <span className="current" style={{ marginLeft: "5px", fontSize: "16px" }}>
              {formatter.format(detail.issalekg === 0 ? detail.totprice : detail.currentprice)}₮
            </span>
          </div>
          {kiloPrice}
        </div>
      );
    }
    return (
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <div className="row">
          <div className="col-xl-5 col-8">
            <div className="input-group">
              <div className="input-group-prepend" id="button-addon4">
                <button
                  onClick={() => this.handleDecrementClick(detail)}
                  className="btn"
                  type="button"
                  disabled={detail.availableqty < 1}
                >
                  <i className="fa fa-minus" aria-hidden="true" />
                </button>
              </div>

              <input
                type="text"
                maxLength="5"
                className="form-control"
                value={productQty}
                name="productQty"
                onChange={this.handleInputChange(detail)}
                onKeyDown={e => (e.keyCode === 13 ? this.handleQtyBlur(e, detail) : null)}
                onBlur={e => this.handleQtyBlur(e, detail)}
                disabled={detail.availableqty < 1}
              />

              <div className="input-group-append" id="button-addon4">
                <button
                  onClick={() => this.handleIncrementClick(detail)}
                  className="btn"
                  type="button"
                  disabled={detail.availableqty < 1}
                >
                  <i className="fa fa-plus" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-xl-7">{priceInfo}</div>
        </div>

        <div className="total-price text-right">
          <span className="upper-first">
            <FormattedMessage id="productDetail.label.totalPrice" />:
          </span>
          <strong>{formatter.format(this.getTotalPrice(detail))}₮</strong>
        </div>

        <div className="btn-container text-right">
          <button
            type="button"
            className="btn btn-gray text-uppercase"
            style={{ marginRight: "10px" }}
            onClick={this.handleSaveClick}
          >
            <span>
              <FormattedMessage id="productDetail.button.save" />
            </span>
          </button>

          <button
            type="button"
            className="btn btn-main text-uppercase"
            disabled={detail.availableqty < 1}
            /* onClick={() => this.props.onUpdateCart(detail)} */
            onClick={() => this.handleAddToCart(detail)}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true" />{" "}
            <span>
              <FormattedMessage id="productDetail.button.addToCart" />
            </span>
          </button>
        </div>
        {detail.sdate !== null && detail.edate !== null && (
          <p className="text text-right upper-first">
            <FormattedMessage
              id="productDetail.label.discountDateWarning"
              defaultMessage="Хямдрал {days} хоногийн дараа дуусна"
              values={{
                days: this.generateDate(detail),
              }}
            />
          </p>
        )}
      </form>
    );
  };

  generateDate = (detail) => {
    if (detail.sdate !== null && detail.edate !== null) {
      let edate = moment(detail.edate);
      let now = moment();
      return moment.duration(edate.diff(now)).days() + 1;
    }
    return 0;
  };

  handleSaveClick = () => {
    const { isLoggedIn, addWishList, detail } = this.props;
    if (isLoggedIn) {
      let skucd = detail.products.skucd;
      addWishList({ skucd }).then((res) => {
        if (res.payload.success) {
          setTimeout(() => {
            this.props.removeAddedWishColor();
          }, 500);
        }
      });
    } else {
      this.props.LoginModal.handleLoginModal();
    }
  };

  getPrice = () => {
    const detail = this.props.detail.products ? this.props.detail.products : null;

    if (!detail) {
      return null;
    }

    let price = detail.price;

    // if (detail.issalekg && detail.kgproduct[0]) {
    //   price = detail.kgproduct[0].salegramprice;
    // }
    if (detail.discountprice !== 0) {
      price = detail.discountprice;
    }

    if (detail.salepercent && detail.salepercent !== 100 && !detail.issalekg) {
      price = detail.discountprice;
    }

    return price;
  };

  getTotalPrice = detail => (this.state.productQty / detail.addminqty) * this.getPrice();

  roundToPrecision = (x, precision) => {
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }

  handleInputChange = product => (e) => {
    const { intl } = this.props;
    const lang = intl.locale;
    const messages = defineMessages({
      warning: {
        id: 202,
      },
    });
    if (product.salemaxqty >= e.target.value || product.salemaxqty === 0) {
      this.setState({ productQty: e.target.value });
    } else {
      notification.warning({
        message: intl.formatMessage(messages.warning, {
          name: lang === 'mn' ? product.title : product.title_en,
          qty: product.salemaxqty,
        }),
        duration: 3,
      });
    }
  };

  handleQtyBlur = (e, product) => {
    if (isNaN(e.target.value)) {
      this.setState({ productQty: product.addminqty });
    } else if (e.target.value < product.addminqty) {
      this.setState({ productQty: product.addminqty });
    } else if (e.target.value > product.availableqty) {
      this.setState({ productQty: product.availableqty });
      notification.warning({
        message: "Барааны нөөц хүрэлцэхгүй байна.",
        duration: 3,
      });
    } else if (e.target.value % product.addminqty === 0) {
      this.setState({ productQty: parseInt(e.target.value, 10) });
    } else if (e.target.value <= product.salemaxqty) {
      this.setState({ productQty: e.target.value });
    } else {
      this.setState({ productQty: this.roundToPrecision(e.target.value, product.addminqty) });
    }
  }

  handleIncrementClick = (product) => {
    const { intl } = this.props;
    const lang = intl.locale;
    const messages = defineMessages({
      warning: {
        id: 202,
      },
    });
    const productQty =
      this.state.productQty + product.addminqty > product.availableqty
        ? product.availableqty
        : this.state.productQty + product.addminqty;
    if (product.salemaxqty >= productQty || product.salemaxqty === 0) {
      this.setState({ productQty });
    } else {
      notification.warning({
        message: intl.formatMessage(messages.warning, {
          name: lang === 'mn' ? product.title : product.title_en,
          qty: product.salemaxqty,
        }),
        duration: 3,
      });
    }
  };

  handleDecrementClick = (product) => {
    const productQty =
      this.state.productQty - product.addminqty < product.addminqty
        ? product.addminqty
        : this.state.productQty - product.addminqty;
    this.setState({ productQty });
  };

  // eslint-disable-next-line consistent-return
  handleAddToCart = async (product) => {
    const { intl } = this.props;
    if (this.props.isLoggedIn) {
      const result = await this.props.increaseProductByQtyRemotely({
        skucd: product.skucd,
        qty: this.state.productQty,
        iscart: 0,
      });

      if (!result.payload.success) {
        const messages = defineMessages({
          warning: {
            id: result.payload.code,
          },
        });
        notification.warning({
          message: intl.formatMessage(messages.warning, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }),
          duration: 3,
        });
      }
    } else {
      product.insymd = Date.now();
      product.qty = this.state.productQty;
      this.props.increaseProductByQtyLocally(product);

      const updated = this.props.products.find(prod => prod.skucd === product.skucd);

      if (updated && updated.error !== undefined) {
        const messages = defineMessages({
          warning: {
            id: updated.error,
          },
        });
        notification.warning({
          message: intl.formatMessage(messages.warning, {
            name: updated.title,
            qty: updated.qty,
          }),
          duration: 3,
        });
      }
    }
  };

  render() {
    return this.renderDetails();
  }
}

export default injectIntl(Detail);
