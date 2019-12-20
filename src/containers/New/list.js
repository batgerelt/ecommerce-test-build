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
import { BackTop, Spin } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { Card, PageBanner, Banner, Loader } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";
import windowSize from "react-window-size";

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

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  loadMoreRows = () => this.props.getNewProducts({ body: { ...this.state, startsWith: this.props.newproductCount } });

  noRowsRenderer = () => null;

  isRowLoaded = (index, width) => {
    const { newproducts } = this.props;
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    const allItemsLoaded =
      this.generateIndexesForRow(index, maxItemsPerRow, newproducts.length)
        .length > 0;
    return !true || allItemsLoaded;
  };

  getMaxItemsAmountPerRow = (width) => {
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

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
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
            title={
              intl.locale === "mn" ? menuNew[0].menunm : menuNew[0].menunm_en
            }
            subtitle={
              intl.locale === "mn"
                ? menuNew[0].subtitle
                : menuNew[0].subtitle_en
            }
            banners={banner.length === 0 ? [] : banner.header}
            bgColor="#00A1E4"
          />
        )
      );
    } catch (error) {
      return console.log(error);
    }
  };

  generateItemHeight = (width) => {
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
            <AutoSizer disableHeight>
              {({ width }) => {
                const rowCount = this.getRowsAmount(
                  width,
                  newproducts.length,
                  this.state.total !==
                    newproducts.length + this.state.headerProducts.length,
                );
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => {
                      const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                      const allItemsLoaded =
                        this.generateIndexesForRow(
                          index,
                          maxItemsPerRow,
                          newproducts.length,
                        ).length > 0;
                      return !true || allItemsLoaded;
                    }}
                    loadMoreRows={this.loadMoreRows}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller>
                        {({
                          height,
                          scrollTop,
                          isScrolling,
                          onChildScroll,
                        }) => (
                          <List
                            style={{ outline: "none" }}
                            autoHeight
                            ref={registerChild}
                            height={height}
                            isScrolling={isScrolling}
                            scrollTop={scrollTop}
                            width={width}
                            rowCount={rowCount}
                            rowHeight={this.generateItemHeight(width)}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({ index, style, key }) => {
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                width,
                              );
                              const rowItems = this.generateIndexesForRow(
                                index,
                                maxItemsPerRow,
                                newproducts.length,
                              ).map(itemIndex => newproducts[itemIndex]);
                              let tmp = {};
                              let topH = style.top;
                              tmp.top =
                                topH - this.generateItemHeight(width) * 2 - 10;
                              tmp.height = style.height;
                              tmp.left = style.left;
                              tmp.width = style.width;
                              tmp.position = style.position;
                              return (
                                <div style={style} key={key} className="jss148">
                                  {
                                    rowItems.map(itemId => (
                                      <Card
                                        elastic
                                        key={itemId.skucd + key}
                                        shape={CARD_TYPES.slim}
                                        item={itemId}
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
        {this.state.startsWith >= 10 ? this.renderFooterProduct() : null}
        <BackTop />
      </div>
    );
  }
}

export default windowSize(injectIntl(Bookmarks));
