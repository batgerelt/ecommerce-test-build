import React from "react";
import moment from "moment";
import MessengerCustomerChat from "react-messenger-customer-chat";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "react-fa";

import { Slider, Widget, Banner } from "../../components";
import { WIDGET_SLUGS, SOCIAL_IDS } from "../../utils/Consts";

class Homepage extends React.Component {
  getBlocks(widgets, products) {
    let blocks = [];

    widgets.forEach((widget) => {
      switch (widget.slug) {
        case WIDGET_SLUGS.onlyemart:
          widget.items = products.prodsEmart;
          widget.readMore = "Бусад Имартын барааг үзэх";
          break;
        case WIDGET_SLUGS.discount:
          widget.items = products.prodsDiscount;
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
          widget.readMore = "Бусад хямдралтай барааг үзэх";
          widget.icon = (
            <Icon name="calendar" color="red" />
          );
          break;
        case WIDGET_SLUGS.package:
          widget.items = products.prodsPackage;
          widget.readMore = "Бусад багцыг үзэх";
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.recipe:
          widget.items = products.recipes;
          widget.readMore = "Бусад хоолны жорыг үзэх";
          widget.icon = <Icon name="home" color="red" />;
          break;
        case WIDGET_SLUGS.new:
          widget.items = products.prodsNew;
          widget.readMore = "Бусад шинэ барааг үзэх";
          break;
        default:
      }

      if (widget.items.length > 0) {
        blocks.push(<Widget key={widget.slug} data={widget} />);
      }
    });

    return blocks;
  }

  renderBlocks(items) {
    const widgets = items.blocks.widgets.sort(
      (obj1, obj2) => obj1.orders - obj2.orders,
    );

    let blocksToRender = [];

    blocksToRender.push(this.getBlocks(widgets.slice(0, 2), items.products));
    if (items.blocks.banners[1].length) {
      blocksToRender.push(
        <Banner
          key={items.blocks.banners[1][0].id}
          data={items.blocks.banners[1]}
        />,
      );
    }
    blocksToRender.push(this.getBlocks(widgets.slice(2, 4), items.products));
    if (items.blocks.banners[2].length) {
      blocksToRender.push(
        <Banner
          key={items.blocks.banners[2][0].id}
          data={items.blocks.banners[2]}
        />,
      );
    }

    return blocksToRender;
  }

  render() {
    // const {
    //   categories,
    //   banners,
    //   brands,
    //   widgets,
    //   prodsEmart,
    //   prodsDiscount,
    //   prodsPackage,
    //   prodsNew,
    //   recipes,
    // } = this.props.container;

    // const items = {
    //   products: {
    //     prodsEmart,
    //     prodsDiscount,
    //     prodsPackage,
    //     prodsNew,
    //     recipes,
    //   },
    //   blocks: {
    //     widgets,
    //     banners,
    //   },
    // };

    // const root = [];
    // categories.forEach((category) => {
    //   if (category.parentid === 0) {
    //     category.children = [];
    //     root.push(category);
    //   }
    //   root.forEach((entry) => {
    //     if (entry.id === category.parentid) {
    //       entry.children.push(category);
    //     }
    //   });
    // });

    // const sliderParams = {
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false,
    //   },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     type: "bullets",
    //     clickable: true,
    //   },
    //   spaceBetween: 0,
    // };

    // const brandParams = {
    //   slidesPerView: 5,
    //   spaceBetween: 10,
    //   loop: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false,
    //   },
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   pagination: {
    //     type: "bullets",
    //     clickable: true,
    //   },
    // };

    // const brandParams1 = {
    //   slidesPerView: brands.length,
    //   spaceBetween: 10,
    //   loop: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false,
    //   },
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   pagination: {
    //     type: "bullets",
    //     clickable: true,
    //   },
    // };

    // return (
    //   <div className="top-container">
    //     <div className="main-slide">
    //       <Slider
    //         data={banners[0]}
    //         params={sliderParams}
    //         elContainer={"banner"}
    //       />
    //     </div>
    //     <div className="homerenderblocks">{this.renderBlocks(items)}</div>

    //     <div className="main-slide brands-list">
    //       <div className="container pad10">
    //         <Slider
    //           data={brands}
    //           params={brands.length <= 5 ? brandParams1 : brandParams}
    //           elContainer={"brands"}
    //         />
    //       </div>
    //     </div>

    //     <MessengerCustomerChat
    //       pageId="169275059877520"
    //       appId={SOCIAL_IDS.facebook}
    //       htmlRef={window.location.pathname}
    //     />
    //   </div>
    // );
    return <div>hello</div>;
  }
}

export default Homepage;
