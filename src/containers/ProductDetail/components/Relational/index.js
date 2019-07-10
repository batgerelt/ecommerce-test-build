/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { height } from "@material-ui/system";

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

  getSlicedData = (limit) => {
    let { relatedProducts } = this.props;
    const { isShowMoreClicked } = this.state;
    if (!isShowMoreClicked) {
      if (relatedProducts.length > limit) {
        return relatedProducts.slice(0, limit);
      }
    }
    return relatedProducts;
  }

  renderRelatedProducts = (limit = 4) => {
    try {
      let { relatedProducts } = this.props;
      let data = this.getSlicedData(limit);
      return (
        !!data.length && (
          <div
            className="product-suggest"
          >
            <p className="title">
              <strong>Хослох бараа</strong>
            </p>
            <ul className="list-unstyled" style={{ height: "261px", overflowY: "auto" }}>
              {data.map((prod, index) => (
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
            {relatedProducts.length > limit ?
              <div className="more-link text-center">
                <Button
                  className="btn btn-border"
                  onClick={this.handleShowMoreClick}
                >
                  <span className="text text-uppercase">
                    Бүх хослох барааг үзэх
                  </span>
                </Button>
              </div>
              : null}
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
