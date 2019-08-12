/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';

class Delivery extends Component {
  renderDelivery = () => {
    try {
      const { detail } = this.props;
      console.log('detail: ', detail);

      return (
        <div className="block product-delivery">
          <p className="title">
            {/* <strong>Хүргэлтийн мэдээлэл</strong> */}
            <strong><FormattedMessage id="shared.sidebar.title.deliveryInfo" /></strong>
          </p>
          <p className="text">
            <span>{detail.deliveryinfo}</span>
          </p>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return this.renderDelivery();
  }
}

export default Delivery;
