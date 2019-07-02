/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const formatter = new Intl.NumberFormat("en-US");
class Relational extends Component {
  state = {
    isShowMoreClicked: false,
  };

  handleShowMoreClick = () => {
    this.setState({ isShowMoreClicked: true });
  };

  handleRPIncrementClick = (relatedProduct) => {
    /* this.props.onIncrement(relatedProduct);
        this.props.onUpdateCart(relatedProduct); */
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
      console.log(relatedProducts, "dwd");
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
                          onClick={() => this.handleRPIncrementClick(prod)}
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
