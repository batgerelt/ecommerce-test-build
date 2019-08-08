/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Button, message } from "antd";
import { height } from "@material-ui/system";
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
      position: "top-center",
      progressClassName: css({
        background: "#feb415",
      }),
    });
  };

  handleShowMoreClick = () => {
    this.setState({ isShowMoreClicked: true });
  };

  handleIncrementClick = async (product) => {
    const { intl } = this.props;
    try {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          skucd: product.cd,
          qty: product.addminqty || 1,
          iscart: 0,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            warning: {
              id: result.payload.code,
            },
          });
          message.warning(intl.formatMessage(messages.warning, { name: result.payload.data.values[0] }));
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);
      }
    } catch (e) {
      console.log(e);
    }
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
  };

  renderRelatedProducts = (limit = 4) => {
    try {
      let { relatedProducts } = this.props;
      const { isShowMoreClicked } = this.state;
      let data = this.getSlicedData(limit);
      return (
        !!data.length && (
          <div className="product-suggest">
            <p className="title">
              <strong><FormattedMessage id="shared.sidebar.title.relatedProducts" /></strong>
            </p>
            <ul
              className="list-unstyled"
              style={{ height: "261px", overflowY: "auto" }}
            >
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
            {relatedProducts.length > limit ? (
              <div className="more-link text-center">
                <Button
                  className="btn btn-border"
                  onClick={this.handleShowMoreClick}
                  disabled={isShowMoreClicked}
                >
                  <span className="text text-uppercase">
                    <FormattedMessage id="shared.sidebar.button.showAllRelatedProducts" />
                  </span>
                </Button>
              </div>
            ) : null}
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

export default injectIntl(Relational);
