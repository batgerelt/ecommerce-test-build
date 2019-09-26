import React, { Component } from 'react';
import emptyCart from "../../scss/assets/icon/cart.jpg";

class ProductNotFound extends Component {
  render() {
    return (
      <div className="search-not-found">
        <div className="text-center">
          <img src={emptyCart} alt="empty-cart" width={150} />
          <span>
            <p>Бараа олдсонгүй</p>
            <p>Та үндсэн цэсрүү буцна уу!</p>
          </span>
        </div>
      </div>
    );
  }
}

export default ProductNotFound;
