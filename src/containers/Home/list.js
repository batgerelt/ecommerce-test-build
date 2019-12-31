import React from "react";
import { injectIntl } from 'react-intl';
import moment from "moment";
import { Icon } from "react-fa";
import { isMobileOnly } from 'react-device-detect';

import { Slider, Widget, Banner, Loader } from "../../components";
import { WIDGET_SLUGS } from "../../utils/Consts";

const sliderParams = {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
  spaceBetween: 0,
};

class Homepage extends React.Component {
  getBlocks = (widgets, products) => {
    const { intl } = this.props;
    let blocks = [];
    widgets.forEach((widget) => {
      switch (widget.slug) {
        case WIDGET_SLUGS.onlyemart:
          widget.items = products.emartproduct.product.length === 0
            ? []
            : products.emartproduct.product;
          widget.readMore = intl.formatMessage({ id: "home.widget.emart.readMore" });
          break;
        case WIDGET_SLUGS.discount:
          widget.items = products.discountproduct.product.length === 0
            ? []
            : products.discountproduct.product;
          widget.interval = (
            <span className="widget-interval">
              {moment()
                .startOf("month")
                .format("MM/DD")}{" "}
              ~{" "}
              {moment()
                .endOf("month")
                .format("MM/DD")}
            </span>
          );
          widget.readMore = intl.formatMessage({ id: "home.widget.discount.readMore" });
          widget.icon = (
            <Icon name="calendar" color="red" />
          );
          break;
        case WIDGET_SLUGS.package:
          widget.items = products.packageAll.length === 0
            ? []
            : products.packageAll;
          widget.readMore = intl.formatMessage({ id: "home.widget.package.readMore" });
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.recipe:
          widget.items = products.recipeAll.length === 0
            ? []
            : products.recipeAll;
          widget.readMore = intl.formatMessage({ id: "home.widget.recipe.readMore" });
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.new:
          widget.items = products.newproduct.length === 0
            ? []
            : products.newproduct;
          widget.readMore = intl.formatMessage({ id: "home.widget.new.readMore" });
          break;
        default:
      }

      if (widget.items && widget.items.length > 0) {
        blocks.push(<Widget key={widget.slug} widgetData={widget} {...this.props} />);
      }
    });
    return blocks;
  }

  renderBlocks = () => {
    try {
      const {
        banner,
        widgetAll,
        emartproduct,
        discountproduct,
        packageAll,
        newproduct,
        recipeAll,
      } = this.props;

      const items = {
        products: {
          emartproduct,
          discountproduct,
          packageAll,
          newproduct,
          recipeAll,
        },
        blocks: {
          widget: widgetAll,
          banner,
        },
      };

      const widgets = items.blocks.widget.sort(
        (obj1, obj2) => obj1.orders - obj2.orders,
      );

      let blocksToRender = [];
      blocksToRender.push(this.getBlocks(widgets.slice(0, 2), items.products));
      if (items.blocks.banner.middle.length) {
        if (items.blocks.banner.middle[0]) {
          blocksToRender.push(
            <Banner
              key={items.blocks.banner.middle[0].id}
              data={items.blocks.banner.middle}
            />,
          );
        }
      }
      blocksToRender.push(this.getBlocks(widgets.slice(2, 4), items.products));
      if (items.blocks.banner.footer.length) {
        if (items.blocks.banner.footer[0]) {
          blocksToRender.push(
            <Banner
              key={items.blocks.banner.footer[0].id}
              data={items.blocks.banner.footer}
            />,
          );
        }
      }
      return <div className="homerenderblocks">{blocksToRender}</div>;
    } catch (error) {
      return null;
    }
  }

  renderBrandSlider = () => {
    try {
      const { brand } = this.props;

      const brandParams = {
        slidesPerView: isMobileOnly ? 2 : 5,
        spaceBetween: 10,
        loop: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          type: "bullets",
          clickable: true,
        },
      };

      const brandParams1 = {
        slidesPerView: brand.length,
        spaceBetween: 10,
        loop: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          type: "bullets",
          clickable: true,
        },
      };

      return (
        <div className="brands-list">
          <div className="container pad10">
            <Slider
              ratio={`${isMobileOnly ? 2 : 5}:3x2`}
              sliderData={brand}
              params={brand.length <= 5 ? brandParams1 : brandParams}
              elContainer={"brands"}
              {...this.props}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderMainBanner = () => {
    try {
      const { homepagebanner } = this.props;
      if (homepagebanner.length !== 0) {
        return (
          <div className="main-slide">
            <Slider
              isMain
              ratio="1:3.7x1"
              sliderData={homepagebanner.header === undefined ? [] : homepagebanner.header}
              params={sliderParams}
              elContainer={"banner"}
            />
          </div>
        );
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div className="top-container homepage-container">
        {this.renderMainBanner()}
        {
          this.props.isHomepageBannerLoading ? <Loader />
            :
          <div>
            {this.renderBlocks()}
            <div className="main-slide">
              <div className="container pad10">
                {this.renderBrandSlider()}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(Homepage);
