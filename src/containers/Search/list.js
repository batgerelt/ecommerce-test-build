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
import { Spin, Select, BackTop, Tree, Icon, Affix } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";

import { SearchNotFound } from "../";
import { Card, Loader, SearchFilterSet } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";
import styles from "./style.less";

let screenWidth = 0;
let searchword = null;
let searchtime = null;
let catid = null;

class CategoryInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      catid: 0,
      isListViewOn: false,
      loading: true,
      minPrice: 0,
      maxPrice: 0,
      sort: "",
      isMobilePanel: false,
      ITEM_HEIGHT: 284.98,
      shapeType: 2,
      colors: [],
      brands: [],
      attributes: [],
      count: 0,
      aggregations: [],
      expandedCategory: [],
    };
  }

  componentWillMount() {
    this.getData();
  }

  componentDidMount() {
    this.setState({
      colors: [],
      brands: [],
      attributes: [],
    });
  }

  handleChangeOrder = (e) => {
    const { isLogged, data } = this.props;
    this.setState({ loading: !this.state.loading, sort: e });
    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: this.state.attributes.join(","),
      color: this.state.colors.join(","),
      brand: this.state.brands.join(","),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: e,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
        });
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
    const { isLogged, data } = this.props;
    this.setState({
      loading: !this.state.loading,
      minPrice: e[0],
      maxPrice: e[1],
    });
    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: this.state.attributes.join(","),
      color: this.state.colors.join(","),
      brand: this.state.brands.join(","),
      promotion: "",
      minPrice: e[0],
      maxPrice: e[1],
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
        });
      }
    });
  };

  handleChangeColor = (e) => {
    const { isLogged, data } = this.props;
    const { colors } = this.state;
    if (e.target.checked) {
      colors.push(e.target.value);
    } else {
      colors.map((i, index) =>
        (i === e.target.value ? colors.splice(index, 1) : null),
      );
    }
    this.setState({ loading: !this.state.loading, colors });

    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: this.state.attributes.join(","),
      color: colors.join(","),
      brand: this.state.brands.join(","),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
        });
      }
    });
  };

  handleChangeBrand = (e, brand) => {
    const { isLogged, data } = this.props;
    const { brands } = this.state;
    if (e.target.checked) {
      brands.push(brand);
    } else {
      brands.map((i, index) => (i === brand ? brands.splice(index, 1) : null));
    }
    this.setState({ loading: !this.state.loading });

    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: this.state.attributes.join(","),
      color: this.state.colors.join(","),
      brand: brands.join(","),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
          brands,
        });
      }
    });
  };

  handleChangeAttribute = (e, value, attribute) => {
    this.setState({ loading: !this.state.loading });
    const { isLogged, data } = this.props;
    const { attributes } = this.state;
    // eslint-disable-next-line react/no-string-refs
    if (e.target.checked) {
      attributes.push(`${attribute};${value}`);
    } else {
      attributes.map((i, index) =>
        (i === `${attribute};${value.toString()}`
          ? attributes.splice(index, 1)
          : null),
      );
    }

    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: attributes.join(","),
      color: this.state.colors.join(","),
      brand: this.state.brands.join(","),
      promotion: "",
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        // window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
          attributes,
        });
      }
    });
  };

  handleClickCategory = (cat) => {
    const { isLogged, data } = this.props;
    this.setState({ loading: !this.state.loading });
    this.FilterSet.resetField();

    const params = {
      catId: cat.length === 0 ? catid : cat[0],
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: searchword === '.' ? '' : searchword,
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        window.scrollTo(0, 0);
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 20,
          catid: cat[0],
          aggregations: res.payload.data,
        });
      }
    });

    return null;
  };

  renderCategoryList = () => {
    try {
      const { categoryall, lang } = this.props;
      const { categories } = this.state;

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

      return <div className="block"><FormattedMessage id="search.filter.filter.noCategory" /></div>;
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
          className="col-xl-3 col-md-3 pad10"
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
                <strong><FormattedMessage id="search.filter.title" /></strong>
              </h5>
              <p className="title">
                <span><FormattedMessage id="search.filter.category.title" /></span>
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
                  <strong><FormattedMessage id="search.filter.filter.title" /></strong>
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
        <div className="col-xl-9 col-lg-9 col-md-8 pad10">
          <div className="list-filter pad10">
            <div className="row row10">
              <div className="col-md-4">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }}>
                      {searchKeyWordResponse.hits.total.value}
                    </strong>
                    <FormattedMessage id="search.searchResult.label.found" />
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <form className="flex-this end">
                  <div className="text-right d-block d-md-none">
                    <a
                      className="btn btn-gray btn-filter"
                      onClick={this.showMobilePanel}
                    >
                      <i className="fa fa-filter" aria-hidden="true" />
                      <span className="text-uppercase">
                        <FormattedMessage id="search.filter.filter.title" />
                      </span>
                    </a>
                  </div>
                  <div className="form-group my-select flex-this pr-1">
                    <label
                      htmlFor="inputState"
                      style={{ marginTop: "7px", marginRight: "5px" }}
                    >
                      <FormattedMessage id="search.sort.label" />:
                    </label>
                    <Select
                      onChange={this.handleChangeOrder}
                      className="form-control"
                      id="inputState"
                      placeholder={intl.formatMessage({ id: "search.sort.label" })}
                    >
                      <Select.Option value="currentprice_asc">
                        <FormattedMessage id="search.sort.values.priceAsc" />
                      </Select.Option>
                      <Select.Option value="currentprice_desc">
                        <FormattedMessage id="search.sort.values.priceDesc" />
                      </Select.Option>
                    </Select>
                    {/* <select className="form-control border" onChange={e => this.handleChangeOrder(e.target.value)}>
                      <option value="currentprice_asc"> dasdsa </option>
                      <option value="currentprice_desc"> <FormattedMessage id="search.sort.values.priceDesc" /> </option>
                    </select> */}
                  </div>
                  <div
                    className="form-group flex-this pl-2"
                  >
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
            <Spin spinning={this.state.loading} indicator={<Loader />}>
              {this.renderProducts()}
            </Spin>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  isRowLoaded = ({ index }) => index < this.state.products.length;

  noRowsRenderer = () => null

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateItemHeight = (width) => {
    let tmp;
    if (!this.state.isListViewOn) {
      if (width < 400) {
        tmp = 350;
      } else {
        tmp = 305.98;
      }
    } else if (width < 400) {
      tmp = 197;
    } else {
      tmp = 120;
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
    screenWidth = width;
    if (this.state.shapeType === 2) {
      return Math.max(Math.floor(width / 264.98), 1);
    }
    return Math.max(Math.floor(width / 835), 1);
  };

  loadMoreRows = () => {
    try {
      const { searchKeyWordResponse } = this.props;

      if (this.state.products.length < searchKeyWordResponse.hits.total.value || !this.state.loading) {
        const { isLogged, data } = this.props;
        const params = {
          catId: this.state.catid,
          custId: isLogged ? data[0].info.customerInfo.id : 0,
          value: searchword === '.' ? '' : searchword,
          attribute: this.state.attributes.join(','),
          color: this.state.colors.join(","),
          brand: this.state.brands.join(","),
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
            this.setState({
              products: this.state.products.concat(res.payload.data.hits.hits),
              count: this.state.count + 20,
            });
          }
        });
      }
      return null;
    } catch (error) {
      // return console.log(error);
      return null;
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
      // return console.log(error);
      return null;
    }
  };

  getData = () => {
    try {
      searchword = this.props.match.params.word;
      searchtime = this.props.match.params.time;
      catid = this.props.match.params.cat;

      this.setState({
        loading: true,
        ismore: !this.state.ismore,
        catid,
      });
      const { isLogged, data } = this.props;

      const params = {
        catId: catid,
        custId: isLogged ? data[0].info.customerInfo.id : 0,
        value: searchword === '.' ? '' : searchword,
        attribute: "",
        color: "",
        brand: "",
        promotion: "",
        minPrice: 0,
        maxPrice: 0,
        startsWith: 0,
        rowCount: 20,
        orderColumn: this.state.sort,
        highlight: false,
      };

      return this.props.searchProduct({ body: { ...params } }).then((res) => {
        if (res.payload.success && res.payload.data) {
          this.setState({
            products: res.payload.data.hits.hits,
            loading: false,
            count: 20,
            aggregations: res.payload.data,
            categories: res.payload.data.aggregations.categories,
            nodata: res.payload.data.hits.hits.length === 0,
          });
        }
      });
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    const { word, time, cat } = this.props.match.params;
    // Хайлтын хуудаснаас өөр үг хайх үед
    if (word !== searchword || time !== searchtime || cat !== catid) {
      this.getData();
    }

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
        <BackTop refs="backtop" />
      </div>
    );
  }
}

export default injectIntl(CategoryInfo);
