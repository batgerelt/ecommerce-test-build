/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from "antd";
import { CardList, Banner, PageBanner, Loader } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

let index = 8;
class Discount extends React.Component {
  state = {
    footerProducts: [],
    headerProducts: [],
    start: 8,
    rowcount: 1,
    allCount: 8,
    hasMore: true,
  }
  componentWillMount() {
    this.props.getPackage({
      order: "price_asc",
      start: 0,
      rowcnt: 8,
    }).then((res) => {
      if (res.payload.success) {
        this.setState({ headerProducts: res.payload.data.products, rowcount: res.payload.data.count });
      }
    });
    this.getData();
  }

  getData = () => {
    if (!this.props.packageFetching && this.state.rowcount !== this.state.allCount) {
      this.props.getPackage({
        order: "price_asc",
        start: this.state.start,
        rowcnt: 8,
      }).then((res) => {
        if (res.payload.success) {
          let tmp = this.state.footerProducts;
          tmp.push(res.payload.data.products);
          this.setState({
            footerProducts: tmp, rowcount: res.payload.data.count, start: this.state.start + 8, allCount: this.state.allCount + res.payload.data.products.length,
          });
        }
      });
    }
  }


  renderMainBanner = () => {
    try {
      const { packagebanner, menuPackage } = this.props;

      return (
        <PageBanner
          title={menuPackage.menunm}
          subtitle={menuPackage.subtitle}
          banners={packagebanner.length === 0 ? [] : packagebanner.header}
          bgColor="rgb(255, 153, 204)"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const { widgetAll, packageAll } = this.props;
      const { headerProducts } = this.state;
      return (
        <div className="section package">
          <div className="container pad10">
            {
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === "package").type}
                items={headerProducts}
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
  };

  renderSubBanner = () => {
    try {
      const { packagebanner } = this.props;

      return (
        <Banner data={packagebanner.length === 0 ? [] : packagebanner.footer} />
      );
    } catch (error) {
      return console.log(error);
    }
  };


  renderFooterProduct = () => {
    try {
      const { widgetAll } = this.props;
      console.log('widgetAll: ', widgetAll);
      const { footerProducts, allCount } = this.state;
      return (
        <div className="section">
          <div className="container pad10">
            <InfiniteScroll
              dataLength={this.state.footerProducts.length}
              next={this.getData}
              hasMore={this.state.rowcount !== this.state.allCount}
              loader={<Spin />}
            >
              {footerProducts.map((item, i) => (
                <CardList
                  key={i}
                  cardListType={CARD_LIST_TYPES.horizontal}
                  seq={widgetAll.find(i => i.slug === "package").type}
                  items={item}
                  {...this.props}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
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

export default Discount;
