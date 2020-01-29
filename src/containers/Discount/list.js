/* eslint-disable no-else-return */
/* eslint-disable radix */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React from "react";
import { injectIntl } from 'react-intl';
import { BackTop, Spin } from "antd";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import Helmet from "react-helmet";
import { SkeltonCard, Banner, PageBanner, FiveCard, Loader } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5;

class Discount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      headerProducts: [],
      loading: false,
      total: 0,

      catId: 0,
      custId: 0,
      value: '',
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      module: 'discount',
      startsWith: 0,
      rowCount: 20,
      orderColumn: 'catid_desc,rate_desc',
      highlight: false,
    };
  }

  renderHelmet = () => {
    const { menuDiscount, intl } = this.props;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>{intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en}</title>
        <meta name="description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
        <meta name="keywords" content="emartmall,emart,ecommerce,shopping,e-mart,имарт,хямдрал,discount" />
        <meta name="url" content={window.location.href} />

        {/* FACEBOOK SHARE META TAGS */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en} />
        <meta property="og:description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://api.emartmall.mn/Resource/emartmall.png" />

        {/* TWITTER SHARE META TAGS */}
        <meta name="twitter:site" content={window.location.href} />
        <meta name="twitter:title" content={intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en} />
        <meta name="twitter:description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
      </Helmet>
    );
  }

  loadMoreRows = () => this.props.getDiscountProducts({ body: { ...this.state, startsWith: this.props.discountproductCount } });

  renderMainBanner = () => {
    try {
      const { banner, menuDiscount, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en}
          subtitle={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#EF3340"
        />
      );
    } catch (error) {
      return null;
    }
  };

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      return null;
    }
  };

  // нэг мөр хоосон харагдаад байсан тул skelton харуулав
  // skelton нь нэг мөр харагдана mobile(2 card) tablet(4 card) desktop(5 card) etc...
  renderSkeltonCard = () => {
    let result = [];
    for (let i = 0; i < itemsInRow; i++) { result.push(<SkeltonCard key={i} />); }
    return result;
  }

  generateItemHeight = () => {
    if (window.innerWidth < 576) {
      return 320;
    } else if (window.innerWidth < 768) {
      return 405;
    } else if (window.innerWidth < 992) {
      return 300;
    } else if (window.innerWidth < 1200) {
      return 375;
    } else {
      return 350;
    }
  }

  getRowsAmount = (itemsAmount, hasMore) => Math.ceil(itemsAmount / itemsInRow) + (hasMore ? 1 : 0);

  noRowsRenderer = () => null;

  renderFooterProduct = () => {
    try {
      const { discountproducts, discountproductTotal, isFetchingDiscount } = this.props;
      return (
        <div className="container pad10 discount-list">
          <div className="row row10">
            <AutoSizer disableHeight >
              {({ width }) => {
                const rowCount = Math.ceil(discountproducts.length / itemsInRow + (discountproductTotal === 0 ? 1 : discountproductTotal !== discountproducts.length ? 1 : 0));
                return (
                  <InfiniteLoader
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => !!discountproducts[index * itemsInRow] || false}
                    loadMoreRows={this.loadMoreRows}
                    threshold={1}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller className="WindowScroller">
                        {({ height, scrollTop }) => (
                          <List
                            style={{ outline: "none" }}
                            autoHeight
                            ref={registerChild}
                            height={height}
                            width={width}
                            scrollTop={scrollTop}
                            rowCount={rowCount}
                            rowHeight={this.generateItemHeight}
                            noRowsRenderer={this.noRowsRenderer}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => (
                              <div style={style} key={key} className="jss148">
                                {
                                  discountproducts.slice(index * itemsInRow, (index * itemsInRow) + itemsInRow).map(i => (
                                    <FiveCard
                                      elastic
                                      isVisible={isVisible}
                                      key={i.skucd}
                                      shape={CARD_TYPES.slim}
                                      item={i}
                                      {...this.props}
                                    />
                                  ))
                                }
                                {isFetchingDiscount && <React.Fragment>{this.renderSkeltonCard()}</React.Fragment> }
                              </div>
                              )}
                          />
                        )}
                      </WindowScroller>
                    )}
                  </InfiniteLoader>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return (
      <Spin spinning={this.state.loading} indicator={<Loader />}>
        <div className="top-container top-container-responsive discount-container">
          {this.renderHelmet()}
          {this.renderMainBanner()}
          {/* {this.renderHeaderProduct()} */}
          {/* {this.renderSubBanner()} */}
          {this.renderFooterProduct()}
          <BackTop />
          {/* <EmartMallScroll /> */}
        </div>
      </Spin>
    );
  }
}

export default injectIntl(Discount);
