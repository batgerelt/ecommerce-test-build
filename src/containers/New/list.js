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
import { injectIntl } from 'react-intl';
import { BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { Card, PageBanner, CardList, Banner } from "../../components";
import {
  CARD_LIST_TYPES,
  CARD_TYPES,
  CARD_NUMS_IN_ROW,
} from "../../utils/Consts";
import windowSize from 'react-window-size';
// import 'react-virtualized/styles.css';

const ITEM_HEIGHT = 360;

const RowItem = React.memo(function RowItem({ item, LoginModal, addWishList }) {
  return (
    <Card
      shape={1}
      item={item}
      LoginModal={LoginModal}
      addWishList={addWishList}
    />
  );
});

class Bookmarks extends PureComponent {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      fetch: false,
      headerProducts: [],
      loading: false,

      catId: 0,
      custId: 0,
      value: '',
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      module: 'new',
      startsWith: 0,
      rowCount: 10,
      orderColumn: 'startnew_desc, endnew_asc',
      highlight: false,
      total: 0,
    };
  }

  componentWillMount() {
    this.props.searchProduct({ body: { ...this.state } }).then((res) => {
      if (res.payload.success) {
        this.setState({
          headerProducts: res.payload.data.hits.hits,
          startsWith: 10,
          rowCount: 50,
          total: res.payload.data.hits.total.value,
        });
      }
    });
  }

  // data nemeh heseg
  loadMoreRows = () => {
    try {
      if (!this.props.isFetchingSearch) {
        setTimeout(() => {
          this.props.searchProduct({ body: { ...this.state } }).then((res) => {
            if (res.payload.success) {
              this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), total: res.payload.data.hits.total.value });
            }
          });
        }, 1000);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => null

  isRowLoaded = (index, width) => {
    const { products } = this.state;
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    const allItemsLoaded =
      this.generateIndexesForRow(
        index,
        maxItemsPerRow,
        products.length,
      ).length > 0;
    return !true || allItemsLoaded;
  }

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
        <PageBanner
          title={intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en}
          subtitle={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#00A1E4"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  generateItemHeight = (width) => {
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

  renderHeaderProduct = () => {
    try {
      const { headerProducts } = this.state;

      return (
        <div className="container pad10" style={{ paddingTop: '20px' }}>
          <div className="row row10">
            {
              headerProducts.map((item, i) => (
                <Card
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

  getBannerHeight = () => {
    if (document.getElementsByClassName('banner-container')[0].clientHeight !== undefined) {
      return document.getElementsByClassName('banner-container')[0].clientHeight;
    }
    return 0;
  }

  renderFooterProduct = () => {
    try {
      const { products, startsWith } = this.state;
      return (
        <div className="container pad10 new-list">
          <div className="row row10">
            <AutoSizer disableHeight>
              {({ width }) => {
                const rowCount = this.getRowsAmount(
                  width,
                  products.length,
                  this.state.total !== products.length + this.state.headerProducts.length,
                );
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => {
                      const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                        width,
                      );
                      const allItemsLoaded =
                        this.generateIndexesForRow(
                          index,
                          maxItemsPerRow,
                          products.length,
                        ).length > 0;
                      return !true || allItemsLoaded;
                    }}
                    loadMoreRows={this.loadMoreRows}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller>
                        {({ height, scrollTop }) => (
                          <List
                            style={{ outline: 'none' }}
                            autoHeight
                            ref={registerChild}
                            height={height}
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
                                products.length,
                              ).map(itemIndex => products[itemIndex]._source);
                              let tmp = {};
                              let topH = style.top;
                              tmp.top = topH - this.generateItemHeight(width) * 2 - 10;
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
      <div className="top-container">
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
