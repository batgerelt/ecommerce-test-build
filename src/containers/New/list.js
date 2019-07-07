/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_TYPES, CARD_LIST_TYPES, CARD_NUMS_IN_ROW } from "../../utils/Consts";

class New extends React.Component {
  renderMainBanner = () => {
    try {
      const { newbanner, menuNew } = this.props;

      return (
        <PageBanner
          title={menuNew.menunm}
          subtitle={menuNew.subtitle}
          banners={newbanner.length === 0 ? [] : newbanner.footer}
          bgColor="#bbdefb"
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
      const { newproduct } = this.props;

      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              type={CARD_LIST_TYPES.horizontal}
              seq={seq}
              items={newproduct.slice(0, cardsLength)}
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
      const { newbanner } = this.props;
      return <Banner data={newbanner.length === 0 ? [] : newbanner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { newproduct } = this.props;

      const seq = "1,1";
      const cardTypes = seq.split(",");
      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              type={CARD_LIST_TYPES.horizontal}
              items={newproduct.slice(cardsLength)}
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

export default New;
