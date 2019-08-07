/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
import React from "react";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { BackTop } from "antd";
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";

const ITEM_HEIGHT = 340;
class Recipe extends React.Component {
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

  renderMainBanner = () => {
    try {
      const { recipebanner, menuRecipe } = this.props;

      return (
        <PageBanner
          title={menuRecipe.menunm}
          subtitle={menuRecipe.subtitle}
          banners={recipebanner.length === 0 ? [] : recipebanner.header}
          bgColor="#F2769B"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  // data nemeh heseg
  loadMoreRows = (key) => {
    try {
      if (!this.props.recipeFetching && this.state.products.length < this.state.rowCount && !this.state.loading) {
        this.setState({ loading: true });
        this.props.getRecipe({
          order: "date_desc",
          start: this.state.count,
          rowcnt: 20,
        }).then((res) => {
          if (res.payload.success) {
            this.setState({
              products: this.state.products.concat(res.payload.data.products), count: this.state.count + 20, rowCount: res.payload.data.count, loading: false,
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
      return Math.max(Math.floor(width / 353.33), 1);
    }
    return Math.max(Math.floor(width / 160), 1);
  };

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateIndexesForRow = (rowIndex, maxItemsPerRow, itemsAmount) => {
    const result = [];
    // console.log(this.state.products);
    let startIndex = 0;
    startIndex = rowIndex * maxItemsPerRow;
    for (
      let i = startIndex;
      i < Math.min(startIndex + maxItemsPerRow, itemsAmount);
      i++
    ) {
      result.push(i);
    }
    return result;
  };

  renderHeaderProduct = () => {
    try {
      const { products } = this.state;

      return (
        <div className="section">
          <div className="container pad10">
            {products.length > 6 ?
              (
                <CardList
                  cardListType={CARD_LIST_TYPES.vertical}
                  cardsInCol={2}
                  items={products.slice(0, 6)}
                  {...this.props}
                />
              ) : (
                <CardList
                  cardListType={CARD_LIST_TYPES.horizontal}
                  items={products}
                  {...this.props}
                />
              )}
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      const { recipebanner } = this.props;

      return (
        <Banner data={recipebanner.length === 0 ? [] : recipebanner.footer} />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  /* renderFooterProduct = () => {
    try {
      let { products } = this.state;
      console.log(products);
      if (products.length <= 6) {
        return null;
      }

      products = products.slice(6);

      const iteration = Math.floor(products.length / 6);
      const remainder = products.length % 6;

      return (
        <div className="section">
          <div className="container pad10">
            {remainder > 0 ?
              (
                <div>
                  <CardList
                    cardListType={CARD_LIST_TYPES.vertical}
                    items={products.slice(0, iteration * 6)}
                    {...this.props}
                  />
                  <CardList
                    cardListType={CARD_LIST_TYPES.horizontal}
                    // eslint-disable-next-line no-mixed-operators
                    items={products.slice(iteration * 6)}
                    cardType={CARD_TYPES.wide}
                    showAll
                    {...this.props}
                  />
                </div>
              ) : (
                <CardList
                  cardListType={CARD_LIST_TYPES.vertical}
                  items={products}
                  {...this.props}
                />
              )}
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }; */

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
                  products.length !== this.state.rowCount,
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
                              const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                              const rowItems = this.generateIndexesForRow(
                                index,
                                maxItemsPerRow,
                                products.length,
                              ).map(itemIndex => products[itemIndex]);
                              return (
                                <div style={style} key={key} className="jss148">
                                  {rowItems.map(itemId => (
                                    <Card
                                      key={itemId.recipeid + key}
                                      shape={2}
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
        {/* his.renderHeaderProduct() */}
        {/* this.renderSubBanner() */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default Recipe;
