/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React, { PureComponent } from "react";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import { Card, PageBanner, CardList, Banner } from "../../components";
import { CARD_LIST_TYPES, CARD_TYPES, CARD_NUMS_IN_ROW } from "../../utils/Consts";
// import 'react-virtualized/styles.css';

const ITEM_HEIGHT = 340;

const RowItem = React.memo(function RowItem({ item, LoginModal, addWishList }) {
  return <Card shape={1} item={item} LoginModal={LoginModal} addWishList={addWishList} />;
});

class Bookmarks extends PureComponent {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      products: props.products,
      fetch: false,
    };
  }


  // tuhain mor load hiigdsen eseh
  isRowLoaded = ({ index }) => index < this.state.products.length;

  // data nemeh heseg
  loadMoreRows = (key) => {
    if (!this.props.isFetching) {
      this.props.getNewProduct({ start: this.props.count });
    }
  }

  noRowsRenderer = () => (
    <div>
      No data
    </div>
  );

  getMaxItemsAmountPerRow = (width) => {
    if (width > 1100) {
      return Math.max(Math.floor(width / 207.99), 1);
    }
    return Math.max(Math.floor(width / 160), 1);
  }

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  }

  generateIndexesForRow = (rowIndex, maxItemsPerRow, itemsAmount) => {
    const result = [];
    const startIndex = rowIndex * maxItemsPerRow;
    for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
      result.push(i);
    }
    return result;
  }

  renderMainBanner = () => {
    try {
      const { pagebanner } = this.props;

      return (
        <PageBanner
          title={'Шинэ'}
          subtitle={'Манай дэлгүүрээр зарагдаж байгаа шинэ бараанууд'}
          banners={pagebanner}
          bgColor="#bbdefb"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      const cardTypes = seq.split(",");
      const { newproduct } = this.props;

      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);
      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              cartListType={CARD_LIST_TYPES.horizontal}
              seq={seq}
              {...this.props}
              items={newproduct.slice(0, cardsLength)}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderSubBanner = () => {
    try {
      const { pagebanner } = this.props;
      return <Banner data={pagebanner} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      return (
        <div className="section">
          <div className="container pad10">
            <AutoSizer disableHeight>
              {({ width }) => {
                const { newproduct } = this.props;
                const rowCount = this.getRowsAmount(width, newproduct.length, true);
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => {
                      const { newproduct } = this.props;
                      const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                      const allItemsLoaded = this.generateIndexesForRow(index, maxItemsPerRow, newproduct.length).length > 0;

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
                            rowCount={rowCount}
                            rowHeight={ITEM_HEIGHT}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({ index, style, key }) => {
                              const { newproduct } = this.props;
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                              const rowItems = this.generateIndexesForRow(index, maxItemsPerRow, newproduct.length).map(itemIndex => newproduct[itemIndex]);
                              return (
                                <div style={style} key={key} className="jss148">
                                  {rowItems.map(itemId => (
                                    <RowItem key={itemId.cd} item={itemId} LoginModal={this.props.LoginModal} addWishList={this.props.addWishList} />
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
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div className="top-container">
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
      </div>
    );
  }
}

export default Bookmarks;

