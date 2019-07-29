/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";

class Recipe extends React.Component {
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
  };

  renderHeaderProduct = () => {
    try {
      const { recipeproduct } = this.props;

      return (
        <div className="section">
          <div className="container pad10">
            {recipeproduct.length > 6 ? (
              <CardList
                cardListType={CARD_LIST_TYPES.vertical}
                cardsInCol={2}
                items={recipeproduct.slice(0, 6)}
                {...this.props}
              />
            ) : (
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                items={recipeproduct}
                {...this.props}
              />
            )}
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      const { recipebanner } = this.props;

      return (
        <Banner data={recipebanner.length === 0 ? [] : recipebanner.footer} />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderFooterProduct = () => {
    try {
      let { recipeproduct } = this.props;

      if (recipeproduct.length <= 6) {
        return null;
      }

      recipeproduct = recipeproduct.slice(6);

      const iteration = Math.floor(recipeproduct.length / 6);
      const remainder = recipeproduct.length % 6;

      return (
        <div className="section">
          <div className="container pad10">
            {remainder > 0 ? (
              <div>
                <CardList
                  cardListType={CARD_LIST_TYPES.vertical}
                  items={recipeproduct.slice(0, iteration * 6)}
                  {...this.props}
                />
                <CardList
                  cardListType={CARD_LIST_TYPES.horizontal}
                  // eslint-disable-next-line no-mixed-operators
                  items={recipeproduct.slice(iteration * 6)}
                  cardType={CARD_TYPES.wide}
                  showAll
                  {...this.props}
                />
              </div>
            ) : (
              <CardList
                cardListType={CARD_LIST_TYPES.vertical}
                items={recipeproduct}
                {...this.props}
              />
            )}
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

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

export default Recipe;
