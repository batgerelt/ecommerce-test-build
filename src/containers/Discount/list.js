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
import { Card, CardList, Banner, PageBanner } from "../../components";
import {
  CARD_TYPES,
  CARD_LIST_TYPES,
  CARD_NUMS_IN_ROW,
} from "../../utils/Consts";
import { parseTwoDigitYear } from "moment";
import windowSize from 'react-window-size';

const ITEM_HEIGHT = 340;
const RowItem = React.memo(function RowItem({ item, ...props }) {
  return (
    <Card
      isDiscount
      shape={CARD_TYPES.slim}
      item={item}
      {...props}
    />
  );
});
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
      rowCount: 10,
      orderColumn: 'updateddate_desc',
      highlight: false,
    };
  }

  componentWillMount() {
    this.props.searchProduct({ body: { ...this.state } }).then((res) => {
      if (res.payload.success && res.payload.data) {
        this.setState({
          headerProducts: res.payload.data.hits.hits,
          rowCount: 20,
          startsWith: 10,
          total: res.payload.data.hits.total.value,
        });
      }
    });
  }

  loadMoreRows = () => {
    try {
      if (this.state.startsWith >= 10) {
        setTimeout(() => {
          this.props.searchProduct({ body: { ...this.state } }).then((res) => {
            if (res.payload.success) {
              this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), startsWith: this.state.startsWith + 20, total: res.payload.data.hits.total.value });
            }
          });
        }, 1000);
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => null;

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

  renderFooterProduct = () => {
    try {
      const { products } = this.state;
      return (
        <div className="container pad10 discount-list">
          <div className="row row10">
            <AutoSizer disableHeight>
              {({ width }) => {
                const rowCount = this.getRowsAmount(
                  width,
                  products.length,
                  this.state.headerProducts.length + products.length !== this.state.total,
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
                              tmp.top = topH;
                              tmp.height = style.height;
                              tmp.left = style.left;
                              tmp.width = style.width;
                              tmp.position = style.position;
                              return (
                                <div style={style} key={key} className="jss148">
                                  {
                                    rowItems.map(itemId => (
                                      <Card
                                        isDiscount
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
      <div className="top-container top-container-responsive">
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.state.startsWith >= 10 ? this.renderFooterProduct() : null}
        <BackTop />
      </div>
    );
  }
}

export default windowSize(injectIntl(React.memo(Discount)));
