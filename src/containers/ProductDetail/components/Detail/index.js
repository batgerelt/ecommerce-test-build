/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Rate } from "antd";

const formatter = new Intl.NumberFormat("en-US");
class Detail extends Component {
  state = {
    productQty: this.props.detail.saleminqty || 1,
  };

  renderDetails = () => {
    const { detail, categorymenu } = this.props;
    const selectedCat =
      detail.catid && categorymenu.find(cat => cat.id === detail.catid);

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
              defaultValue={this.getRateValue()}
              onChange={this.handleRateChange}
            />

            <p className="text">
              (
              {!!detail.rate && !!detail.rate.length
                ? `${detail.rate.length} хүн үнэлгээ өгсөн байна`
                : "Одоогоор үнэлгээ өгөөгүй байна"}
              )
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
    console.log(e);
  };

  round = (value, step) => {
    // eslint-disable-next-line no-unused-expressions
    step || (step = 1.0);
    const inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  };

  getRateValue = () => {
    const { detail } = this.props;

    let average = 0;
    if (detail && detail.rate && detail.rate.length) {
      let total = detail.rate.reduce((acc, curr) => acc + curr.rate, 0);
      if (total > 0) {
        average = this.round(total / detail.rate.length, 0.5);
      }
    }
    return average;
  };

  renderCartInfo = () => {
    const { detail } = this.props;
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
                onChange={this.handleQtyChange(detail)}
                onKeyDown={this.handleQtyKeyDown(detail)}
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
            disabled={!(this.props.isLoggedIn && this.props.user)}
          >
            <span>Хадгалах</span>
          </button>

          <button
            type="button"
            className="btn btn-main text-uppercase"
            disabled={detail.availableqty < 1}
            /* onClick={() => this.props.onUpdateCart(detail)} */
          >
            <i className="fa fa-shopping-cart" aria-hidden="true" />{" "}
            <span>Сагсанд нэмэх</span>
          </button>

          {detail.sprice === 100 && (
            <p className="text text-right">
              Хямдрал {this.generateDate(detail)} хоногийн дараа дуусна
            </p>
          )}
        </div>
      </form>
    );
  };

  getPrice = () => {
    const { detail } = this.props;

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

  handleQtyChange = product => (e) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(e.target.value)) {
      this.setState({ productQty: product.addminqty });
    } else if (e.target.value < product.addminqty) {
      this.setState({ productQty: product.addminqty });
    } else {
      // eslint-disable-next-line radix
      this.setState({ productQty: parseInt(e.target.value) });
    }
  };

  handleQtyKeyDown = product => (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      product.qty = this.state.productQty;
      this.props.onQtyChange(product);
      this.setState({ productQty: product.qty });
    }
  };

  handleIncrementClick = (product) => {
    product.qty = this.state.productQty;
    // this.props.onIncrement(product);
    this.setState({ productQty: product.qty });
  };

  handleDecrementClick = (product) => {
    product.qty = this.state.productQty;
    // this.props.onDecrement(product);
    this.setState({ productQty: product.qty });
  };

  render() {
    return this.renderDetails();
  }
}

export default Detail;
