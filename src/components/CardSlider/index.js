import React from "react";
import PropTypes from "prop-types";

import Swiper from '@eredessil/react-id-swiper';
import Card from "../Card";
import { CARD_TYPES } from "../../utils/Consts";

class CardSlider extends React.Component {
  render() {
    const { params, similarProducts } = this.props;
    let items = similarProducts.map((item, index) => (
      <div
        key={index}
        className={`related-product`}
      >
        <Card key={index} item={item} shape={CARD_TYPES.slim} {...this.props} />
      </div>
    ));

    return (
      items.length && (
        <Swiper {...params} shouldSwiperUpdate style={{ paddingTop: "1px" }}>
          {items}
        </Swiper>
      )
    );
  }
}

CardSlider.propTypes = {
  // eslint-disable-next-line react/require-default-props
  params: PropTypes.object,
  similarProducts: PropTypes.array.isRequired,
};

export default CardSlider;
