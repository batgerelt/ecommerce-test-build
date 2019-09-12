/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-danger */
import React from "react";
import { FormattedDate, FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { css } from "glamor";
import { message } from 'antd';
import { Slider } from "../../components";

const formatter = new Intl.NumberFormat("en-US");
class List extends React.Component {
  setProducts = (products) => {
    this.setState({
      products: products.map(prod => ({
        cd: prod.skucd,
        qty: prod.qty,
      })),
    });
  };

  handleSimilarProductIncrement = async (product) => {
    const { intl } = this.props;
    if (this.props.isLogged) {
      const result = await this.props.incrementProductRemotely({
        skucd: product.skucd,
        qty: product.addminqty || 1,
        iscart: 0,
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
      product.insymd = Date.now();
      this.props.incrementProductLocally(product);

      const updated = this.props.products.find(prod => prod.skucd === product.skucd);

      if (updated && updated.error !== undefined) {
        const messages = defineMessages({
          error: {
            id: updated.error,
          },
        });

        message.warning(intl.formatMessage(messages.error, {
          name: updated.title,
          qty: updated.qty,
        }));
      }
    }
  };

  handleProductAddToCart = async (prod) => {
    try {
      const { intl } = this.props;

      let product = { ...prod };

      if (this.props.isLogged) {
        const result = await this.props.increaseProductByQtyRemotely({
          skucd: product.skucd,
          qty:
            product.qty === undefined ? product.addminqty || 1 : product.qty,
          iscart: 0,
        });
        console.log('result: ', result);
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
        product.insymd = Date.now();
        this.props.increaseProductByQtyLocally(product);

        const updated = this.props.products.find(prod => prod.skucd === product.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.title,
            qty: updated.qty,
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleIncrementProductClick = (product) => {
    this.props.incrementPackageProductLocally(product);
  };

  handleDecrementProductClick = (product) => {
    this.props.decrementPackageProductLocally(product);
  };

  handleInputChange = product => (e) => {
    let { products } = this.props.packageDetail;

    let found = products.find(prod => prod.skucd === product.skucd);

    if (found) {
      let productQty = e.target.value;

      // eslint-disable-next-line no-restricted-globals
      if (!productQty || isNaN(productQty)) {
        productQty = 0;
      }

      found.qty = parseInt(productQty, 10);

      this.props.updatePackageProductByQtyLocally(found);
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  handleAddToCart = async (products) => {
    const { intl } = this.props;

    if (this.props.isLogged) {
      products = products.map(prod => ({
        skucd: prod.skucd,
        qty: prod.qty !== undefined ? prod.qty : prod.addminqty || 1,
      }));
      const result = await this.props.increaseProductsByQtyRemotely({
        body: products,
      });
      if (!result.payload.success) {
        message.warning(intl.formatMessage({ id: result.payload.code }));
      }
      if (result.payload.data.fail.length > 0) {
        const titles = result.payload.data.fail.map(err => err.values[0]);
        message.warning(intl.formatMessage(
          { id: "205" },
          {
            names: titles.join(", "),
            qty: result.payload.data.items.length,
          },
        ));
      }
    } else {
      products = products.map(prod => ({
        ...prod,
        insymd: Date.now(),
      }));

      this.props.increasePackageProductsByQtyLocally(products);

      const errors = this.props.errors.filter(prod => prod.id === parseInt(this.props.match.params.id, 10));

      if (errors.length > 0) {
        const titles = errors.map(err => err.title);
        message.warning(intl.formatMessage(
          { id: "205" },
          {
            names: titles.join(", "),
            qty: products.length - errors.length,
          },
        ));
      }
    }
  };

  renderTitleDate = () => {
    try {
      const { info, lang } = this.props;
      // const date = info.insymd.split("T")[0].split("-");
      return (
        <div>
          <h4 className="title">
            <span>{lang === "mn" ? info.packagenm : info.packagenm_en}</span>
          </h4>
          <p className="date">
            <FormattedMessage
              id="packageDetail.date"
              defaultMessage="{year}.{month}.{day}"
              values={{
                year: <FormattedDate value={new Date(info.insymd)} year="numeric" />,
                month: <FormattedDate value={new Date(info.insymd)} month="2-digit" />,
                day: <FormattedDate value={new Date(info.insymd)} day="2-digit" />,
              }}
            />
            {/* <span>{`${date[0]} оны ${date[1]} сарын ${date[2]}`}</span> */}
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSlider = () => {
    try {
      const { images } = this.props;
      const sliderParams = {
        spaceBetween: 0,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
      };
      return (
        <div className="content">
          <div className="main-slide">
            <Slider
              sliderData={images}
              params={sliderParams}
              elContainer={"images"}
              contain
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderCk = () => {
    try {
      const { info, lang } = this.props;
      return (
        <div
          style={{ lineHeight: "200%" }}
          className="product-plus htmlcontainer"
          dangerouslySetInnerHTML={{
            __html: lang === "mn" ? info.description : info.description_en,
          }}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };
  renderDelivery = () => {
    try {
      const { info, lang } = this.props;
      return (
        <div className="block product-delivery">
          <p className="title">
            <strong><FormattedMessage id="shared.sidebar.title.deliveryInfo" /></strong>
          </p>
          <p className="text">
            <span>{lang === "mn" ? info.deliverytxt : info.deliverytxt_en}</span>
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSimilarProducts = () => {
    try {
      const { packageDetail, lang } = this.props;
      if (packageDetail.sameproducts !== undefined) {
        return packageDetail.sameproducts.map((prod, index) => (
          <li key={index}>
            <div className="single flex-this">
              <div className="image-container">
                <Link to={prod.route || ""}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${process.env.IMAGE}${prod.url})`,
                    }}
                  />
                </Link>
              </div>
              <div className="info-container flex-space">
                <Link to={prod.route || ""}>
                  <span className="package-product-title">
                    {lang === "mn" ? prod.title : prod.title_en}
                  </span>
                  <span className="package-product-price">
                    {formatter.format(prod.sprice || prod.price)}₮
                  </span>
                </Link>
                <div className="action">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => this.handleSimilarProductIncrement(prod)}
                  >
                    <i
                      className="fa fa-cart-plus"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ));
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  handleQtyKeyDown = (product, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.changeQty(product, parseInt(e.target.value, 10));
    }
  };

  handleQtyBlur = (product, e) => {
    this.changeQty(product, parseInt(e.target.value, 10));
  };

  changeQty = (product, targetQty) => {
    product = this.props.onQtyChange(product, targetQty);
    this.findAndReplace(product);
  };

  findAndReplace = (product) => {
    const { products } = this.state;
    let tempProducts = products;
    const i = tempProducts.map(prod => prod.skucd).indexOf(product.skucd);
    if (i !== -1) {
      tempProducts.splice(i, 1, product);
    }
    this.setState({ products: tempProducts });
  };

  renderProducts = () => {
    try {
      const { products } = this.props.packageDetail;
      const { lang } = this.props;
      return (
        products &&
        products.map((prod, index) => (
          <li className="flex-this" key={index}>
            <div className="image-container default">
              <Link to={prod.route || ""}>
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(${process.env.IMAGE}${prod.img})`,
                  }}
                />
              </Link>
            </div>
            <div className="info-container">
              <div className="flex-space">
                <p className="text col-md-5 col-sm-5">
                  <Link to={prod.route || ""} style={{ color: "#666" }}>
                    <span>{lang === "mn" ? prod.title : prod.title_en}</span>
                    <strong>
                      {formatter.format(prod.saleminqty > 1
                        ? prod.currentprice / prod.saleminqty
                        : prod.currentprice,
                      )}₮
                    </strong>
                  </Link>
                </p>
                <form>
                  <div className="input-group e-input-group">
                    <div className="input-group-prepend" id="button-addon4">
                      <button
                        className="btn"
                        type="button"
                        style={{
                          color: "rgba(0,0,0,.5)",
                          textAlign: "center",
                          backgroundColor: "rgb(204, 204, 204)",
                          borderTopLeftRadius: "20px",
                          borderBottomLeftRadius: "20px",
                          marginRight: "5px",
                        }}
                        onClick={() => this.handleDecrementProductClick(prod)}
                      >
                        <i className="fa fa-minus" aria-hidden="true" />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        prod.qty === undefined ? prod.addminqty || 1 : prod.qty
                      }
                      name="productQty"
                      maxLength={5}
                      onChange={this.handleInputChange(prod)}
                    /* onKeyDown={this.handleQtyKeyDown(prod)} */
                    /* onBlur={this.handleQtyBlur(prod)} */
                    />
                    <div className="input-group-append" id="button-addon4">
                      <button
                        className="btn"
                        type="button"
                        style={{
                          color: "rgba(0,0,0,.5)",
                          textAlign: "center",
                          backgroundColor: "rgb(204, 204, 204)",
                          borderTopRightRadius: "20px",
                          borderBottomRightRadius: "20px",
                          marginLeft: "5px",
                        }}
                        onClick={() => this.handleIncrementProductClick(prod)}
                      >
                        <i className="fa fa-plus" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </form>
                <div className="action">
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={() => this.handleProductAddToCart(prod)}
                  >
                    <i
                      className="fa fa-cart-plus"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))
      );
    } catch (error) {
      return console.log(error);
    }
  };

  getTotal = () => {
    const { products } = this.props.packageDetail;

    if (!products) {
      return 0;
    }

    return products.reduce(
      (acc, cur) =>
        acc +
        cur.currentprice *
        (cur.qty || cur.qty === 0 ? cur.qty : cur.addminqty || 1),
      0,
    );
  };

  renderCartInfo = () => {
    try {
      const { packageDetail } = this.props;
      return (
        <div className="pack-product-container">
          <div className="pack-list">
            <div className="row row10">
              <div className="col-xl-8 pad10">
                <ul className="list-unstyled">
                  {packageDetail === undefined ? null : this.renderProducts()}
                </ul>
              </div>
              <div className="col-xl-4 pad10">
                <div className="pack-price">
                  <p className="text flex-this end">
                    <span style={{ fontSize: "1.6rem" }}><FormattedMessage id="packageDetail.label.price" />:</span>
                    <strong>{formatter.format(this.getTotal())}₮</strong>
                  </p>
                  <button
                    type="button"
                    className="btn btn-main"
                    onClick={() => this.handleAddToCart(packageDetail.products)}
                  >
                    <i
                      className="fa fa-cart-plus"
                      aria-hidden="true"
                    />{" "}
                    <span className="text-uppercase"><FormattedMessage id="packageDetail.button.addToCart" /></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="info-container">
            <span>
              <i>
                <FormattedMessage id="packageDetail.info" />
              </i>
            </span>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    try {
      return (
        <div className="section">
          <div className="container pad10">
            <div className="e-breadcrumb">
              <ul className="list-unstyled">
                <li>
                  <Link to="">
                    <span><FormattedMessage id="packageDetail.breadcrumb.home" /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/package">
                    <span><FormattedMessage id="packageDetail.breadcrumb.package" /></span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="product-detail-page">
              <div className="row row10">
                <div className="col-md-9 pad10">
                  {this.props.info === undefined ? null : this.renderTitleDate()}
                  {this.props.images === undefined ? null : this.renderSlider()}
                  {this.props.info === undefined ? null : this.renderCk()}
                  <div className="pack-product-container">
                    {this.props.packageDetail === undefined
                      ? null
                      : this.renderCartInfo()}
                  </div>
                </div>
                <div className="col-md-3 pad10">
                  <div className="product-plus">
                    {this.props.info === undefined ? null : this.renderDelivery()}
                    {this.props.packageDetail === undefined
                      ? null
                      : this.props.packageDetail.sameproducts !== undefined && this.props.packageDetail.sameproducts.length !== 0 ?
                        <div className="block product-suggest">
                          <p className="title">
                            <FormattedMessage id="shared.sidebar.title.similarProducts" />
                          </p>
                          <ul className="list-unstyled">
                            {this.renderSimilarProducts()}
                          </ul>
                        </div> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(List);
