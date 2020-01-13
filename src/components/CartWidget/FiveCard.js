/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Rate } from "antd";
import { injectIntl, defineMessages } from 'react-intl';
import Button from "@material-ui/core/Button";
import { store } from 'react-notifications-component';

import Skeltons from "../Skeltons/FiveCard";
import { ElasticLabel, Notification } from "../";

const formatter = new Intl.NumberFormat("en-US");

class FiveCard extends Component {
  state = {
    loading: false,
    changeHeart: false,
  }

  handleIncrement = async (item) => {
    const { intl, elastic } = this.props;
    try {
      if (localStorage.getItem('auth') !== null) {
        this.setState({ loading: true });
        if (item.skucd) {
          const result = await this.props.incrementProductRemotely({
            skucd: item.skucd,
            qty: item.addminqty || 1,
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
              content: <Notification type="warning" text={intl.formatMessage(messages.error, { name: result.payload.data.values[1], qty: result.payload.data.values[2] })} />,
            });
          }
        } else if (item.recipeid) {
          const result = await this.props.incrementRecipeProductsRemotely({
            recipeid: item.recipeid,
          });
          this.setState({ loading: false });
          const failedProducts = result.payload.data.fail;

          if (failedProducts.length > 0) {
            const names = failedProducts.map(prod => prod.values[1]);
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
                  { id: result.payload.code },
                  {
                    names: names.join(", "),
                    qty: result.payload.data.qty,
                  },
                )}
              />,
            });
          }
        } else if (item.id) {
          const result = await this.props.incrementPackageProductsRemotely({
            packageid: item.id,
          });
          this.setState({ loading: false });
          const failedProducts = result.payload.data.fail;
          if (failedProducts.length > 0) {
            const names = failedProducts.map(prod => prod.values[1]);
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
                  { id: result.payload.code },
                  {
                    names: names.join(", "),
                    qty: result.payload.data.qty,
                  },
                )}
              />,
            });
          }
        } else {
          this.setState({ loading: false });
          //
        }
      } else {
        if (item.skucd) {
          item.insymd = Date.now();
          if (elastic) { // elastic -аас явуулах боломжгүй барааны нэмэлт мэдээлэл
            return this.props.getMoreInfoElastic({ skucd: item.skucd }).then((res) => {
              if (item.addminqty <= res.payload.data.availableqty) {
                item.availableqty = res.payload.data.availableqty;
                item.price = res.payload.data.unitprice;
                item.sprice = res.payload.data.unitdiscountprice;
                item.addminqty = res.payload.data.addminqty;
                return this.props.incrementProductLocally(item);
              }
              return store.addNotification({
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
                    { id: "200" },
                    {
                      name: item.title,
                      qty: item.qty,
                    },
                  )}
                />,
              });
            });
          }
          const result = await this.props.incrementProductLocally(item);
          const { product } = result.payload;
          if (product.error) {
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
                  text={intl.formatMessage(
                    { id: product.error },
                    {
                      name: product.title,
                      qty: product.qty,
                    },
                  )}
                />
              ),
            });
          }

          const updated = this.props.products.find(prod => prod.skucd === item.skucd);

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
                  messages.error,
                  {
                    name: updated.title,
                    qty: updated.qty,
                  },
                )}
              />,
            });
          }
        } else if (item.recipeid) {
          const result = await this.props.getRecipeProducts({
            id: item.recipeid,
          });

          const products = result.payload.data.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementRecipeProductsLocally(products);

          const errors = this.props.errors.filter(prod => prod.recipeid === item.recipeid);

          if (errors.length > 0) {
            const titles = errors.map(err => err.title);
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
                  { id: "206" },
                  {
                    names: titles.join(", "),
                    qty: products.length - errors.length,
                  },
                )}
              />,
            });
          }
        } else if (item.id) {
          const result = await this.props.getPackageProducts({ id: item.id });
          // console.log('result: ', result);
          const products = result.payload.data.products.map(prod => ({
            ...prod,
            insymd: Date.now(),
          }));

          this.props.incrementPackageProductsLocally(products);
          const errors = this.props.errors.filter(prod => prod.id === item.id);

          if (errors.length > 0) {
            const titles = errors.map(err => err.title);
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
                  { id: "205" },
                  {
                    names: titles.join(", "),
                    qty: products.length - errors.length,
                  },
                )}
              />,
            });
          }
        } else {
          console.log('hello: ', item);
        }

        this.setState({ loading: false });
      }
    } catch (e) {
      return console.log(e);
    }
  };

  handleSaveClick = () => {
    if (localStorage.getItem("auth") === null) {
      this.props.LoginModal.handleLoginModal();
    } else {
      const { item } = this.props;
      this.setState({ changeHeart: true });
      if (item.skucd !== undefined) {
        this.addWishList(item.skucd);
      } else if (item.skucd !== undefined) {
        this.addWishList(item.skucd);
      } else if (item.recipeid !== undefined) {
        this.props.addWishListRecipe({ id: item.recipeid }).then((res) => {
          if (res.payload.success) {
            this.setState({ changeHeart: !this.state.changeHeart });
            this.removeAddedWishColorTime();
          }
        });
      } else {
        this.props.addWishListPackage({ id: item.id }).then((res) => {
          if (res.payload.success) {
            this.setState({ changeHeart: !this.state.changeHeart });
            this.removeAddedWishColorTime();
          }
        });
      }
    }
  }

  addWishList = (skucd) => {
    this.props.addWishList({ skucd }).then((res) => {
      const { addWishList, removeAddedWishColor } = this.props;
      addWishList({ skucd }).then((res) => {
        if (res.payload.success) {
          this.removeAddedWishColorTime();
        }
      });
    });
  }

  removeAddedWishColorTime = () => {
    const { removeAddedWishColor } = this.props;
    setTimeout(() => {
      removeAddedWishColor();
    }, 500);
  }

  // render image function
  renderImage = () => {
    const {
      item, isVisible, tags, isDiscount,
    } = this.props;
    const { loading } = this.state;

    if (!isVisible) { return <Skeltons data={item} tags={tags} isDiscount={isDiscount} />; }
    return (
      <div className="image-container">
        <Link to={`/productdetail/${item.skucd}`}>
          <span
            className="image"
            style={{
                backgroundImage: `url(${process.env.IMAGE + item.imgnm})`,
                backgroundSize: "contain",
              }}
          />
        </Link>
        <ElasticLabel data={item} tags={tags} isDiscount={isDiscount} />
        <div className="search-hover action">
          <Button className="action btn btn-link" onClick={this.handleSaveClick}>
            <i className={this.state.changeHeart ? "fa fa-heart" : "fa fa-heart-o"} aria-hidden="true" />
          </Button>
          <Button
            onClick={() => this.handleIncrement(item)}
            className="action btn btn-link"
            disabled={loading}
          >
            <i className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  // render info container
  renderInfo = () => {
    const { item } = this.props;
    const lang = this.props.intl.locale;

    return (
      <div className="info-container">
        <Link to={`/productdetail/${item.skucd}`}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lang === "mn"
              ? item.title
              : item.title_en
              ? item.title_en
              : item.title}
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lang === "mn"
              ? item.shortnm
              : item.shortnm_en
              ? item.shortnm_en
              : item.shortnm}
          </span>
        </Link>
        <Rate allowHalf disabled defaultValue={0} value={item.rate / 2} />
        <div className="price">
          {item.pricetag && (
            <span className="pricetag">
              {lang === "mn"
                ? item.pricetag
                : item.pricetag_en
                ? item.pricetag_en
                : item.pricetag}
            </span>
          )}

          {
            // elastic-aas hymdraltai baraa-g ilgeeh bolomjgui tul ingej shalgaj bui
            item.discountprice && item.discountprice !== 0 ? (
              <React.Fragment>
                <small className="sale">
                  {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
                </small>
                <span className="current">
                  {isNaN(item.discountprice) ? 0 : formatter.format(item.discountprice)}              ₮
                </span>
              </React.Fragment>
            ) : (
              <span className="current">
                {isNaN(item.price) ? 0 : formatter.format(item.price)}₮
              </span>
            )
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col-five pad10 col-md-3 col-6">
        <div className="single-product small-product sale-product timed-product">
          {this.renderImage()}
          {this.renderInfo()}
        </div>
      </div>
    );
  }
}

export default injectIntl(FiveCard);
