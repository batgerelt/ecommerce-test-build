import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import Button from "@material-ui/core/Button";

import { Notification } from "../../../components";
import { Cart as CartModel } from '../../../models';

function SimilarProduct({
  intl: { locale, formatMessage },
  product,
  products,
  incrementProductLocally,
  incrementProductRemotely,
}) {
  const formatter = new Intl.NumberFormat("en-US");

  const [loading, setLoading] = useState(false);

  const handleIncrementClick = async () => {
    if (localStorage.getItem('auth')) {
      setLoading(true);
      let result = await incrementProductRemotely({
        skucd: product.skucd,
        qty: product.addminqty || 1,
        iscart: 0,
      });

      if (!result.payload.success) {
        const messages = defineMessages({
          error: { id: result.payload.code },
        });

        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: (
            <Notification
              type="warning"
              text={formatMessage(messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />
          ),
        });
      }
      setLoading(false);
    } else {
      console.log("incrementProductLocally");
      incrementProductLocally(product);

      const updated = products.find(prod => prod.skucd === product.skucd);

      if (updated && updated.error !== undefined) {
        const messages = defineMessages({
          error: { id: updated.error },
        });

        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification
            type="warning"
            text={formatMessage(messages.error, {
              name: updated.title,
              qty: updated.qty,
            })}
          />,
        });
      }
    }
  };

  return (
    <div className="single flex-this">
      <div className="image-container">
        <Link to={product.route || ""}>
          <span
            className="image"
            style={{
              backgroundImage: `url(${process.env.IMAGE}${product.url})`,
            }}
          />
        </Link>
      </div>
      <div className="info-container flex-space">
        <Link to={product.route || ""}>
          <span className="similar-product-title">
            {locale === "mn" ? product.title : product.title_en}
          </span>
          <span className="similar-product-price price">
            {formatter.format(product.sprice || product.price)}₮
          </span>
        </Link>
        <div className="action">
          <Button
            onClick={handleIncrementClick}
            disabled={loading}
          >
            <i
              className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  products: state.cart.products,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    incrementProductLocally: CartModel.incrementProductLocally,
    incrementProductRemotely: CartModel.incrementProductRemotely,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(SimilarProduct));
