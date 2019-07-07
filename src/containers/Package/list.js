/* eslint-disable radix */
import React from "react";

import { CardList, Banner, PageBanner } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

class Discount extends React.Component {
  renderMainBanner = () => {
    try {
      const { packagebanner, menuPackage } = this.props;

      return (
        <PageBanner
          title={menuPackage.menunm}
          subtitle={menuPackage.subtitle}
          banners={packagebanner.length === 0 ? [] : packagebanner.header}
          bgColor="#fffdb7"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderHeaderProduct = () => {
    try {
      const { widgetAll, packageAll } = this.props;
      return (
        <div className="section package">
          <div className="container pad10">
            {
              <CardList
                type={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === 'package').type}
                items={packageAll.slice(0, 8)}
                {...this.props}
              />
            }
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  renderSubBanner = () => {
    try {
      const { packagebanner } = this.props;

      return <Banner data={packagebanner.length === 0 ? [] : packagebanner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { packageAll, widgetAll } = this.props;

      return (
        <div className="section">
          <div className="container pad10">
            {
              <CardList
                type={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === 'package').type}
                items={packageAll.slice(8)}
                second
                {...this.props}
              />
            }
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
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
