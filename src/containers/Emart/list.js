/* eslint-disable no-else-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable brace-style */
/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Spin, Select, BackTop, Tree, Icon } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import windowSize from 'react-window-size';
import { SearchNotFound } from "../";
import { Card, Loader, SearchFilterSet } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";
import styles from "./style.less";

let screenWidth = 0;
let searchid = null;

class CategoryInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      catid: 0,
      isListViewOn: false,
      loading: false,
      minPrice: 0,
      maxPrice: 0,
      sort: "updateddate_desc",
      showMobilePanel: false,
      ITEM_HEIGHT: 284.98,
      shapeType: 2,
      colors: [],
      brands: [],
      attributes: [],
      count: 0,
      selectedCat: null,
      aggregations: [],
      ismore: false,
      expanded: [],
      isMobilePanel: false,
    };
  }

  componentWillMount() {
    this.getData();
  }

  handleChangeOrder = (e) => {
    const { isLoggedIn, data } = this.props;
    this.setState({ loading: !this.state.loading, sort: e });
    const params = {
      catId: this.state.catid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  };

  handleViewChange = () => {
    // this.props.resetSearch();

    if (this.state.isListViewOn) {
      this.setState({ shapeType: 2, isListViewOn: !this.state.isListViewOn });
    } else {
      this.setState({ shapeType: 4, isListViewOn: !this.state.isListViewOn });
    }
  };

  handleChangePrice = (e) => {
    const { isLoggedIn, data } = this.props;
    this.setState({ loading: !this.state.loading, minPrice: e[0], maxPrice: e[1] });
    const params = {
      catId: this.state.catid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: e[0],
      maxPrice: e[1],
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  };

  handleChangeColor = (e) => {
    const { isLoggedIn, data } = this.props;
    const { colors } = this.state;
    if (e.target.checked) { colors.push(e.target.value); }
    else { colors.map((i, index) => (i === e.target.value ? colors.splice(index, 1) : null)); }
    this.setState({ loading: !this.state.loading, colors });

    const params = {
      catId: this.state.catid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: this.state.attributes.join(','),
      color: colors.join(','),
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  }

  handleChangeBrand = (e, brand) => {
    const { isLoggedIn, data } = this.props;
    const { brands } = this.state;
    if (e.target.checked) { brands.push(brand); }
    else { brands.map((i, index) => (i === brand ? brands.splice(index, 1) : null)); }
    this.setState({ loading: !this.state.loading, brands });

    const params = {
      catId: this.state.catid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  }

  handleChangeAttribute = (e, value, attribute) => {
    const { isLoggedIn, data } = this.props;
    const { attributes } = this.state;
    if (e.target.checked) { attributes.push(`${attribute};${value}`); }
    else { attributes.map((i, index) => (i === `${attribute};${value.toString()}` ? attributes.splice(index, 1) : null)); }
    this.setState({ loading: !this.state.loading, attributes });

    const params = {
      catId: this.state.catid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  };

  handleClickCategory = (cat) => {
    const { isLoggedIn, data } = this.props;
    this.setState({ loading: !this.state.loading });
    this.FilterSet.resetField();

    const params = {
      catId: cat[0],
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: "",
      color: "",
      brand: this.state.brands.length === 0 ? "emart" : this.state.brands.join(','),
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success) {
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
          ggregations: res.payload.data,
          catid: cat[0],
        });
      }
    });
  }

  renderCategoryList = () => {
    try {
      const { categoryall } = this.props;
      const { categories } = this.state;
      const lang = localStorage.getItem('lang');

      if (categories.buckets.length !== 0) {
        return (
          <Tree.DirectoryTree
            switcherIcon={<Icon type="down" />}
            onSelect={this.handleClickCategory}
            showIcon={false}
          // expandedKeys={this.state.expandedCategory}
          // defaultExpandAll={false}
          // defaultExpandAll
          >
            {categories.buckets.map(one => (
              <Tree.TreeNode
                title={lang === "mn" ? categoryall.find(i => i.id === one.key).name : categoryall.find(i => i.id === one.key).nameen}
                key={one.key}
              >
                {one.buckets.buckets &&
                  one.buckets.buckets.map((two) => {
                    if (two.key !== 0) {
                      return (
                        <Tree.TreeNode
                          title={lang === "mn" ? categoryall.find(i => i.id === two.key).name : categoryall.find(i => i.id === two.key).nameen}
                          key={two.key}
                        >
                          {
                            two.buckets !== undefined && two.buckets.buckets !== undefined ?
                              two.buckets.buckets.map(three => (
                                three.key === 0 ? null :
                                  <Tree.TreeNode
                                    title={
                                      lang === "mn" ? categoryall.find(i => i.id === three.key).name : categoryall.find(i => i.id === three.key).nameen
                                    }
                                    key={three.key}
                                  />
                              )) : null
                          }
                        </Tree.TreeNode>
                      );
                    }
                    return null;
                  })}
              </Tree.TreeNode>
            ))}
          </Tree.DirectoryTree>
        );
      }

      return (
        <div className="block">
          <FormattedMessage id="search.filter.filter.noCategory" />
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  showMobilePanel = () =>
    this.setState({ isMobilePanel: !this.state.isMobilePanel });

renderLeftPanel = () => {
  try {
    const leftPanel = `left-panel${this.state.isMobilePanel ? " show" : ""}`;

    return (
      <div
        className="col-lg-3 col-md-4 pad10"
        ref={(node) => {
          this.container = node;
        }}
      >
        {/* <Affix offsetTop={150} style={{ width: '100%' }} > */}
        <div
          className={`left-panel-container ${
            this.state.isMobilePanel ? "show" : null
          }`}
          onClick={this.showMobilePanel}
        >
          <div className={leftPanel}>
            <button
              className="button buttonBlack filter-cross"
              onClick={this.showMobilePanel}
            >
              <img
                src={crossImage}
                alt="cross"
                height="25px"
                aria-hidden="true"
              />
            </button>
            <h5 className="title">
              <strong>
                <FormattedMessage id="search.filter.title" />
              </strong>
            </h5>
            <p className="title">
              <span>
                <FormattedMessage id="search.filter.category.title" />
              </span>
            </p>
            <div className="accordion" id="accordionExample">
              <div
                id="collapseOne"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {this.renderCategoryList()}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="title">
                <strong>
                  <FormattedMessage id="search.filter.filter.title" />
                </strong>
              </h5>
              <div className="left-filter">
                <SearchFilterSet
                  onRef={ref => (this.FilterSet = ref)}
                  {...this.props}
                  {...this}
                  data={this.state.aggregations}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </Affix> */}
      </div>
    );
  } catch (error) {
    // return console.log(error);
    return null;
  }
};

  renderFilteredList = () => {
    try {
      const { intl, searchKeyWordResponse } = this.props;

      return (
        <div className="col-lg-9 col-md-8 pad10">
          <div className="list-filter pad10">
            <div className="row row10">
              <div className="col-lg-6 col-md-6 pad10">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }}>{searchKeyWordResponse.hits.total.value}</strong>
                    <FormattedMessage id="search.searchResult.label.found" />
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 pad10">
                <form className="flex-this end">
                  <div className="text-right d-block d-md-none">
                    <a
                      className="btn btn-gray btn-filter"
                      onClick={this.showMobilePanel}
                    >
                      <i className="fa fa-filter" aria-hidden="true" />
                      <span className="text-uppercase">Шүүлтүүр</span>
                    </a>
                  </div>
                  <div className="form-group my-select flex-this pr-1">
                    <Select
                      onChange={this.handleChangeOrder}
                      className="form-control"
                      id="inputState"
                      placeholder={intl.formatMessage({ id: "search.sort.label" })}
                    >
                      <Select.Option value="currentprice_asc">
                        <FormattedMessage id="search.sort.values.priceDesc" />
                      </Select.Option>
                      <Select.Option value="currentprice_desc">
                        <FormattedMessage id="search.sort.values.priceAsc" />
                      </Select.Option>
                    </Select>
                  </div>
                  <div className="form-group flex-this pl-2">
                    <div
                      className={this.state.isListViewOn ? "btn active p-1" : "btn p-1"}
                      onClick={this.handleViewChange}
                    >
                      <i className="fa fa-th-list" aria-hidden="true" />
                    </div>
                    <div
                      className={this.state.isListViewOn ? "btn pr-0" : "btn active pr-0"}
                      onClick={this.handleViewChange}
                    >
                      <i className="fa fa-th" aria-hidden="true" />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className={styles.center}>
            <Spin spinning={this.state.loading} indicator={<Loader />} >{this.renderProducts()}</Spin>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  isRowLoaded = ({ index }) => index < this.state.products.length;

  noRowsRenderer = () => null

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateItemHeight = (width) => {
    let tmp;
    const windowWidth = this.props.windowWidth;
    const isList = this.state.isListViewOn;

    if (windowWidth < 576) {
      tmp = 335;
    } else if (windowWidth < 768) {
      tmp = 240;
    } else if (windowWidth < 992) {
      tmp = isList ? 120 : 240;
    } else if (windowWidth < 1200) {
      tmp = isList ? 120 : 275;
    } else {
      tmp = isList ? 120 : 305;
    }
    return tmp;
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

  getMaxItemsAmountPerRow = (width) => {
    const windowWidth = this.props.windowWidth;
    const isList = this.state.isListViewOn;

    if (isList) {
      return 1;
    }

    if (windowWidth < 576) {
      return 1;
    } else if (windowWidth < 768) {
      return 3;
    } else if (windowWidth < 992) {
      return 3;
    } else if (windowWidth < 1200) {
      return 3;
    } else {
      return 3;
    }
  };

  loadMoreRows = () => {
    try {
      const { searchKeyWordResponse } = this.props;

      if (this.state.products.length < searchKeyWordResponse.hits.total.value && !this.state.loading) {
        const { isLoggedIn, data } = this.props;
        const params = {
          catId: this.state.catid,
          custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
          value: '',
          attribute: this.state.attributes.join(','),
          color: this.state.colors.join(','),
          brand: "emart",
          promotion: "",
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          startsWith: this.state.count,
          rowCount: 20,
          orderColumn: this.state.sort,
          highlight: false,
        };

        this.props.searchProduct({ body: { ...params } }).then((res) => {
          if (res.payload.success) {
            this.setState({ products: this.state.products.concat(res.payload.data.hits.hits), count: this.state.count + 20 });
          }
        });
      }

      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  renderProducts = () => {
    try {
      const { products, isListViewOn } = this.state;
      if (products.length !== 0) {
        return (
          <AutoSizer disableHeight>
            {({ width }) => {
              const rowCount = this.getRowsAmount(width, products.length, this.props.searchKeyWordResponse.hits.total.value !== products.length);
              return (
                <InfiniteLoader
                  ref={this.infiniteLoaderRef}
                  rowCount={rowCount}
                  isRowLoaded={({ index }) => {
                    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
                    const allItemsLoaded = this.generateIndexesForRow(
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
                            return (
                              <div style={style} key={key} className={`jss148 ${this.state.isListViewOn ? 'pl-1' : ''}`}>
                                {rowItems.map((itemId, index) => (
                                  <Card
                                    elastic
                                    list={isListViewOn}
                                    key={index}
                                    shape={this.state.shapeType}
                                    item={itemId}
                                    LoginModal={this.props.LoginModal}
                                    addWishList={this.props.addWishList}
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
        );
      }

      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  getData = () => {
    searchid = this.props.match.params.id;
    this.setState({ loading: !this.state.loading, ismore: !this.state.ismore });
    const { isLoggedIn, data } = this.props;

    const params = {
      catId: searchid,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: "",
      color: "",
      brand: "emart",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };

    this.props.searchProduct({ body: { ...params } }).then((res) => {
      window.scrollTo(0, 0);
      if (res.payload.success && res.payload.data && res.payload.data.hits !== undefined) {
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
          aggregations: res.payload.data,
          categories: res.payload.data.aggregations.categories,
          nodata: res.payload.data.hits.hits.length === 0,
        });
      }
    });
  }

  render() {
    return (
      <div className="top-container">
        <div className="section search-result">
          <div className="container pad10">
            {this.state.nodata ? (
              <SearchNotFound />
            ) : (
                <div className="row row10">
                  {this.renderLeftPanel()}
                  {this.renderFilteredList()}
                </div>
              )}
          </div>
        </div>
        <BackTop />
      </div>
    );
  }
}

export default windowSize(injectIntl(CategoryInfo));
