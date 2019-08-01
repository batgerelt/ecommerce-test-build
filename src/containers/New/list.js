/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React, { PureComponent } from "react";
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
// import 'react-virtualized/styles.css';

const ITEM_HEIGHT = 340;

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
      headerProducts: [],
      rowCount: 1,
      count: 0,
      loading: false,
    };
  }

  componentWillMount() {
    /* this.props.getNewProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 10,
      order: `price_asc`,
    }).then((res) => {
      if (res.payload.success) {
        this.setState({ headerProducts: res.payload.data.product });
      }
    }); */
  }

  // data nemeh heseg
  loadMoreRows = (key) => {
    try {
      if (!this.props.isFetching && this.state.products.length < this.state.rowCount && !this.state.loading) {
        this.setState({ loading: true });
        this.props.getNewProduct({
          jumcd: '99',
          start: this.state.count,
          rowcnt: 20,
          order: `price_asc`,
        }).then((res) => {
          if (res.payload.success) {
            this.setState({
              products: this.state.products.concat(res.payload.data.product), count: this.state.count + 20, rowCount: res.payload.data.count, loading: false,
            }, () => {
              this.setState({ loading: false });
            });
          }
        });
      }
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

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
      const { newbanner, menuNew, pagebanner } = this.props;
      return (
        <PageBanner
          title={menuNew.menunm}
          subtitle={menuNew.subtitle}
          banners={newbanner.length === 0 ? [] : newbanner.header}
          bgColor="#bbdefb"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      // const cardTypes = seq.split(",");
      const { headerProducts } = this.state;

      /* let cardsLength = 0;
      cardTypes.map(
        i =>
          (cardsLength +=
            parseInt(i) === CARD_TYPES.slim
              ? CARD_NUMS_IN_ROW.slim
              : CARD_NUMS_IN_ROW.wide),
      ); */
      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              cardListType={CARD_LIST_TYPES.horizontal}
              seq={seq}
              {...this.props}
              items={headerProducts}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      const { newbanner } = this.props;
      return <Banner data={newbanner.length === 0 ? [] : newbanner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  };

  renderFooterProduct = () => {
    try {
      return (
        <div className="section">
          <div className="container pad10">
            <div className="row row10">
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
                                const { products } = this.state;
                                const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                  width,
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
                                        key={itemId.cd}
                                        shape={1}
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
      <div className="top-container">
        {this.renderMainBanner()}
        {/* this.renderHeaderProduct() */}
        {/* this.renderSubBanner() */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default Bookmarks;
