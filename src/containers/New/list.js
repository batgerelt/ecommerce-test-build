/* eslint-disable no-unused-expressions */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
import React, { PureComponent } from "react";
import { InfiniteLoader, WindowScroller, List, AutoSizer, Grid } from "react-virtualized";
import { Card, Loader } from "../../components";
import 'react-virtualized/styles.css';

let start = 20;
class Bookmarks extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      products: props.newproduct,
    };
  }

  // tuhain mor load hiigdsen eseh
  isRowLoaded = ({ index }) => index < this.state.products.length;

  // data nemeh heseg
  loadMoreRows = () => {
    this.props.getNewProduct({ start }).then((res) => {
      this.setState({ products: this.state.products.concat(res.payload.data) });
      start += 20;
    });
  }

  rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style} >
      { !this.isRowLoaded({ index }) ? <Loader /> : <Card type={1} item={this.state.products[index]} /> }
    </div>
  )

  render() {
    return (
      <div className="top-container" ref={ref => this.scrollParentRef = ref}>
        <div className="section">
          <div className="container pad10">
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={this.state.products.length + 1}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, isScrolling, scrollTop }) => (
                    <AutoSizer disableHeight>
                      {({ width }) => (
                        <List
                          autoHeight
                          rowRenderer={this.rowRenderer}
                          columnCount={5}
                          columnWidth={340}
                          rowCount={this.state.products.length}
                          ref={registerChild}
                          height={height}
                          rowHeight={340}
                          width={width}
                          // rowCount={this.state.products.length / 5}
                          onRowsRendered={onRowsRendered}
                          // rowRenderer={this.rowRenderer}
                          isScrolling={isScrolling}
                          scrollTop={scrollTop}
                        />
                      )}
                    </AutoSizer>
                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          </div>
        </div>
      </div>
    );
  }
}

export default Bookmarks;

