/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

class Discount extends React.Component {
  renderMainBanner = () => {
    try {
      const { recipebanner, menuRecipe } = this.props;

      return (
        <PageBanner
          title={menuRecipe.menunm}
          subtitle={menuRecipe.subtitle}
          banners={recipebanner.length === 0 ? [] : recipebanner.header}
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
      const { recipebanner } = this.props;

      return <Banner data={recipebanner.length === 0 ? [] : recipebanner.footer} />;
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
