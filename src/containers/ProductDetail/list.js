/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import {
  CARD_TYPES,
  CARD_LIST_TYPES,
  CARD_NUMS_IN_ROW,
} from "../../utils/Consts";
import { Realational } from "./components";

class Discount extends React.Component {
  renderRealational = () => {
    try {
      const { data } = this.props;

      return <Realational data={data} />;
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="top-container">{/* this.renderRealational() */}</div>
    );
  }
}

export default Discount;
