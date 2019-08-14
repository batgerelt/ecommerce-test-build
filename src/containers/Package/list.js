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
      rowCount: 0,
      count: 10,
      loading: false,
      finish: false,
    };
  }

  componentWillMount() {
    /*  this.props.getPackage({
       order: "date_desc",
       start: 0,
       rowcnt: 10,
     }).then((res) => {
       if (res.payload.success) {
         this.setState({ headerProducts: res.payload.data.products, rowCount: res.payload.data.count });
       }
     }); */
  }

  renderMainBanner = () => {
    try {
      const { packagebanner, menuPackage } = this.props;

      return (
        <PageBanner
          title={menuPackage.menunm}
          subtitle={menuPackage.subtitle}
          banners={packagebanner.length === 0 ? [] : packagebanner.header}
          bgColor="#8CBD3F"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const { widgetAll } = this.props;
      return (
        <div className="section package">
          <div className="container pad10">
            {
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === "package").type}
                items={this.state.headerProducts}
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
      const {
        packageScroll, packageRowCount,
      } = this.props;
      if (!this.props.packageFetching && packageScroll.length + this.state.headerProducts.length < packageRowCount) {
        this.props.getPackageScroll({
          order: "date_desc",
          start: this.props.packageCount,
          rowcnt: 20,
        });
      }
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  isRowLoaded = (index, width) => {
    const { packageScroll } = this.props;
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width, cardType);
    const allItemsLoaded =
      this.generateIndexesForRow(
        index,
        maxItemsPerRow,
        packageScroll.length,
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
      const { packageScroll, widgetAll } = this.props;
      console.log(packageScroll);
      return (
        <div className="section">
          <div className="container pad10">
            <AutoSizer disableHeight>
              {({ width }) => {
                const { packageScroll } = this.props;
                const rowCount = this.getRowsAmount(
                  width,
                  packageScroll.length,
                  this.props.packageScroll.length < this.props.packageRowCount,
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
                              const { packageScroll } = this.props;
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                width,
                                cardType,
                              );
                              const rowItems = this.generateIndexesForRow(
                                index,
                                maxItemsPerRow,
                                packageScroll.length,
                              ).map(itemIndex => packageScroll[itemIndex]);
                              return (
                                <div style={style} key={key} className="jss148">
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
      <div className="top-container top-container-responsive">
        {this.renderMainBanner()}
        {/* this.renderHeaderProduct() */}
        {/* this.renderSubBanner() */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default Discount;
