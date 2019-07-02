/* eslint-disable radix */
import React from "react";
import { CardList, Banner, PageBanner } from "../../components";

import {
  CARD_TYPES,
  CARD_LIST_TYPES,
  CARD_NUMS_IN_ROW,
} from "../../utils/Consts";
import {
  Relational,
  Gallery,
  Detail,
  Delivery,
  Moreinfo,
  Comment,
  Breadcrumb,
} from "./components";

class Discount extends React.Component {
  renderRealational = () => {
    try {
      const { relational } = this.props;

      return <Relational relatedProducts={relational} />;
    } catch (error) {
      return console.log(error);
    }
  };

  renderGallery = () => {
    try {
      const { detail } = this.props;
      return (
        <Gallery
          images={detail.length === 0 ? [] : detail.images}
          tags={detail.length === 0 ? [] : detail.products[0].tags}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };
  renderDetails = () => {
    try {
      const { detail, categorymenu } = this.props;
      return (
        <Detail
          detail={detail.length === 0 ? [] : detail.products[0]}
          categorymenu={categorymenu.length === 0 ? [] : categorymenu}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderDeliveryInfo = () => {
    try {
      const { detail } = this.props;

      return (
        <Delivery detail={detail.length === 0 ? [] : detail.products[0]} />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  // eslint-disable-next-line consistent-return
  renderMoreInfo = () => {
    try {
      const { detail, attribute, collection } = this.props;
      return (
        <Moreinfo
          product={detail.length === 0 ? [] : detail.products[0]}
          attributes={attribute.length === 0 ? [] : attribute}
          similarProducts={collection.length === 0 ? [] : collection}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderCommentList = () => {
    try {
      const { detail, comment } = this.props;
      return (
        <Comment
          product={detail.length === 0 ? [] : detail.products[0]}
          comments={comment}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderBreadCrumb = () => {
    try {
      const { detail, categorymenu } = this.props;
      return (
        <Breadcrumb
          product={detail.length === 0 ? [] : detail.products[0]}
          categories={categorymenu}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return (
      <div className="section">
        <div className="container">
          {/* this.renderBreadCrumb() */}
          <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
            <div className="row row10">
              <div className="col-sm-9 col-md-9 col-lg-9 row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  {this.renderGallery()}
                </div>
                {this.renderDetails()}
              </div>
              <div className="col-xl-3 col-lg-3 col-sm-3 col-md-3">
                <div className="product-plus">
                  {this.renderDeliveryInfo()}
                  {this.renderRealational()}
                </div>
              </div>
              {this.renderMoreInfo()}
              {this.renderCommentList()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Discount;
