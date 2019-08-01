/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Rate, message } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { css } from "glamor";

const formatter = new Intl.NumberFormat("en-US");
class Detail extends Component {
  state = {
    productQty: this.props.detail.products.saleminqty || 1,
    rate: 0,
  };

  handleNotify = (message) => {
    toast(message, {
      autoClose: 5000,
      position: "top-center",
      progressClassName: css({
        background: "#feb415",
      }),
    });
  };

  renderDetails = () => {
    const { categorymenu, rate, isLogged } = this.props;
    const detail = this.props.detail.products ? this.props.detail.products : null;
    const selectedCat = detail.catid && categorymenu.find(cat => cat.id === detail.catid);

    return (
      <div className="col-xl-7 col-lg-7 col-md-7">
        <div className="product-info">
          <h5 className="title">{detail.name}</h5>

          {detail.backtxt && `(${detail.backtxt})`}

          {selectedCat && (
            <p className="big-text">
              <strong>
                <Link to={selectedCat.route} style={{ color: "#6c757d" }}>
                  {selectedCat.name}
                </Link>
              </strong>
            </p>
          )}

          <div className="main-rating">
            <Rate
              allowHalf
              value={isLogged ? rate / 2 : 0}
              onChange={this.handleRateChange}
            />

            <p className="text">
              ({isLogged ? `Таны өгсөн үнэлгээ` : " Та одоогоор үнэлгээ өгөөгүй байна"})
            </p>
          </div>

          <div className="gift">
            <div className="image-container" />
            <div className="info-container" />
          </div>

          {this.renderCartInfo()}
        </div>
      </div>
    );
  };

  handleRateChange = (e) => {
    const {
      isLogged, detail, addRate, getProductRate,
    } = this.props;
    if (isLogged) {
      let skucd = detail.products.cd;
      let rate = e * 2;
      addRate({ skucd, rate }).then((res) => {
        if (res.payload.success) {
          // message.success(res.payload.message);
          getProductRate({ skucd });
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

    const { productQty } = this.state;

    let priceInfo = null;

    let priceTitle = "Үнэ: ";
    let kiloPrice = null;
    if (detail.issalekg && detail.kgproduct && detail.kgproduct[0]) {
      priceTitle = `${detail.kgproduct[0].salegram} гр-н үнэ: `;
      kiloPrice = (
        <p className="count-text text-right">
          {`Кг үнэ: ${formatter.format(detail.kgproduct[0].kilogramprice)}₮`}
        </p>
      );
    }

    // eslint-disable-next-line prefer-destructuring
    let price = detail.price;

    if (detail.spercent && detail.spercent !== 100) {
      // Хямдарсан үед
      let salePrice = detail.sprice;

      if (detail.issalekg && detail.kgproduct && detail.kgproduct[0]) {
        // Хямдарсан бөгөөд кг-н бараа
        kiloPrice = (
          <p className="count-text text-right">
            Кг үнэ:
            <small
              className="sale"
              style={{
                color: "#666",
                textDecoration: "line-through",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              {formatter.format(price)}₮
            </small>
            {formatter.format(detail.kgproduct[0].kilogramprice)}₮
          </p>
        );
        price = Math.round(
          price / Math.round(1000 / detail.kgproduct[0].salegram),
        );
        salePrice = detail.kgproduct[0].salegramprice;
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
      // Хямдраагүй үед
      if (detail.issalekg && detail.kgproduct && detail.kgproduct[0]) {
        price = detail.kgproduct[0].salegramprice;
      }

      priceInfo = (
        <div>
          <div className="count-text text-right">
            {priceTitle}
            <span className="current" style={{ marginLeft: "5px" }}>
              {formatter.format(price)}₮
            </span>
          </div>
          {kiloPrice}
        </div>
      );
    }
    return (
      <form>
        <div className="row row10">
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
          <span>Дүн:</span>
          <strong>{formatter.format(this.getTotalPrice())}₮</strong>
        </div>

        <div className="btn-container text-right">
          <button
            type="button"
            className="btn btn-gray text-uppercase"
            style={{ marginRight: "10px" }}
            onClick={this.handleSaveClick}
          >
            <span>Хадгалах</span>
          </button>

          <button
            type="button"
            className="btn btn-main text-uppercase"
            disabled={detail.availableqty < 1}
            /* onClick={() => this.props.onUpdateCart(detail)} */
            onClick={() => this.handleAddToCart(detail)}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true" />{" "}
            <span>Сагсанд нэмэх</span>
          </button>

          {detail.sdate !== null && detail.edate !== null && (
            <p className="text text-right">
              Хямдрал {this.generateDate(detail)} хоногийн дараа дуусна
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
    if (isLogged !== null) {
      let skucd = detail.products.cd;
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

    if (detail.issalekg && detail.kgproduct[0]) {
      price = detail.kgproduct[0].salegramprice;
    }

    if (detail.spercent && detail.spercent !== 100 && !detail.issalekg) {
      price = detail.sprice;
    }

    return price;
  };

  getTotalPrice = () => this.state.productQty * this.getPrice();

  handleInputChange = product => (e) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(e.target.value)) {
      this.setState({ productQty: product.saleminqty });
    } else if (e.target.value < product.saleminqty) {
      this.setState({ productQty: product.saleminqty });
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
      this.state.productQty - product.addminqty < product.saleminqty
        ? product.saleminqty
        : this.state.productQty - product.addminqty;
    this.setState({ productQty });
  };

  // eslint-disable-next-line consistent-return
  handleAddToCart = async (product) => {
    if (this.props.isLogged) {
      const result = await this.props.increaseProductByQtyRemotely({
        skucd: product.cd,
        qty: this.state.productQty,
        iscart: 0,
      });
      if (!result.payload.success) {
        this.handleNotify(result.payload.message);
      }
    } else {
      product.qty = this.state.productQty;
      product.insymd = Date.now();
      this.props.increaseProductByQtyLocally(product);
    }
  };

  render() {
    return this.renderDetails();
  }
}

export default Detail;
