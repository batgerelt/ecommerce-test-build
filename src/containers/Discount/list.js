/* eslint-disable radix */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React from "react";
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

const ITEM_HEIGHT = 340;
const RowItem = React.memo(function RowItem({ item, ...props }) {
  return (
    <Card
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
      rowCount: 1,
      count: 10,
      loading: false,
      discountbanner: [],
    };
  }

  componentWillMount() {
    this.props.getDiscountProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 10,
      order: `price_asc`,
    }).then((res) => {
      if (res.payload.success) {
        this.setState({ headerProducts: res.payload.data.product });
      }
    });
  }

  // data nemeh heseg this.state.products.length < searchKeyWordResponse.hits.total.value
  loadMoreRows = (key) => {
    try {
      if (this.state.products.length + this.state.headerProducts.length < this.state.rowCount) {
        this.props.getDiscountProduct({
          jumcd: '99',
          start: this.state.count,
          rowcnt: 20,
          order: `price_asc`,
        }).then((res) => {
          if (res.payload.success) {
            this.setState({
              products: this.state.products.concat(res.payload.data.product), count: this.state.count + 20, rowCount: res.payload.data.product,
            });
          }
        });
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  getMaxItemsAmountPerRow = (width) => {
    if (width > 1100) {
      return Math.max(Math.floor(width / 207.99), 1);
    }
    return Math.max(Math.floor(width / 160), 1);
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
      const { discountbanner, menuDiscount } = this.props;

      return (
        <PageBanner
          title={menuDiscount.menunm}
          subtitle={menuDiscount.subtitle}
          banners={discountbanner.length === 0 ? [] : discountbanner.header}
          bgColor="#EF3340"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      const { headerProducts } = this.state;
      return (
        <div style={{ paddingTop: '10px' }}>
          <div className="container pad10">
            <CardList
              cardListType={CARD_LIST_TYPES.horizontal}
              seq={seq}
              items={headerProducts}
              {...this.props}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.discountbanner.length !== prevProps.discountbanner.length) {
      const selected = this.props.discountbanner.footer[Math.floor(Math.random() * this.props.discountbanner.footer.length)];
      this.setState({ discountbanner: selected });
    }
  }

  renderSubBanner = () => {
    try {
      const { discountbanner } = this.state;
      return (
        <Banner
          data={discountbanner}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  generateItemHeight = (width) => {
    if (width >= 700 && width < 960 || width > 1000) {
      return 340;
    }
    if (width < 400) {
      return 340;
    }
    return 400;
  }

  renderFooterProduct = () => {
    try {
      return (
        <div className="section">
          <div className="container pad10">
            <div className="row row10">
              <AutoSizer disableHeight>
                {({ width }) => {
                  const rowCount = this.getRowsAmount(
                    width,
                    this.state.products.length,
                    this.state.products.length !== this.state.rowCount,
                  );
                  return (
                    <InfiniteLoader
                      ref={this.infiniteLoaderRef}
                      rowCount={rowCount === 1 ? rowCount : rowCount - 1}
                      isRowLoaded={({ index }) => {
                        const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                          width,
                        );
                        const allItemsLoaded =
                          this.generateIndexesForRow(
                            index,
                            maxItemsPerRow,
                            this.state.products.length,
                          ).length > 0;

                        return !true || allItemsLoaded;
                      }}
                      loadMoreRows={this.loadMoreRows}
                    >
                      {({ onRowsRendered, registerChild }) => (
                        <WindowScroller>
                          {({ height, scrollTop }) => (
                            <List
                              autoHeight
                              ref={registerChild}
                              height={340}
                              scrollTop={scrollTop}
                              width={width}
                              rowCount={rowCount === 1 ? rowCount : rowCount - 1}
                              rowHeight={this.generateItemHeight(width)}
                              onRowsRendered={onRowsRendered}
                              rowRenderer={({ index, style, key }) => {
                                const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                  width,
                                );
                                const rowItems = this.generateIndexesForRow(
                                  index,
                                  maxItemsPerRow,
                                  this.state.products.length,
                                ).map(itemIndex => this.state.products[itemIndex]);
                                if (rowItems.length !== 0) {
                                  return (
                                    <div style={style} key={key} className="jss148">
                                      {
                                        rowItems.map(itemId => (
                                          <Card
                                            key={itemId.cd + key}
                                            shape={CARD_TYPES.slim}
                                            item={itemId}
                                            {...this.props}
                                          />
                                        ))
                                      }
                                    </div>
                                  );
                                }
                                return null;
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
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default React.memo(Discount);
