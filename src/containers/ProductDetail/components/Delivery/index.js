/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";

class Delivery extends Component {
  renderDelivery = () => {
    try {
      const { detail } = this.props;
      if (!detail.deliveryinfo) {
        return null;
      }

      return (
        <div className="block product-delivery">
          <p className="title">
            <strong>Хүргэлтийн мэдээлэл</strong>
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
