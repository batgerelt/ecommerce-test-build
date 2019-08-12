import React from "react";
import { injectIntl } from 'react-intl';
import moment from "moment";
import MessengerCustomerChat from "react-messenger-customer-chat";
import { Icon } from "react-fa";
import { BackTop } from "antd";

import { Slider, Widget, Banner } from "../../components";
import { WIDGET_SLUGS, SOCIAL_IDS } from "../../utils/Consts";

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
  state = {
    widgetAll: [],
    emartproduct: [],
    discountproduct: [],
    packageAll: [],
    newproduct: [],
    recipeAll: [],
  };

  async loadData() {
    const widgetsResult = await this.props.getWidget();
    const emartProductsResult = await this.props.getEmartProduct({});
    const newProductsResult = await this.props.getNewProduct({});
    const discountProductsResult = await this.props.getDiscountProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 20,
      order: `price_asc`,
    });
    const packagesResult = await this.props.getPackage({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });
    const recipesResult = await this.props.getRecipe({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });

    if (widgetsResult.payload.success) {
      this.setState({
        widgetAll: widgetsResult.payload.data,
        emartproduct: emartProductsResult.payload.data,
        discountproduct: discountProductsResult.payload.data,
        packageAll: packagesResult.payload.data,
        newproduct: newProductsResult.payload.data,
        recipeAll: recipesResult.payload.data,
      });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.intl.locale !== this.props.intl.locale) {
      this.loadData();
    }
  }

  getBlocks = (widgets, products) => {
    const { intl } = this.props;
    let blocks = [];
    widgets.forEach((widget) => {
      switch (widget.slug) {
        case WIDGET_SLUGS.onlyemart:
          widget.items = products.emartproduct;
          widget.readMore = intl.formatMessage({ id: "home.widget.emart.readMore" });
          break;
        case WIDGET_SLUGS.discount:

          widget.items = products.discountproduct.length === 0 ? [] : products.discountproduct.product;
          widget.interval = (
            <span>
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
          widget.items = products.packageAll.products;
          widget.readMore = intl.formatMessage({ id: "home.widget.package.readMore" });
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.recipe:
          widget.items = products.recipeAll.products;
          widget.readMore = intl.formatMessage({ id: "home.widget.recipe.readMore" });
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.new:
          widget.items = products.newproduct;
          widget.readMore = intl.formatMessage({ id: "home.widget.new.readMore" });
          break;
        default:
      }

      if (widget.items.length > 0) {
        blocks.push(<Widget key={widget.slug} widgetData={widget} {...this.props} />);
      }
    });
    return blocks;
  }

  renderBlocks = () => {
    try {
      const { homepagebanner } = this.props;
      const {
        widgetAll,
        emartproduct,
        discountproduct,
        packageAll,
        newproduct,
        recipeAll,
      } = this.state;

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
          banner: homepagebanner,
        },
      };

      const widgets = items.blocks.widget.sort(
        (obj1, obj2) => obj1.orders - obj2.orders,
      );

      let blocksToRender = [];

      blocksToRender.push(this.getBlocks(widgets.slice(0, 2), items.products));
      if (items.blocks.banner.middle.length) {
        blocksToRender.push(
          <Banner
            key={items.blocks.banner.middle[0].id}
            data={items.blocks.banner.middle}
          />,
        );
      }

      blocksToRender.push(this.getBlocks(widgets.slice(2, 4), items.products));
      if (items.blocks.banner.footer.length) {
        blocksToRender.push(
          <Banner
            key={items.blocks.banner.footer[0].id}
            data={items.blocks.banner.footer}
          />,
        );
      }

      return <div className="homerenderblocks">{blocksToRender}</div>;
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  renderBrandSlider = () => {
    try {
      const { brand } = this.props;

      const brandParams = {
        slidesPerView: 5,
        spaceBetween: 10,
        loop: true,
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
        loop: true,
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
        <div className="main-slide brands-list">
          <div className="container pad10">
            <Slider
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
      <div className="top-container">
        {this.renderMainBanner()}
        {this.renderBlocks()}

        <div className="main-slide brands-list">
          <div className="container pad10">
            {this.renderBrandSlider()}

            <MessengerCustomerChat
              pageId="169275059877520"
              appId={SOCIAL_IDS.facebook}
              htmlRef={window.location.pathname}
            />
          </div>
        </div>
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Homepage);
