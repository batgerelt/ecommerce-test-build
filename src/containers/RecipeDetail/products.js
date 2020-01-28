/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedDate, FormattedMessage, defineMessages } from 'react-intl';
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import { Slider, Notification } from "../../components";
import chef from "../../../src/scss/assets/images/demo/chef.png";
import time from "../../../src/scss/assets/images/demo/time.png";
import smile from "../../../src/scss/assets/images/demo/smile.png";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  state = {
    loading: false,
  }

  handleIncrementClick = async (product) => {
    try {
      const { intl } = this.props;
      if (localStorage.getItem('emartmall_token') !== null) {
        this.setState({ loading: true });
        const result = await this.props.incrementProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: product.skucd,
          qty: product.addminqty || 1,
          iscart: 0,
        });
        this.setState({ loading: false });
        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
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
              text={intl.formatMessage(
                messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              },
              )}
            />,
          });
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);

        const updated = this.props.products.find(prod => prod.skucd === product.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
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
              text={intl.formatMessage(
                messages.error, {
                name: updated.title,
                qty: updated.qty,
              },
              )}
            />,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { item, lang } = this.props;
    const { loading } = this.state;
    return (
      <div className="single flex-this">
        <div className="image-container">
          <Link to={item.route ? item.route : ""}>
            <span
              className="image"
              style={{
                backgroundImage: `url(${process.env.IMAGE + item.img})`,
              }}
            />
          </Link>
        </div>
        <div className="info-container flex-space info-price-container recipe-products">
          <Link to={item.route ? item.route : ""}>
            <span className="recipe-product-title">
              {lang === "mn" ? item.title : item.title_en}
            </span>
            <span className="recipe-product-price price">
              {item.pricetag && (
                <span className="pricetag">
                  {lang === "mn" ? item.pricetag : item.pricetag_en}
                </span>
              )}
              <span className="current">
                <small className="sale" style={{ marginRight: '5px', textDecoration: 'line-through' }}>
                  {
                    item.discountprice !== 0 ?
                      `${formatter.format(item.price)}₮` : null
                  }
                </small>
                {formatter.format(item.discountprice !== 0 ? item.discountprice : item.price)}₮
              </span>
            </span>
          </Link>
          <div className="action">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => this.handleIncrementClick(item)}
            >
              <i className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
              {" "}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(List);
