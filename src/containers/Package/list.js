/* eslint-disable no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
import { BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

let ITEM_HEIGHT = 380;
let cardType = 2;
let start = 0;
let end = 0;
class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      headerProducts: [],
      rowCount: 1,
      count: 0,
      loading: false,
      finish: false,
    };
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
      return (
        <div className="section package">
          <div className="container pad10">
            {
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === "package").type}
                items={packageAll.slice(0, 8)}
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

  // data nemeh heseg
  loadMoreRows = async (key) => {
    try {
      if (this.props.packageFetching === false && this.state.products.length < this.state.rowCount && this.state.loading === false) {
        this.setState({ loading: true });
        let result = await this.props.getPackage({
          order: "date_desc",
          start: this.state.count,
          rowcnt: 20,
        });
        if (result.payload.success) {
          let tmp = this.state.products;
          this.setState({
            products: tmp.concat(result.payload.data.products), count: this.state.count + 20, rowCount: result.payload.data.count, loading: false,
          });
        }
      }
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  isRowLoaded = (index, width) => {
    const { products } = this.state;
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width, cardType);
    const allItemsLoaded =
      this.generateIndexesForRow(
        index,
        maxItemsPerRow,
        products.length,
      ).length > 0;
    return !true || allItemsLoaded;
  }

  getMaxItemsAmountPerRow = (width, type) => {
    if (width > 1100) {
      if (type === 1) {
        return Math.max(Math.floor(width / 207.99), 1);
      }
      return Math.max(Math.floor(width / 353.33), 1);
    }
    if (type === 1) {
      return Math.max(Math.floor(width / 160), 1);
    }
    return Math.max(Math.floor(width / 391), 1);
  };

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width, cardType);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateIndexesForRow = (rowIndex, maxItemsPerRow, itemsAmount) => {
    const result = [];
    let startIndex = 0;
    startIndex = rowIndex * maxItemsPerRow;
    /* if (maxItemsPerRow === 3 && rowIndex.index === undefined && rowIndex !== 0) {
      startIndex = rowIndex * maxItemsPerRow + 2;
    } else if (maxItemsPerRow === 5 && rowIndex.index === undefined && rowIndex !== 0) {
      startIndex = rowIndex * maxItemsPerRow - 2;
    } */
    if (startIndex > 10) {
      startIndex -= 2;
    }
    for (
      let i = startIndex;
      i < Math.min(startIndex + maxItemsPerRow, itemsAmount);
      i++
    ) {
      result.push(i);
    }
    return result;
  };

  renderFooterProduct = () => {
    try {
      const { packageAll, widgetAll } = this.props;
      return (
        <div className="section">
          <div className="container pad10">
            <AutoSizer disableHeight>
              {({ width }) => {
                const { products } = this.state;
                const rowCount = this.getRowsAmount(
                  width,
                  products.length,
                  true,
                );
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={rowCount}
                    isRowLoaded={index => this.isRowLoaded(index, width)}
                    loadMoreRows={this.loadMoreRows}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller>
                        {({ height, scrollTop }) => (
                          <List
                            autoHeight
                            ref={registerChild}
                            height={height}
                            scrollTop={scrollTop}
                            width={width}
                            rowCount={rowCount}
                            rowHeight={ITEM_HEIGHT}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({ index, style, key }) => {
                              cardType = 1;/* index % 2 === 0 ? 2 : 1; */
                              const { products } = this.state;
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                width,
                                cardType,
                              );
                              const rowItems = this.generateIndexesForRow(
                                index,
                                maxItemsPerRow,
                                products.length,
                              ).map(itemIndex => products[itemIndex]);
                              return (
                                <div style={style} key={key} className="jss148" >
                                  {rowItems.map(itemId => (
                                    <Card
                                      key={itemId.id + key}
                                      shape={cardType}
                                      item={itemId}
                                      {...this.props}
                                    />
                                  ))}
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
            {/*
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === "package").type}
                items={packageAll.products}
                second
                {...this.props}
              /> */}
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
      // return null;
    }
  };

  render() {
    return (
      <div className="top-container">
        {this.renderMainBanner()}
        {/* this.renderHeaderProduct() */}
        {/* this.renderSubBanner() */}
        {this.renderFooterProduct()}
      </div>
    );
  }
}

export default Discount;
