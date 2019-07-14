/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
import React, { PureComponent } from "react";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import { Card, Loader } from "../../components";
// import 'react-virtualized/styles.css';

const ITEM_HEIGHT = 340;
const RowItem = React.memo(function RowItem({ item }) {
  return <Card shape={1} item={item} />;
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
    this.props.getNewProduct({ start: this.props.count });
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

  render() {
    return (
      <div className="top-container">
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
                            height={height}
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
                                <div style={style} key={key} className="row marginLeft m-top-1">
                                  {rowItems.map(itemId => (
                                    <RowItem key={itemId.cd} item={itemId} />
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
  }
}

export default Bookmarks;

