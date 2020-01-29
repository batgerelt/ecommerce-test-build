/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Button, message } from "antd";
import { store } from 'react-notifications-component';
import ButtonGoogle from "@material-ui/core/Button";
import { Notification } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Relational extends Component {
  state = {
    loading: false,
  };

  handleIncrementClick = async (product) => {
    const { intl } = this.props;
    const { lang } = intl.locale;
    try {
      if (localStorage.getItem('emartmall_token') !== null) {
        this.setState({ loading: true });
        const result = await this.props.incrementProductRemotely({
          skucd: product.skucd,
          qty: product.addminqty || 1,
          iscart: 0,
        });
        if (result.payload.success) {
          this.setState({ loading: false });
        }
        if (!result.payload.success) {
          this.setState({ loading: false });
          const messages = defineMessages({
            warning: {
              id: result.payload.code,
            },
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
              text={intl.formatMessage(messages.warning, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />,
          });
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);
        const updated = this.props.products.find(prod => prod.skucd === product.skucd);
        if (updated === undefined) {
          const messages = defineMessages({
            error: {
              id: 200,
            },
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
              text={intl.formatMessage(messages.error, {
                name: product.title,
                qty: product.qty,
              })}
            />,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    try {
      const { prod } = this.props;
      const lang = this.props.intl.locale;
      return (
        <li>
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

            <div className="info-container flex-space info-price-container">
              <Link to={prod.route ? prod.route : ""} title={prod.title}>
                <span>
                  {lang === "mn"
                    ? (prod.title.length > 25 ? `${prod.title.substring(0, 25)}...` : prod.title)
                    : prod.title_en.substring(0, 25)}
                </span>
                <span className="related-product-price price flex-this flex-space">
                  <span className="current">
                    {formatter.format(prod.discountprice === 0 ? prod.currentprice : prod.discountprice)}₮
                  </span>
                  <span className="pricetag">
                    {prod.pricetag}
                  </span>
                </span>
              </Link>
            </div>
            <div className="action">
              <ButtonGoogle
                className="action btn btn-link"
                onClick={() => this.handleIncrementClick(prod)}
                disabled={this.state.loading}
              >
                <i className={`fa ${this.state.loading ? "fa-spin" : "fa fa-cart-plus"}`} aria-hidden="true" />
              </ButtonGoogle>
            </div>
          </div>
        </li>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(Relational);
