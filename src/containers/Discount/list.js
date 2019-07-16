/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_TYPES, CARD_LIST_TYPES, CARD_NUMS_IN_ROW } from "../../utils/Consts";

class Discount extends React.Component {
  renderMainBanner = () => {
    try {
      const { discountbanner, menuDiscount } = this.props;

      return (
        <PageBanner
          title={menuDiscount.menunm}
          subtitle={menuDiscount.subtitle}
          banners={discountbanner.length === 0 ? [] : discountbanner.header}
          bgColor="#4286f4"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      const cardTypes = seq.split(",");
      const { discountproduct } = this.props;

      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              shape={CARD_LIST_TYPES.horizontal}
              seq={seq}
              items={discountproduct.slice(0, cardsLength)}
              {...this.props}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderSubBanner = () => {
    try {
      const { discountbanner } = this.props;
      return <Banner data={discountbanner.length === 0 ? [] : discountbanner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { discountproduct } = this.props;

      const seq = "1,1";
      const cardTypes = seq.split(",");
      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              shape={CARD_LIST_TYPES.horizontal}
              items={discountproduct.slice(cardsLength)}
              showAll
              cardType={CARD_TYPES.slim}
              {...this.props}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    return (
      <div className="top-container">
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
      </div>
    );
  }
}

export default Discount;
