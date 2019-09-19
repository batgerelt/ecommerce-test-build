/* eslint-disable react/no-danger */
/* eslint-disable import/first */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';
import { CardSlider } from "../../../../components";
import { isMobileOnly } from "react-device-detect";

class Moreinfo extends Component {
  renderMoreInfo = () => {
    try {
      let {
        product, attributes, similarProducts, lang,
      } = this.props;
      const similarProductsLimit = isMobileOnly ? 1 : 4;
      const shouldLoop = similarProducts.length > similarProductsLimit;
      const params = {
        slidesPerView: similarProductsLimit,
        spaceBetween: 0,
        loop: shouldLoop,
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
          {/* !!attributes && !!attributes.length && (
            <div style={{ marginTop: "40px", marginBottom: "0" }}>
              <h1 className="title">
                <span className="text-uppercase">
                  <FormattedMessage id="productDetail.moreInfo.title" />
                </span>
              </h1>
              <div className="product-bottom-info">
                {attributes.map((attr, index) => (
                  <div key={index} className="row row10">
                    <dt className="col-sm-3" style={{ maxWidth: "15%" }}>
                      {lang === "mn" ? attr.value : attr.value_en}
                    </dt>
                    <dd className="col-sm-6">
                      {lang === "mn" ? attr.name : attr.name_en}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          ) */}

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
                style={{ textAlign: 'center' }}
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
  };

  render() {
    return this.renderMoreInfo();
  }
}

export default Moreinfo;
