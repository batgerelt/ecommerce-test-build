/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import {
  CARD_TYPES,
  CARD_LIST_TYPES,
  CARD_NUMS_IN_ROW,
} from "../../utils/Consts";
import { Realational, Gallery } from "./components";

class Discount extends React.Component {
  renderRealational = () => {
    try {
      const { data } = this.props;

      return <Realational data={data} />;
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

  render() {
    return (
      <div className="section">
        <div className="container">
          <div className="product-detail-page col-md-12 col-sm-12 col-lg-12">
            <div className="row row10">
              <div className="col-sm-9 col-md-9 col-lg-9 row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  {this.renderGallery()}
                </div>
                {/* this.renderDetails() */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Discount;
