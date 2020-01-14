/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';

class Delivery extends Component {
  render() {
    try {
      const { detail } = this.props;
      return (
        <div className="block product-delivery">
          <p className="title upper-first">
            <strong>
              <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
            </strong>
          </p>
          <p className="text upper-first">
            <span>
              {
                this.props.lang === "mn"
                  ? detail.products.deliveryinfo
                  : detail.products.deliveryinfo_en
              }
            </span>
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

export default Delivery;
