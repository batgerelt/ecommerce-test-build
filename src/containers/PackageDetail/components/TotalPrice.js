/* eslint-disable no-mixed-operators */
import React from 'react';

function TotalPrice({ products }) {
  console.log(products);
  const formatter = new Intl.NumberFormat("en-US");

  let totalPrice = 0;

  totalPrice = products.reduce(
    (acc, cur) =>
      acc +
      cur.currentprice *
      (cur.qty || cur.qty === 0 ? cur.qty : cur.addminqty),
    0,
  );

  console.log(totalPrice);

  return (
    <strong>
      {formatter.format(totalPrice)}₮
    </strong>
  );
}

export default TotalPrice;
