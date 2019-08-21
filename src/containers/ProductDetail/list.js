/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
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

class ProductDetail extends React.Component {
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
          isLoggedIn={this.props.isLogged}
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
          similarProducts={collection.length === 0 ? [] : collection}
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
        detail, comment, addComment, getProductComment,
      } = this.props;
      return (
        <Comment
          product={detail.products}
          comments={comment}
          addComment={addComment}
          getProductComment={getProductComment}
          auth={this.props.isLogged}
          user={this.props.data}
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
          <ul
            className="list-inline"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <li className="list-inline-item">
              <span><FormattedMessage id="shared.share" />:</span>
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <FacebookShareButton
                url={window.location.href}
                quote={detail.products.name}
                className="Demo__some-network__share-button"
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
          <div className="container">
            {this.renderBreadCrumb()}
            <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
              <div className="row row10">
                <div className="col-sm-9 col-md-9 col-lg-9 row" style={{ paddingLeft: "5px" }}>
                  <div className="col-xl-5 col-lg-5 col-md-5" style={{ paddingLeft: "5px" }}>
                    {this.renderGallery()}
                    {this.renderSocialButtons()}
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
    return (
      <div>
        Бараа олдсонгүй
      </div>
    );
  }
}

export default ProductDetail;
