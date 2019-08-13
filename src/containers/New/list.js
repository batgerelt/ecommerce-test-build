/* eslint-disable arrow-body-style */
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

let ITEM_HEIGHT = 340;

const RowItem = React.memo(function RowItem({ item, LoginModal, addWishList }) {
  return (
    <Card
      shape={1}
      item={item}
      LoginModal={LoginModal}
      addWishList={addWishList}
      {...this.props}
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
      rowCount: 20,
      orderColumn: '',
      highlight: false,
    };
  }

  componentWillMount() {
    this.props.searchProduct({ body: { ...this.state } }).then((res) => {
      if (res.payload.success) {
        this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), rowCount: this.state.rowCount + 20 });
      }
    });
  }

  // data nemeh heseg
  loadMoreRows = (key) => {
    try {
      if (!this.props.isFetching && this.state.products.length < this.props.newproduct.count) {
        this.props.searchProduct({ body: { ...this.state } }).then((res) => {
          if (res.payload.success) {
            this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), rowCount: this.state.rowCount + 20 });
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
      const { newbanner, menuNew } = this.props;
      return (
        <PageBanner
          title={menuNew.menunm}
          subtitle={menuNew.subtitle}
          banners={newbanner.length === 0 ? [] : newbanner.header}
          bgColor="#00A1E4"
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
                          {({ height, scrollTop }) => {
                            return (
                              <List
                                autoHeight
                                ref={registerChild}
                                height={height}
                                scrollTop={scrollTop}
                                width={width}
                                rowCount={rowCount}
                                rowHeight={this.generateItemHeight(width)}
                                onRowsRendered={onRowsRendered}
                                rowRenderer={({
                                  index, isScrolling, key, style,
                                }) => {
                                  console.log(isScrolling);
                                  const { products } = this.state;
                                  const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                                    width,
                                  );
                                  const rowItems = this.generateIndexesForRow(
                                    index,
                                    maxItemsPerRow,
                                    products.length,
                                  ).map(itemIndex => products[itemIndex]._source);
                                  return (
                                    <div style={style} key={key} className="jss148" >
                                      {
                                        isScrolling ?
                                          ""
                                          :
                                          rowItems.map(itemId => (
                                            <Card
                                              elastic
                                              key={itemId.cd}
                                              shape={1}
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
                            );
                          }}
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
        {/* this.renderHeaderProduct() */}
        {/* this.renderSubBanner() */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default Bookmarks;
