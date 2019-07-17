import React from "react";
import PropTypes from "prop-types";

import Swiper from '@eredessil/react-id-swiper';
import Card from "../Card";
import { CARD_TYPES } from "../../utils/Consts";

class CardSlider extends React.Component {
  render() {
    const { params, similarProducts } = this.props;

    console.log('this.props: ', this.props);

    let items = similarProducts.map((item, index) => (
      <div
        key={index}
        className={`related-product col-four pad10 col-md-3 col-12`}
      >
        <Card key={index} item={item} type={CARD_TYPES.slim} {...this.props} />
      </div>
    ));

    return (
      items.length && (
        <Swiper {...params} shouldSwiperUpdate rebuildOnUpdate>
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
