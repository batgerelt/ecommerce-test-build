/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-children-prop */
import React from "react";
import { Helmet } from "react-helmet";
import { FormattedMessage, injectIntl } from "react-intl";
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
  renderHelmet = () => {
    const { images, products } = this.props.detail;
    const lang = this.props.intl.locale;
    return (
      <Helmet>
        <meta name="description" content={products.description} />
        <meta name="url" content={window.location.href} />

        <meta name="twitter:title" content={lang === "en" ? products.title_en : products.title} />
        <meta name="twitter:description" content={products.description} />
        <meta name="twitter:image" content={process.env.IMAGE + images[0].img} />
        <meta name="twitter:site" content={window.location.href} />

        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={lang === "en" ? products.title_en : products.title} />
        <meta property="og:description" content={products.description} />
        <meta property="og:image" content={process.env.IMAGE + images[0].img} />
        <meta property="og:image:secure_url" content={process.env.IMAGE + images[0].img} />
        <meta itemProp="image" content={process.env.IMAGE + images[0].img} />
        <title>{products.title}</title>
      </Helmet>
    );
  }

  onCancel = () => {
    this.setState({ giftvisible: false });
  }

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
                children={<span><p>heloooooooooo</p><img width={50} alt="logo" src={process.env.IMAGE + detail.images[0].img} /></span>}
                url={window.location.href}
                href={window.location.href}
                quote={detail.products.name}
              >
                <FacebookIcon size={25} round />
              </FacebookShareButton>
            </li>
            <li>
              {/* <Fbshare
                quote="Check this library to help you create share facebook url"
                href="https://bukinoshita.io"
                redirect_uri="https://bukinoshita.io"
                app_id="1438714326447694"
              /> */}
              {/* <div
                className="fb-share-button"
                data-href="https://developers.facebook.com/docs/plugins/"
                data-layout="button"
                data-size="large"
              >
                <a
                  target="_blank"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
                  className="fb-xfbml-parse-ignore"
                >Share
                </a>
              </div> */}
              {/* <a href={shareFacebook({ redirect_uri: window.location.href, url: window.location.href, app_id: '1438714326447694' })}>S</a> */}
            </li>
            <li className="list-inline-item" style={{ cursor: "pointer" }}>
              <TwitterShareButton
                url={window.location.href}
                quote={detail.products.name}
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
    const {
      relational, detail, attribute, collection, categorymenu,
    } = this.props;
    if (this.props.detail !== null && this.props.detail.products !== null) {
      return (
        <div className="section">
          {this.renderHelmet()}
          <div className="container pad10">
            <Breadcrumb
              product={detail.products}
              categories={categorymenu}
              {...this.props}
            />
            <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
              <div className="row row10">
                <div className="col-lg-9 row">
                  <div className="col-xl-5 col-lg-5 col-md-5 gallery-wrapper">
                    <Gallery
                      images={detail.images}
                      tags={detail.products.tags}
                    />
                    {this.renderSocialButtons()}
                  </div>
                  {this.renderDetails()}
                </div>
                <div className="col-lg-3 ">
                  <div className="cart-info filter-sticky">
                    <div className="product-plus">
                      <Delivery detail={detail.products} {...this.props} />
                      <Relational relatedProducts={relational} {...this.props} />
                    </div>
                  </div>
                </div>
                <Moreinfo
                  product={detail.products}
                  attributes={attribute.length === 0 ? [] : attribute}
                  similarProducts={collection}
                  {...this.props}
                />
                {this.renderCommentList()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>{this.props.isEmpty ? <ProductNotFound /> : ""}</div>
    );
  }
}

export default injectIntl(ProductDetail);
