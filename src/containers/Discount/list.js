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
import { BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { Card, Banner, PageBanner, FiveCard } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5; // Нэг мөрөнд карт хэдээр зурагдах
class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
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
    this.props.getDiscountProducts({ body: { ...this.state, startsWith: this.props.discountproductCount } });
  }

  noRowsRenderer = () => null;

  getMaxItemsAmountPerRow = () => {
    const { windowWidth } = this.props;

    if (windowWidth < 576) {
      return 2;
    } else if (windowWidth < 768) {
      return 2;
    } else if (windowWidth < 992) {
      return 4;
    } else if (windowWidth < 1200) {
      return 4;
    } else {
      return 5;
    }
  };

  getRowsAmount = (itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow();
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateIndexesForRow = (rowIndex, maxItemsPerRow, itemsAmount) => {
    const result = [];
    const startIndex = rowIndex * maxItemsPerRow;
    for (
      let i = startIndex;
      i < Math.min(startIndex + maxItemsPerRow, itemsAmount);
      i++
    ) {
      result.push(i);
    }
    return result;
  };

  renderMainBanner = () => {
    try {
      const { banner, menuDiscount, intl } = this.props;
      return menuDiscount[0] && (
        <PageBanner
          title={intl.locale === "mn" ? menuDiscount[0].menunm : menuDiscount[0].menunm_en}
          subtitle={intl.locale === "mn" ? menuDiscount[0].subtitle : menuDiscount[0].subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#EF3340"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const { headerProducts } = this.state;
      const data = [];

      headerProducts.map(i => data.push(i._source));
      return (
        <div className="container pad10" style={{ paddingTop: '20px' }}>
          <div className="row row10">
            {
              headerProducts.map((item, i) => (
                <Card
                  isDiscount
                  elastic
                  key={i}
                  shape={CARD_TYPES.slim}
                  item={item._source}
                  {...this.props}
                />
              ))
            }
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  generateItemHeight = () => {
    let tmp;
    const { windowWidth } = this.props;

    if (windowWidth < 576) {
      tmp = 320;
    } else if (windowWidth < 768) {
      tmp = 405;
    } else if (windowWidth < 992) {
      tmp = 320;
    } else if (windowWidth < 1200) {
      tmp = 375;
    } else {
      tmp = 370;
    }

    return tmp;
  }

  renderFooterProduct = () => {
    try {
      const { discountproducts, discountproductTotal } = this.props;
      return (
        <div className="container pad10 discount-list">
          <div className="row row10">
            <AutoSizer disableHeight >
              {({ width }) => {
                const rowCount = discountproducts.length / itemsInRow + (discountproductTotal !== discountproducts.length ? 1 : 0);
                return (
                  <InfiniteLoader
                    className="InfiniteLoader"
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => {
                      const maxItemsPerRow = this.getMaxItemsAmountPerRow();
                      const allItemsLoaded = this.generateIndexesForRow(index, maxItemsPerRow, discountproducts.length).length > 0;
                      return !true || allItemsLoaded;
                    }}
                    loadMoreRows={this.loadMoreRows}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller className="WindowScroller">
                        {({
                          height,
                          scrollTop,
                          isScrolling,
                        }) => (
                          <List
                            style={{ outline: "none" }}
                            autoHeight
                            ref={registerChild}
                            height={height}
                            isScrolling={isScrolling}
                            width={width}
                            scrollTop={scrollTop}
                            rowCount={rowCount}
                            rowHeight={this.generateItemHeight()}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => {
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                              const rowItems = this.generateIndexesForRow(index, maxItemsPerRow, discountproducts.length).map(itemIndex => discountproducts[itemIndex]);
                              return (
                                <div style={style} key={key} className="jss148">
                                  {
                                    rowItems.map(i => (
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
                                </div>
                              );
                            }}
                            noRowsRenderer={this.noRowsRenderer}
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
      <div className="top-container top-container-responsive discount-container">
        {this.props.menuDiscount === undefined ? null : this.renderMainBanner()}
        {/* {this.renderHeaderProduct()} */}
        {/* {this.renderSubBanner()} */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Discount);
