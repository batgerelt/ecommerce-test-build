/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_TYPES, CARD_LIST_TYPES, CARD_NUMS_IN_ROW } from "../../utils/Consts";

class Discount extends React.Component {
  renderMainBanner = () => {
    try {
      const { pagebanner } = this.props;

      return (
        <PageBanner
          title={'Хоолны жор'}
          subtitle={'Гэр бүлээрээ хийж идээрэй'}
          banners={pagebanner}
          bgColor="#fffdb7"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderHeaderProduct = () => {
    try {
      const { recipeproduct } = this.props;
      const cardsInCol = 2;

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              type={CARD_LIST_TYPES.vertical}
              cardsInCol={2}
              items={recipeproduct.slice(0, cardsInCol * 3)}
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
      const { pagebanner } = this.props;

      return <Banner data={pagebanner} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { recipeproduct } = this.props;
      const cardsInCol = 2;

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              type={CARD_LIST_TYPES.vertical}
              items={recipeproduct.slice(cardsInCol * 3)}
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
