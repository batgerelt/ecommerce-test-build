/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Button, Rate, message } from "antd";
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
    if (this.props.detail.products.cd !== nextProps.detail.products.cd) {
      this.setState({ productQty: nextProps.detail.products.addminqty || 1 });
    }
  }

  renderDetails = () => {
    const {
      categorymenu, rate, isLogged, intl, attributes,
    } = this.props;
    const lang = intl.locale;
    const detail = this.props.detail.products ? this.props.detail.products : null;
    const selectedCat = detail.catid && categorymenu.find(cat => cat.id === detail.catid);
    return (
      <div className="col-xl-7 col-lg-7 col-md-7">
        <div className="product-info">
          <h5 className="title">{lang === "mn" ? detail.title : detail.title_en}</h5>

          {detail.back && lang === "mn" ? `(${detail.back})` : `(${detail.back_en})`}

          {selectedCat && (
            <p className="big-text">
              <strong>
                <Link to={selectedCat.route} style={{ color: "#6c757d" }}>
                  {lang === "mn" ? selectedCat.title : selectedCat.title_en}
                </Link>
              </strong>
            </p>
          )}

          <div className="main-rating" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
            <Rate
              allowHalf
              value={isLogged ? rate / 2 : 0}
              onChange={this.handleRateChange}
            />
            <p className="text">
              {/* ({isLogged ? `Таны өгсөн үнэлгээ` : " Та одоогоор үнэлгээ өгөөгүй байна"}) */}
              ({isLogged ? intl.formatMessage({ id: "productDetail.rate.text" }) : intl.formatMessage({ id: "productDetail.rate.text2" })})
            </p>
          </div>
          {!!attributes && !!attributes.length && (
            <div className="detail-attribute-container">
              <div className="product-bottom-info" style={{ marginBottom: "20px" }}>
                {attributes.map((attr, index) => (
                  <div key={index} className="row">
                    <dt className="col-sm-6">
                      {lang === "mn" ? attr.value : attr.value_en}
                      {/* {attr.value} */}
                    </dt>
                    <dd className="col-sm-6">
                      {lang === "mn" ? attr.name : attr.name_en}
                      {/* {attr.name} */}
                    </dd>
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
      isLogged, detail, addRate, getProductRate, intl,
    } = this.props;
    if (isLogged) {
      let skucd = detail.products.skucd;
      let rate = e * 2;
      addRate({ skucd, rate }).then((res) => {
        if (res.payload.success) {
          // message.warning(res.payload.message);
          getProductRate({ skucd });
        } else {
          message.warning(intl.formatMessage({ id: res.payload.code }));
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
            {intl.formatMessage({ id: "productDetail.label.kilogramPrice" })}
            {
              detail.sprice !== 0 ?
                <small
                  className="sale"
                  style={{
                    color: "#666",
                    textDecoration: "line-through",
                    marginLeft: "5px",
                  }}
                >
                  {formatter.format(detail.volumeprice)}₮
                </small> : ""
            }
            <span className="current" style={{ marginLeft: "5px" }}>
              {formatter.format(detail.totprice)}₮
            </span>
          </div>
        </div>
      );
    }

    // eslint-disable-next-line prefer-destructuring
    let price = detail.price;

    if (detail.spercent && detail.spercent !== 100) {
      // Хямдарсан үед
      let salePrice = detail.sprice;

      if (detail.issalekg && detail.sprice !== 0) {
        salePrice = detail.sprice;
      }

      priceInfo = (
        <div>
          <div className="count-text text-right">
            {priceTitle}
            <div className="price product-detail">
              <small
                className="sale"
                style={{
                  color: "#666",
                  textDecoration: "line-through",
                  marginLeft: "5px",
                }}
              >
                {formatter.format(price)}₮
              </small>
              <span className="current" style={{ marginLeft: "5px" }}>
                {formatter.format(salePrice)}₮
              </span>
            </div>
          </div>
          {kiloPrice}
        </div>
      );
    } else {
      priceInfo = (
        <div>
          <div className="count-text text-right">
            {priceTitle}
            <span className="current" style={{ marginLeft: "5px" }}>
              {formatter.format(detail.issalekg === 0 ? detail.volumeprice : detail.currentprice)}₮
            </span>
          </div>
          {kiloPrice}
        </div>
      );
    }
    return (
      <form>
        <div className="row">
          <div className="col-xl-5 col-6">
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
                // onKeyDown={this.handleQtyKeyDown(detail)}
                /*  onBlur={() => this.handleQtyBlur(detail)} */
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
          <span><FormattedMessage id="productDetail.label.totalPrice" />:</span>
          <strong>{formatter.format(this.getTotalPrice(detail))}₮</strong>
        </div>

        <div className="btn-container text-right">
          <button
            type="button"
            className="btn btn-gray text-uppercase"
            style={{ marginRight: "10px" }}
            onClick={this.handleSaveClick}
          >
            <span><FormattedMessage id="productDetail.button.save" /></span>
          </button>

          <button
            type="button"
            className="btn btn-main text-uppercase"
            disabled={detail.availableqty < 1}
            /* onClick={() => this.props.onUpdateCart(detail)} */
            onClick={() => this.handleAddToCart(detail)}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true" />{" "}
            <span><FormattedMessage id="productDetail.button.addToCart" /></span>
          </button>

          {detail.sdate !== null && detail.edate !== null && (
            <p className="text text-right">
              <FormattedMessage
                id="productDetail.label.discountDateWarning"
                defaultMessage="Хямдрал {days} хоногийн дараа дуусна"
                values={{
                  days: this.generateDate(detail),
                }}
              />
            </p>
          )}
        </div>
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
    const { isLogged, addWishList, detail } = this.props;
    if (isLogged) {
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

    // eslint-disable-next-line prefer-destructuring
    let price = detail.price;

    // if (detail.issalekg && detail.kgproduct[0]) {
    //   price = detail.kgproduct[0].salegramprice;
    // }
    if (detail.sprice !== 0) {
      price = detail.sprice;
    }

    if (detail.spercent && detail.spercent !== 100 && !detail.issalekg) {
      price = detail.sprice;
    }

    return price;
  };

  getTotalPrice = detail => (this.state.productQty / detail.addminqty) * this.getPrice();

  handleInputChange = product => (e) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(e.target.value)) {
      this.setState({ productQty: product.addminqty });
    } else if (e.target.value < product.addminqty) {
      this.setState({ productQty: product.addminqty });
    } else if (e.target.value > product.availableqty) {
      this.setState({ productQty: product.availableqty });
    } else {
      this.setState({ productQty: parseInt(e.target.value, 10) });
    }
  };

  handleIncrementClick = (product) => {
    const productQty =
      this.state.productQty + product.addminqty > product.availableqty
        ? product.availableqty
        : this.state.productQty + product.addminqty;
    this.setState({ productQty });
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
    if (this.props.isLogged) {
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
        message.warning(intl.formatMessage(messages.warning, {
          name: result.payload.data.values[0],
          qty: result.payload.data.values[1],
        }));
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
        message.warning(intl.formatMessage(messages.warning, {
          name: updated.name,
          qty: updated.qty,
        }));
      }
    }
  };

  render() {
    return this.renderDetails();
  }
}

export default injectIntl(Detail);
