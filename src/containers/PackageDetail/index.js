/* eslint-disable react/no-danger */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Package as PackageModel } from "../../models";
import PackageProductList from './components/PackageProductList';
import SimilarProductList from './components/SimilarProductList';
import PackageDate from './components/PackageDate';
import PackageSlider from './components/PackageSlider';
import DeliveryInfo from './components/DeliveryInfo';

function PackageDetail({
  match: { params },
  intl: { locale },
  getPackageDetail,
  getPackageInfo,
  info,
  images,
  packageDetail,
}) {
  useEffect(() => {
    getPackageDetail({ id: params.id });
    getPackageInfo({ id: params.id });
  }, []);

  return (
    <div className="section">
      <div className="container pad10">
        <div className="e-breadcrumb">
          <ul className="list-unstyled">
            <li>
              <Link to="">
                <span>
                  <FormattedMessage id="packageDetail.breadcrumb.home" />
                </span>
              </Link>
            </li>
            <li>
              <Link to="/package">
                <span>
                  <FormattedMessage id="packageDetail.breadcrumb.package" />
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="product-detail-page package-detail">
          <div className="row row10">
            <div className="col-lg-9 pad10">
              {info && (
                <PackageDate info={info} />
              )}

              {images && (
                <PackageSlider images={images} />
              )}

              {info && (
                <div
                  style={{ lineHeight: "200%" }}
                  className="product-plus htmlcontainer"
                  dangerouslySetInnerHTML={{
                    __html: locale === "mn"
                      ? info.description
                      : info.description_en,
                  }}
                />
              )}

              <div className="pack-product-container">
                <p className="title">
                  <strong style={{ fontSize: "1.1rem" }}>
                    <FormattedMessage id="packageDetail.title.recipeProducts" />
                  </strong>
                </p>

                {packageDetail && packageDetail.products && (
                  <PackageProductList
                    id={params.id}
                    products={packageDetail.products}
                  />
                )}
              </div>
            </div>
            <div className="col-lg-3 pad10">
              <div className="product-plus">
                {info && (
                  <DeliveryInfo info={info} />
                )}

                {packageDetail && packageDetail.sameproducts && (
                  <SimilarProductList
                    products={packageDetail.sameproducts}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ package: { info, images, packageDetail } }) => ({ info, images, packageDetail });

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    getPackageDetail: PackageModel.getDetailPackage,
    getPackageInfo: PackageModel.getInfoPackage,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PackageDetail));
