import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import NotificationBadge, { Effect } from "react-notification-badge";
import { Link } from "react-router-dom";

import cartImage from "../../scss/assets/svg/002-shopping-cart.svg";

const formatter = new Intl.NumberFormat("en-US");

class CartButton extends Component {
  // getUnitPrice = (product) => {
  //   if (product.sprice) {
  //     if (
  //       product.issalekg &&
  //       product.kgproduct &&
  //       product.kgproduct[0] &&
  //       product.kgproduct[0].salegramprice
  //     ) {
  //       // Хямдарсан бөгөөд кг-ын бараа
  //       return {
  //         price: product.kgproduct[0].salegramprice,
  //         sprice: product.kgproduct[0].salegramprice,
  //       };
  //     }

  //     // Хямдарсан бараа
  //     return { price: product.price, sprice: product.sprice };
  //   }

  //   if (
  //     product.issalekg &&
  //     product.kgproduct &&
  //     product.kgproduct[0] &&
  //     product.kgproduct[0].salegramprice
  //   ) {
  //     // Хямдраагүй бөгөөд кг-ын бараа
  //     return { price: product.kgproduct[0].salegramprice, sprice: null };
  //   }

  //   // Хямдраагүй бараа
  //   return { price: product.price, sprice: null };
  // };

  getTotalQty = () => {
    let { products } = this.props.cart;

    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    const qties = products && products.map(prod => (prod.qty ? prod.qty : 0));

    return qties && qties.length > 0
      ? qties.reduce((acc, cur) => acc + cur)
      : 0;
  };

  getTotalPrice = () => {
    let { products } = this.props.cart;

    if (typeof products === 'string') {
      products = JSON.parse(products);
    }

    const prices = products && products.map((prod) => {
      const price = prod.salepercent && prod.discountprice
        ? prod.issalekg && prod.currentprice ? prod.currentprice : prod.discountprice
        : prod.issalekg && prod.currentprice ? prod.currentprice : prod.price;
      return (prod.addminqty > 1 ? prod.currentunitprice : price) * (prod.qty ? prod.qty : 0);
    });

    return prices && prices.length > 0
      ? prices.reduce((acc, cur) => acc + cur)
      : 0;
  };

  render() {
    return (
      <Link to="/cart" className="row10">
        <NotificationBadge
          count={this.getTotalQty()}
          effect={Effect.SCALE}
          style={{
            top: "-11px",
            right: "-11px",
          }}
        />
        <img src={cartImage} alt="cart" height="25px" />
        <p className="header-text header-wish-text">
          <span className="upper-first"><FormattedMessage id="header.myCart.part1" /></span>
          <span>
            <FormattedMessage id="header.myCart.part2" />
          </span>
        </p>
        <strong>{formatter.format(this.getTotalPrice())}₮</strong>
      </Link>
    );
  }
}

export default CartButton;
