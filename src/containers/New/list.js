/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import { BackTop } from "antd";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";

import { Card, FiveCard, PageBanner, Banner } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

class Bookmarks extends PureComponent {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      fetch: false,
      headerProducts: [],
      loadingCart: false,

      catId: 0,
      custId: 0,
      value: "",
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      module: "new",
      startsWith: 0,
      rowCount: 10,
      orderColumn: "startnew_desc, endnew_asc, updatedate_desc",
      highlight: false,
      total: 0,
    };
  }

  componentWillMount() {
    this.props.searchProduct({ body: { ...this.state } }).then((res) => {
      // console.log(res.payload.data.hits.total.value);
      if (res.payload.success) {
        this.setState({
          headerProducts: res.payload.data.hits.hits,
          startsWith: 10,
          total: res.payload.data.hits.total.value,
          rowCount: 20,
        });
      }
    });
  }

  loadMoreRows = () => this.props.getNewProducts({ body: { ...this.state, startsWith: this.props.newproductCount } });

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
      const { banner, menuNew, intl } = this.props;
      return (
        menuNew[0] && (
          <PageBanner
            className="newpagetitlebanner"
            title={intl.locale === "mn" ? menuNew[0].menunm : menuNew[0].menunm_en}
            subtitle={intl.locale === "mn" ? menuNew[0].subtitle : menuNew[0].subtitle_en}
            banners={banner.length === 0 ? [] : banner.header}
            bgColor="#00A1E4"
          />
        )
      );
    } catch (error) {
      return console.log(error);
    }
  };

  generateItemHeight = () => {
    let tmp;
    const { windowWidth } = this.props;

    if (windowWidth < 576) {
      tmp = 315;
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
  };

  renderHeaderProduct = () => {
    try {
      const { headerProducts } = this.state;

      return (
        <div className="container pad10" style={{ paddingTop: "20px" }}>
          <div className="row row10">
            {headerProducts.map((item, i) => (
              <Card
                elastic
                key={i}
                shape={CARD_TYPES.slim}
                item={item._source}
                {...this.props}
              />
            ))}
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
      return console.log(error);
    }
  };

  getBannerHeight = () => {
    if (
      document.getElementsByClassName("banner-container")[0].clientHeight !== undefined
    ) {
      return document.getElementsByClassName("banner-container")[0].clientHeight;
    }
    return 0;
  };

  renderFooterProduct = () => {
    try {
      const { newproducts } = this.props;
      return (
        <div className="container pad10 new-list">
          <div className="row row10">
            <AutoSizer disableHeight >
              {({ width }) => {
                const rowCount = this.getRowsAmount(newproducts.length, this.state.total !== newproducts.length + this.state.headerProducts.length);
                return (
                  <InfiniteLoader
                    className="InfiniteLoader"
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => {
                      const maxItemsPerRow = this.getMaxItemsAmountPerRow();
                      const allItemsLoaded = this.generateIndexesForRow(index, maxItemsPerRow, newproducts.length).length > 0;
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
                            scrollTop={window.innerWidth < 767 ? scrollTop : (scrollTop - (this.generateItemHeight() * 2 + 200))}
                            rowCount={rowCount}
                            rowHeight={this.generateItemHeight()}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => {
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                              const rowItems = this.generateIndexesForRow(index, maxItemsPerRow, newproducts.length).map(itemIndex => newproducts[itemIndex]);
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
      <div className="top-container newproduct-container">
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Bookmarks);
