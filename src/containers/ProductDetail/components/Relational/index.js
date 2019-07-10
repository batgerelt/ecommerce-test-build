/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { toast } from "react-toastify";
import { css } from "glamor";

const formatter = new Intl.NumberFormat("en-US");
class Relational extends Component {
  state = {
    isShowMoreClicked: false,
  };

  handleNotify = (message) => {
    toast(message, {
      autoClose: 5000,
      position: 'top-center',
      progressClassName: css({
        background: "#feb415",
      }),
    });
  };

  handleShowMoreClick = () => {
    this.setState({ isShowMoreClicked: true });
  };

  handleIncrementClick = async (product) => {
    try {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: product.cd,
          qty: product.addminqty || 1,
          iscart: 0,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
        }
      } else {
        this.props.incrementProductLocally(product);
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderRelatedProducts = (limit = 4) => {
    try {
      let { relatedProducts } = this.props;
      const { isShowMoreClicked } = this.state;

      const shouldExpand = isShowMoreClicked && relatedProducts.length > limit;
      const shouldButtonHide = relatedProducts.length <= limit;

      relatedProducts =
        !isShowMoreClicked && relatedProducts.length > limit
          ? relatedProducts.slice(0, limit)
          : relatedProducts;
      return (
        !!relatedProducts.length && (
          <div
            className="product-suggest"
            style={{
              height: shouldExpand && "500px",
              overflowY: shouldExpand && "scroll",
            }}
          >
            <p className="title">
              <strong>Хослох бараа</strong>
            </p>
            <ul className="list-unstyled">
              {relatedProducts.map((prod, index) => (
                <li key={index}>
                  <div className="single flex-this">
                    <div className="image-container">
                      <Link to={prod.route ? prod.route : ""}>
                        <span
                          className="image"
                          style={{
                            backgroundImage: `url(${process.env.IMAGE}${
                              prod.img
                              })`,
                          }}
                        />
                      </Link>
                    </div>

                    <div className="info-container flex-space">
                      <Link to={prod.route ? prod.route : ""}>
                        <span>{prod.name}</span>
                        <strong>{formatter.format(prod.price)}₮</strong>
                      </Link>
                      <div className="action">
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => this.handleIncrementClick(prod)}
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
              ))}
            </ul>
            {relatedProducts.length > limit && (
              <div className="more-link text-center">
                <Button
                  className="btn btn-border"
                  onClick={this.handleShowMoreClick}
                  style={{
                    display: (shouldExpand || shouldButtonHide) && "none",
                  }}
                >
                  <span className="text text-uppercase">
                    Бүх хослох барааг үзэх
                  </span>
                </Button>
              </div>
            )}
          </div>
        )
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return this.renderRelatedProducts();
  }
}

export default Relational;
