/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React, { PureComponent } from "react";
import { injectIntl } from 'react-intl';
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
      fetch: false,
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
      orderColumn: 'createddate_desc',
      highlight: false,
      count: 10,
      newbanner: [],
    };
  }

  componentWillMount() {
    this.props.searchProduct({ body: { ...this.state, rowCount: 10 } }).then((res) => {
      if (res.payload.success) {
        this.setState({ headerProducts: res.payload.data.hits.hits });
      }
    });
  }

  // data nemeh heseg
  loadMoreRows = () => {
    try {
      this.props.searchProduct({ body: { ...this.state } }).then((res) => {
        if (res.payload.success) {
          this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), rowCount: this.state.rowCount + 20 });
        }
      });
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

  componentDidUpdate(prevProps) {
    if (this.props.newbanner.length !== prevProps.newbanner.length) {
      const selected = this.props.newbanner.footer[Math.floor(Math.random() * this.props.newbanner.footer.length)];
      this.setState({ newbanner: selected });
    }
  }

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
      const {
        newbanner, menuNew, pagebanner, intl,
      } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en}
          subtitle={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en}
          banners={newbanner.length === 0 ? [] : newbanner.header}
          bgColor="#00A1E4"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  generateItemHeight = (width) => {
    if (width >= 700 && width < 960 || width > 1000) {
      return 365;
    }
    if (width < 400) {
      return 340;
    }
    return 400;
  }

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      const { headerProducts } = this.state;
      const data = [];
      headerProducts.map(i => data.push(i._source));
      return (
        <div style={{ paddingTop: '10px' }}>
          <div className="container pad10">
            <CardList
              elastic
              cardListType={CARD_LIST_TYPES.horizontal}
              seq={seq}
              {...this.props}
              items={data}
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
      const { newbanner } = this.state;
      return <Banner data={newbanner} />;
    } catch (error) {
      return console.log(error);
    }
  };

  getBannerHeight = () => {
    if (document.getElementsByClassName('banner-container')[0].clientHeight !== undefined) {
      return document.getElementsByClassName('banner-container')[0].clientHeight;
    }
    return 0;
  }

  renderFooterProduct = () => {
    try {
      const { products } = this.state;
      return (
        <div className="section">
          <div className="container pad10">
            <div className="row row10">
              <AutoSizer disableHeight>
                {({ width }) => {
                  const rowCount = this.getRowsAmount(
                    width,
                    products.length,
                    true,
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
                                tmp.top = topH - this.generateItemHeight(width) * 2 - 10;
                                tmp.height = style.height;
                                tmp.left = style.left;
                                tmp.width = style.width;
                                tmp.position = style.position;
                                return (
                                  <div style={tmp} key={key} className="jss148">
                                    {
                                      rowItems.map(itemId => (
                                        <Card
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
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Bookmarks);
