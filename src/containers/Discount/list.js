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
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { SkeltonCard, Banner, PageBanner, FiveCard, Loader } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5;
let skel;

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
      orderColumn: 'catid_desc',
      highlight: false,
    };
  }

  loadMoreRows = () => {
    console.log('loadMoreRows: ');
    this.props.getDiscountProducts({ body: { ...this.state, startsWith: this.props.discountproductCount } });
  }

  renderMainBanner = () => {
    try {
      const { banner, menuDiscount, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuDiscount[0].menunm : menuDiscount[0].menunm_en}
          subtitle={intl.locale === "mn" ? menuDiscount[0].subtitle : menuDiscount[0].subtitle_en}
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
                                { isFetchingDiscount && <SkeltonCard /> }
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
          {this.renderMainBanner()}
          {/* {this.renderHeaderProduct()} */}
          {/* {this.renderSubBanner()} */}
          {this.renderFooterProduct()}
          <BackTop />
        </div>
      </Spin>
    );
  }
}

export default injectIntl(Discount);
