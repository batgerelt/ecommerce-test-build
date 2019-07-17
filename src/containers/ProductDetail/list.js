/* eslint-disable radix */
import React from "react";
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
import { NotFound } from "../../components";
// eslint-disable-next-line import/first
import { height } from "@material-ui/system";

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
      const {
        detail, categorymenu, addWishList, addRate, getProductDetail,
      } = this.props;
      return (
        <Detail
          detail={detail.length === 0 ? {} : detail.products[0]}
          categorymenu={categorymenu.length === 0 ? [] : categorymenu}
          isLoggedIn={localStorage.getItem("auth") === null ? null : JSON.parse(localStorage.getItem("auth"))}
          addWishList={addWishList}
          addRate={addRate}
          getProductDetail={getProductDetail}
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
          {...this.props}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderCommentList = () => {
    try {
      const { detail, comment, addComment } = this.props;
      return (
        <Comment
          product={detail.length === 0 ? {} : detail.products[0]}
          comments={comment}
          addComment={addComment}
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
          product={detail.length === 0 ? {} : detail.products[0]}
          categories={categorymenu}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSocialButtons = (product) => {
    try {
      return (
        <div className="social-buttons">
          <ul
            className="list-inline"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <li className="list-inline-item">
              <span>Хуваалцах:</span>
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <FacebookShareButton
                url={window.location.href}
                quote={product.name}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon size={25} round />
              </FacebookShareButton>
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <TwitterShareButton
                url={window.location.href}
                quote={product.name}
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
    const { detail, categorymenu } = this.props;
    if (detail.length === 0 || detail.products.length === 0) {
      return <NotFound />;
    }
    return (
      <div className="section">
        <div className="container">
          {this.renderBreadCrumb()}
          <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
            <div className="row row10">
              <div className="col-sm-9 col-md-9 col-lg-9 row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  {this.renderGallery()}
                  {this.renderSocialButtons(detail.length === 0 ? {} : detail.products[0])}
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

export default ProductDetail;
