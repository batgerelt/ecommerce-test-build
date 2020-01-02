/* eslint-disable react/no-children-prop */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
import { Modal } from "antd";
import { FormattedMessage } from "react-intl";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import {
  Relational,
  Gallery,
  Detail,
  Delivery,
  Moreinfo,
  Comment,
  Breadcrumb,
} from "./components";
import { ProductNotFound } from "../";

class ProductDetail extends React.Component {
  onCancel = () => {
    this.setState({ giftvisible: false });
  }

  renderRealational = () => {
    try {
      const { relational } = this.props;
      return <Relational relatedProducts={relational} {...this.props} />;
    } catch (error) {
      return console.log(error);
    }
  };

  renderGallery = () => {
    try {
      const { detail } = this.props;
      return (
        <Gallery
          images={detail.images}
          tags={detail.products.tags}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };
  renderDetails = () => {
    try {
      const {
        detail, categorymenu, addWishList, addRate, getProductRate, removeAddedWishColor, attribute,
      } = this.props;
      return (
        <Detail
          detail={detail.products === null ? {} : detail.products}
          categorymenu={categorymenu.length === 0 ? [] : categorymenu}
          addWishList={addWishList}
          attributes={attribute.length === 0 ? [] : attribute}
          addRate={addRate}
          LoginModal={this.props.LoginModal}
          removeAddedWishColor={removeAddedWishColor}
          getProductRate={getProductRate}
          {...this.props}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderCommentList = () => {
    try {
      const {
        detail, comment, addComment, getProductComment, addRate, getProductRate, rate, getProductDetail, match, isFeedBack, isfeedbacks,
      } = this.props;
      return (
        <Comment
          onVisible={this.onVisible}
          rate={rate}
          detail={detail.products === null ? {} : detail.products}
          isFeedBack={isFeedBack}
          isfeedbacks={isfeedbacks}
          getProductRate={getProductRate}
          addRate={addRate}
          product={detail.products}
          comments={comment}
          addComment={addComment}
          match={match}
          getProductComment={getProductComment}
          auth={this.props.isLoggedIn}
          user={this.props.userInfo}
          getProductDetail={getProductDetail}
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
        <Delivery detail={detail.products} {...this.props} />
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
          product={detail.products}
          attributes={attribute.length === 0 ? [] : attribute}
          similarProducts={collection}
          {...this.props}
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
          product={detail.products}
          categories={categorymenu}
          {...this.props}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSocialButtons = () => {
    try {
      const { detail } = this.props;
      return (
        <div className="social-buttons">
          <ul className="list-inline">
            <li className="list-inline-item share-text upper-first">
              <span><FormattedMessage id="shared.share" />:</span>
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <FacebookShareButton
                url={window.location.href}
                quote={detail.products.name}
                className="Demo__some-network__share-button"
                children={
                  <div>
                    <img alt="hello" src={process.env.IMAGE + detail.products.img} />
                  </div>
                }
              >
                <FacebookIcon size={25} round />
              </FacebookShareButton>
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <TwitterShareButton
                url={window.location.href}
                quote={detail.products.name}
                className="Demo__some-network__share-button"
              >
                <TwitterIcon size={25} round />
              </TwitterShareButton>
            </li>
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    if (this.props.detail !== null && this.props.detail.products !== null) {
      return (
        <div className="section">
          <div className="container pad10">
            {this.renderBreadCrumb()}
            <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
              <div className="row row10">
                <div className="col-lg-9 row">
                  <div className="col-xl-5 col-lg-5 col-md-5 gallery-wrapper">
                    {this.renderGallery()}
                    {this.renderSocialButtons()}
                  </div>
                  {this.renderDetails()}
                </div>
                <div className="col-lg-3 ">
                  <div className="cart-info filter-sticky">
                    <div className="product-plus">
                      {this.renderDeliveryInfo()}
                      {this.renderRealational()}
                    </div>
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
    return (
      this.props.loading ? "" : <ProductNotFound />
    );
  }
}

export default ProductDetail;
