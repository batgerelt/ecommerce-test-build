import React from "react";
import PropTypes from "prop-types";

import Swiper from '@eredessil/react-id-swiper';
import Card from "../Card";
import { CARD_TYPES } from "../../utils/Consts";

class CardSlider extends React.Component {
  render() {
    const { params, data } = this.props;

    let items = data.map((item, index) => (
      <div
        key={index}
        className={`related-product col-four pad10 col-md-3 col-12`}
      >
        <Card key={index} item={item} shape={CARD_TYPES.slim} />
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
  data: PropTypes.array.isRequired,
};

export default CardSlider;
