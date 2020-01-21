/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Button, message } from "antd";
import { store } from 'react-notifications-component';
import ButtonGoogle from "@material-ui/core/Button";
import { Notification } from "../../../../components";
import Product from "./product";

const formatter = new Intl.NumberFormat("en-US");

class Relational extends Component {
  state = {
    isShowMoreClicked: false,
    loading: false,
  };

  handleShowMoreClick = () => {
    this.setState({ isShowMoreClicked: true });
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

  render() {
    try {
      let { relatedProducts } = this.props;
      const { isShowMoreClicked } = this.state;
      const lang = this.props.intl.locale;
      let limit = 4;
      let data = this.getSlicedData(limit);
      return (
        !!data.length && (
          <div className="block related-products">
            <p className="title">
              <strong><FormattedMessage id="shared.sidebar.title.relatedProducts" /></strong>
            </p>
            <ul className="list-unstyled">
              {data.map((prod, index) => (
                <Product prod={prod} incrementProductRemotely={this.props.incrementProductRemotely} incrementProductLocally={this.props.incrementProductLocally} key={index} products={this.props.products} />
              ))}
            </ul>
            {relatedProducts.length > limit ? (
              <div className="more-link text-center" style={{ background: "white" }}>
                <Button
                  className="btn btn-border"
                  onClick={this.handleShowMoreClick}
                  disabled={isShowMoreClicked}
                  style={{ height: "100%", width: "100%" }}
                >
                  <span className="text text-uppercase" style={{ fontSize: "0.82rem" }}>
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
  }
}

export default injectIntl(Relational);
