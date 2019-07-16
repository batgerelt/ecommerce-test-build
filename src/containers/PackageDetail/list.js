/* eslint-disable react/no-danger */
import React from "react";
import { Link } from "react-router-dom";
import { Slider } from "../../components";

const formatter = new Intl.NumberFormat("en-US");
class List extends React.Component {
  renderTitleDate = () => {
    try {
      const { info } = this.props;
      const date = info.insymd.split("T")[0].split("-");
      return (
        <div>
          <h4 className="title">
            <span>{info.packagenm}</span>
          </h4>
          <p className="date">
            <span>{`${date[0]} оны ${date[1]} сарын ${date[2]}`}</span>
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

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
              data={images}
              params={sliderParams}
              elContainer={"images"}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderCk = () => {
    try {
      const { info } = this.props;
      return (
        <div
          style={{ lineHeight: "200%" }}
          className="product-plus htmlcontainer"
          dangerouslySetInnerHTML={{
            __html: info.description,
          }}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }
  renderDelivery = () => {
    try {
      const { info } = this.props;
      return (
        <div className="block product-delivery">
          <p className="title">
            <strong>Хүргэлтийн мэдээлэл</strong>
          </p>
          <p className="text">
            <span>{info.deliverytxt}</span>
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderSimilarProdcts = () => {
    try {
      const { packageDetail } = this.props;
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
                  <span>{prod.skunm}</span>
                  <strong>{formatter.format(prod.sprice || prod.price)}₮</strong>
                </Link>
                <div className="action">
                  <button
                    type="button"
                    className="btn btn-link"
                  /* onClick={() => this.handleSingleAddToCartClick(prod)} */
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
  }

  handleQtyBlur = (product, e) => { this.changeQty(product, parseInt(e.target.value, 10)); }

  changeQty = (product, targetQty) => {
    product = this.props.onQtyChange(product, targetQty);
    this.findAndReplace(product);
  }

  findAndReplace = (product) => {
    const { products } = this.state;
    let tempProducts = products;
    const i = tempProducts.map(prod => prod.cd).indexOf(product.cd);
    if (i !== -1) {
      tempProducts.splice(i, 1, product);
    }
    this.setState({ products: tempProducts });
  }

  renderProducts = () => {
    try {
      const { packageDetail } = this.props;
      console.log(packageDetail);
      if (packageDetail.products !== undefined) {
        return packageDetail.products.map((prod, index) => (
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
                  <Link
                    to={prod.route || ""}
                    style={{ color: "#666" }}
                  >
                    <span>{prod.name}</span>
                    <strong>{formatter.format(prod.price)}₮</strong>
                  </Link>
                </p>

                <form style={{ width: "130px" }}>
                  <div className="input-group e-input-group">
                    <div
                      className="input-group-prepend"
                      id="button-addon4"
                    >
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
                      >
                        <i
                          className="fa fa-minus"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={prod.unit}
                      name="productQty"
                      maxLength={5}
                    /* onKeyDown={this.handleQtyKeyDown(prod)} */
                    /* onBlur={this.handleQtyBlur(prod)} */
                    /* onChange={this.handleQtyChange(prod)} */

                    />
                    <div
                      className="input-group-append"
                      id="button-addon4"
                    >
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
                      >
                        <i
                          className="fa fa-plus"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </form>

                <div className="action">
                  <button
                    className="btn btn-link"
                    type="button"
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
        ));
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  }
  renderCartInfo = () => {
    try {
      const { packageDetail } = this.props;
      if (packageDetail.products !== undefined) {
        return (
          <div className="pack-product-container" style={{ marginTop: "30px" }}>
            {!!packageDetail.products && !!packageDetail.products.length && (
              <div className="pack-list">
                <div className="row row10">
                  <div className="col-xl-8 pad10">
                    <ul className="list-unstyled">
                      {this.props.packageDetail === undefined ? null : this.renderProducts()}
                    </ul>
                  </div>

                  <div className="col-xl-4 pad10">
                    <div className="pack-price">
                      <p className="text flex-this end">
                        <span style={{ fontSize: "1.6rem" }}>Үнэ:</span>
                        <strong>{formatter.format(this.props.packageDetail.total)}₮</strong>
                      </p>
                      <button
                        type="button"
                        className="btn btn-main"
                      >
                        <i
                          className="fa fa-cart-plus"
                          aria-hidden="true"
                          style={{ fontSize: "1.2rem" }}
                        />{" "}
                        <span className="text-uppercase">Сагсанд нэмэх</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="info-container" style={{ float: "right" }}>
              <span>
                <i>Та багцаас сонгож авахгүй барааныхаа тоо хэмжээг 0 болгосноор багцаас хасаад сагсанд нэмэх боломжтой.</i>
              </span>
            </div>
          </div>
        );
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    return (
      <div className="section">
        <div className="container pad10">
          <div className="e-breadcrumb">
            <ul className="list-unstyled">
              <li>
                <Link to="">
                  <span>Нүүр хуудас</span>
                </Link>
              </li>
              <li>
                <Link to="/package">
                  <span>Багц</span>
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
                <div className="pack-product-container" style={{ marginTop: "30px" }}>
                  {this.props.packageDetail === undefined ? null : this.renderCartInfo()}
                </div>
              </div>
              <div className="col-md-3 pad10">
                <div className="product-plus">
                  {this.props.info === undefined ? null : this.renderDelivery()}
                  <div className="block product-suggest">
                    <p className="title">
                      <strong>Ижил бараа</strong>
                    </p>
                    <ul className="list-unstyled">
                      {this.props.packageDetail === undefined ? null : this.renderSimilarProdcts()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
