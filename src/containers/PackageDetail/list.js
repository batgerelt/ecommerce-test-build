/* eslint-disable react/no-danger */
import React from "react";
import { FormattedDate, FormattedMessage, defineMessages } from 'react-intl';
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
        cd: prod.cd,
        qty: prod.qty,
      })),
    });
  };

  // eslint-disable-next-line consistent-return
  handleSimilarProductIncrement = async (product) => {
    const { intl } = this.props;
    if (this.props.isLogged) {
      const result = await this.props.incrementProductRemotely({
        skucd: product.cd,
        qty: product.saleminqty || 1,
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

      const updated = this.props.products.find(prod => prod.cd === product.cd);

      if (updated && updated.error !== undefined) {
        const messages = defineMessages({
          error: {
            id: updated.error,
          },
        });

        message.warning(intl.formatMessage(messages.error, {
          name: updated.name,
          qty: updated.qty,
        }));
      }
    }
  };

  // eslint-disable-next-line consistent-return
  handleProductAddToCart = async (product) => {
    try {
      const { intl } = this.props;

      if (this.props.isLogged) {
        const result = await this.props.increaseProductByQtyRemotely({
          skucd: product.cd,
          qty:
            product.qty === undefined ? product.saleminqty || 1 : product.qty,
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
        this.props.increaseProductByQtyLocally(product);

        const updated = this.props.products.find(prod => prod.cd === product.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
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

  // eslint-disable-next-line consistent-return
  handleInputChange = product => (e) => {
    let { products } = this.props.packageDetail;

    let found = products.find(prod => prod.cd === product.cd);

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

  // eslint-disable-next-line consistent-return
  handleAddToCart = async (products) => {
    const { intl } = this.props;

    if (this.props.isLogged) {
      products = products.map(prod => ({
        skucd: prod.cd,
        qty: prod.qty !== undefined ? prod.qty : prod.saleminqty || 1,
      }));
      const result = await this.props.increaseProductsByQtyRemotely({
        body: products,
      });
      if (!result.payload.success) {
        message.warning(intl.formatMessage({ id: result.payload.code }));
      }
      if (result.payload.data.fail.length > 0) {
        result.payload.data.fail.forEach((msg) => {
          const messages = defineMessages({
            error: {
              id: msg.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: msg.value.name,
            qty: msg.value.salemaxqty,
          }));
        });
      }
    } else {
      products = products.map(prod => ({
        ...prod,
        insymd: Date.now(),
      }));
      this.props.increasePackageProductsByQtyLocally(products);

      products.forEach((product) => {
        const updated = this.props.products.find(prod => prod.cd === product.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
            qty: updated.qty,
          }));
        }
      });
    }
  };

  renderTitleDate = () => {
    try {
      const { info, lang } = this.props;
      console.log('this.props: ', this.props);
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
        console.log('packageDetail.sameproducts: ', packageDetail.sameproducts);
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
                  <span>{lang === "mn" ? prod.skunm : prod.skunm_en}</span>
                  <strong>
                    {formatter.format(prod.sprice || prod.price)}₮
                  </strong>
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
                      style={{ fontSize: "1.2rem" }}
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
    const i = tempProducts.map(prod => prod.cd).indexOf(product.cd);
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
                    <span>{lang === "mn" ? prod.name : prod.name_en}</span>
                    <strong>{formatter.format(this.getPrice(prod))}₮</strong>
                  </Link>
                </p>
                <form style={{ width: "130px" }}>
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
                        prod.qty === undefined ? prod.saleminqty || 1 : prod.qty
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
                      style={{ fontSize: "1.6rem" }}
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
        // eslint-disable-next-line no-mixed-operators
        acc +
        // eslint-disable-next-line no-mixed-operators
        this.getPrice(cur) *
        (cur.qty || cur.qty === 0 ? cur.qty : cur.saleminqty || 1),
      0,
    );
  };

  getPrice = (product) => {
    // eslint-disable-next-line prefer-destructuring
    let price = product.price;

    if (product.issalekg && product.kgproduct[0]) {
      price = product.kgproduct[0].salegramprice;
    }

    if (product.spercent && product.spercent !== 100 && !product.issalekg) {
      price = product.sprice;
    }

    return price;
  };

  renderCartInfo = () => {
    try {
      const { packageDetail } = this.props;
      return (
        <div className="pack-product-container" style={{ marginTop: "30px" }}>
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
                      style={{ fontSize: "1.2rem" }}
                    />{" "}
                    <span className="text-uppercase"><FormattedMessage id="packageDetail.button.addToCart" /></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="info-container" style={{ float: "right" }}>
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
                  <div style={{ height: "30px" }} />
                  {this.props.info === undefined ? null : this.renderCk()}
                  <div
                    className="pack-product-container"
                    style={{ marginTop: "30px" }}
                  >
                    {this.props.packageDetail === undefined
                      ? null
                      : this.renderCartInfo()}
                  </div>
                </div>
                <div className="col-md-3 pad10">
                  <div className="product-plus">
                    {this.props.info === undefined ? null : this.renderDelivery()}
                    {/* <div className="block product-suggest">
                      <p className="title">
                        <strong><FormattedMessage id="shared.sidebar.title.similarProducts" /></strong>
                      </p>
                      <ul className="list-unstyled">
                        {this.props.packageDetail === undefined
                          ? null
                          : this.renderSimilarProducts()}
                      </ul>
                    </div> */}
                    {this.props.packageDetail === undefined
                      ? null
                      : this.props.packageDetail.sameproducts !== undefined && this.props.packageDetail.sameproducts.length !== 0 ?
                        <div className="block product-suggest">
                          <p className="title">
                            <strong><FormattedMessage id="shared.sidebar.title.similarProducts" /></strong>
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

export default List;
