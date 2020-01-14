/* eslint-disable react/no-danger */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/first */
import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';
import { CardSlider } from "../../../../components";
import { isMobileOnly } from "react-device-detect";

let skucd = null;
class Moreinfo extends Component {
  shouldComponentUpdate(nextProps) {
    const { similarProducts, detail } = nextProps;
    if (similarProducts.length === 0 || this.props.similarProducts !== similarProducts) { return true; }
    if (skucd !== detail.products.skucd) {
      skucd = detail.products.skucd;
      return true;
    }
    return false;
  }

  render() {
    try {
      let {
        product, attributes, similarProducts, lang,
      } = this.props;
      const similarProductsLimit = isMobileOnly ? 2 : window.innerWidth >= 576 && window.innerWidth <= 991 ? 3 : 6;
      const params = {
        slidesPerView: similarProductsLimit,
        spaceBetween: 0,
        loop: false,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          type: "bullets",
          clickable: true,
        },
      };
      return (
        <div className="col-md-12 col-lg-12 col-sm-12 col-xl-12 ck-editor">
          {!!similarProducts && !!similarProducts.length && (
            <div className="similar-products">
              <h1 className="title">
                <span className="text-uppercase">
                  <FormattedMessage id="productDetail.similarProducts.title" />
                </span>
              </h1>
              <div>
                <div className="row row10">
                  <CardSlider params={params} similarProducts={similarProducts} {...this.props} />
                </div>
              </div>
            </div>
          )}

          {product.description && (
            <div className="intro">
              <h1 className="title">
                <span className="text-uppercase">
                  <FormattedMessage id="productDetail.intro.title" />
                </span>
              </h1>

              <div
                dangerouslySetInnerHTML={{
                  __html: lang === "mn"
                    ? product.description
                    : product.description_en,
                }}
              />
            </div>
          )}
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

export default Moreinfo;
