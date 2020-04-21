/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Rate } from "antd";
import { injectIntl, defineMessages } from 'react-intl';
import Button from "@material-ui/core/Button";
import { store } from 'react-notifications-component';

import Skeltons from "../../components/Skeltons/Image";
import { ElasticLabel, Notification } from "../../components";

const formatter = new Intl.NumberFormat("en-US");

class FiveCard extends Component {
  state = {
    loading: false,
    changeHeart: false,
  }

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
          <Button className="action btn btn-link" /* onClick={this.handleSaveClick} */>
            <i className={this.state.changeHeart ? "fa fa-heart" : "fa fa-heart-o"} aria-hidden="true" />
          </Button>
          <Button
            // onClick={() => this.handleIncrement(item)}
            className="action btn btn-link"
            disabled={loading}
          >
            <i className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

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
                // eslint-disable-next-line react/jsx-indent
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
      <div className="col-four col-md-4 col-6">
        <div className="single-product small-product sale-product timed-product">
          {this.renderImage()}
          {this.renderInfo()}
        </div>
      </div>
    );
  }
}

export default injectIntl(FiveCard);
