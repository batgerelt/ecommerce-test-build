/* eslint-disable brace-style */
/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Spin, Select, BackTop, Tree, Icon } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";

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
      catid: null,
      isListViewOn: false,
      loading: false,
      minPrice: 0,
      maxPrice: 0,
      sort: "",
      isLeftPanel: false,
      ITEM_HEIGHT: 294.98,
      shapeType: 2,
      colors: [],
      brands: [],
      attributes: [],
      count: 0,
      selectedCat: null,
      isCatChecked: false,
      aggregations: [],
      ismore: false,
    };
  }

  componentWillMount() {
    this.getData();
  }

  handleChangeOrder = (e) => {
    const { isLogged, data } = this.props;
    this.setState({ loading: !this.state.loading, sort: e });
    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: "",
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
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
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
      value: "",
      attribute: this.state.attributes.join(","),
      color: this.state.colors.join(","),
      brand: this.state.brands.join(","),
      promotion: "",
      minPrice: e[0],
      maxPrice: e[1],
      startsWith: this.state.count,
      rowCount: 20,
      orderColumn: this.state.sort,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
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
      value: "",
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
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
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
    this.setState({ loading: !this.state.loading, brands });

    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: "",
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
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
        });
      }
    });
  };

  handleChangeAttribute = (e, value, attribute) => {
    const { isLogged, data } = this.props;
    const { attributes } = this.state;
    if (e.target.checked) {
      attributes.push(`${attribute};${value}`);
    } else {
      attributes.map((i, index) =>
        (i === `${attribute};${value.toString()}`
          ? attributes.splice(index, 1)
          : null),
      );
    }
    this.setState({ loading: !this.state.loading, attributes });

    const params = {
      catId: this.state.catid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: "",
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
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
        });
      }
    });
  };

  handleClickCategory = (cat) => {
    const { isLogged, data } = this.props;
    this.setState({ loading: !this.state.loading });
    this.props.getCategoryParents({ id: cat.key });

    const params = {
      catId: cat.length === 0 ? searchid : cat[0],
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: "",
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
        this.setState({
          products: res.payload.data.hits.hits,
          loading: !this.state.loading,
          count: 0,
          catid: cat[0],
          aggregations: res.payload.data,
        });
      }
    });
  };

  renderCategoryList = () => {
    try {
      const { categoryall } = this.props;
      const { categories } = this.state;

      if (categories.buckets.length !== 0) {
        return (
          <Tree
            switcherIcon={<Icon type="down" />}
            onSelect={this.handleClickCategory}
            defaultExpandAll={false}
            defaultExpandParent={false}
          >
            {categories.buckets.map(one => (
              <Tree.TreeNode
                title={categoryall.find(i => i.id === one.key).name}
                key={one.key}
              >
                {one.buckets === undefined ? null
                  : one.buckets.buckets.map(two => (
                    <Tree.TreeNode
                      title={categoryall.find(i => i.id === two.key).name}
                      key={two.key}
                    >
                      {two.buckets !== undefined &&
                        two.buckets.buckets !== undefined
                        ? two.buckets.buckets.map(three => (
                          <Tree.TreeNode
                            title={
                              categoryall.find(i => i.id === three.key).name
                            }
                            key={three.key}
                          />
                        ))
                        : null}
                    </Tree.TreeNode>
                  ))}
              </Tree.TreeNode>
            ))}
          </Tree>
        );
      }
      return <div className="block"><FormattedMessage id="season.filter.filter.noCategory" /></div>;
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  renderLeftPanel = () => {
    try {
      const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;
      const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;

      return (
        <div className="col-xl-3 col-md-3 pad10">
          <div
            className={`left-panel-container ${leftPanel1}`}
            onClick={this.showLeftPanel}
          >
            <div className={leftPanel}>
              <button
                className="button buttonBlack filter-cross"
                onClick={this.showLeftPanel}
              >
                <img
                  src={crossImage}
                  alt="cross"
                  height="25px"
                  aria-hidden="true"
                />
              </button>
              <h5 className="title">
                <strong><FormattedMessage id="season.filter.title" /></strong>
              </h5>
              <p className="title">
                <span><FormattedMessage id="season.filter.category.title" /></span>
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
                  <strong><FormattedMessage id="season.filter.filter.title" /></strong>
                </h5>
                <div className="left-filter">
                  <SearchFilterSet
                    onRef={ref => (this.FilterSet = ref)}
                    {...this.props}
                    {...this}
                    {...this.state}
                    data={this.state.aggregations}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  renderFilteredList = () => {
    try {
      const { searchKeyWordResponse } = this.props;

      return (
        <div className="col-xl-9 col-lg-9 col-md-8 pad10">
          <div className="list-filter">
            <div className="row row10">
              <div className="col-lg-6 pad10">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }}>{searchKeyWordResponse.hits.total.value}</strong>
                    <FormattedMessage id="season.searchResult.label.found" />
                  </p>
                </div>
              </div>
              <div className="col-lg-6 pad10">
                <form className="flex-this end">
                  <div className="text-right d-block d-md-none">
                    <a
                      className="btn btn-gray btn-filter"
                      onClick={this.showLeftPanel}
                    >
                      <i className="fa fa-filter" aria-hidden="true" />
                      <span className="text-uppercase">Шүүлтүүр</span>
                    </a>
                  </div>
                  <div className="form-group my-select flex-this">
                    <label
                      htmlFor="inputState"
                      style={{ marginTop: "7px", marginRight: "5px" }}
                    >
                      <FormattedMessage id="season.sort.label" />:
                    </label>
                    <Select
                      onChange={this.handleChangeOrder}
                      className="form-control"
                      id="inputState"
                    >
                      <Select.Option value="price_desc"><FormattedMessage id="season.sort.values.priceDesc" /></Select.Option>
                      <Select.Option value="price_asc"><FormattedMessage id="season.sort.values.priceAsc" /></Select.Option>
                    </Select>
                  </div>
                  <div className="form-group flex-this">
                    <div
                      className={this.state.isListViewOn ? "btn active" : "btn"}
                      onClick={this.handleViewChange}
                    >
                      <i className="fa fa-th-list" aria-hidden="true" />
                    </div>
                    <div
                      className={this.state.isListViewOn ? "btn" : "btn active"}
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

  noRowsRenderer = () => <div>No data</div>;

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
        tmp = 300.98;
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

      if (this.state.products.length < searchKeyWordResponse.hits.total.value) {
        const { isLogged, data } = this.props;
        const params = {
          catId: this.state.catid === null ? searchid : this.state.catid,
          custId: isLogged ? data[0].info.customerInfo.id : 0,
          value: "",
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
      return console.log(error);
    }
  };

  renderProducts = () => {
    try {
      const { products } = this.state;
      if (products.length !== 0) {
        return (
          <AutoSizer disableHeight>
            {({ width }) => {
              const rowCount = this.getRowsAmount(width, products.length, true);
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
                          autoHeight
                          ref={registerChild}
                          height={340}
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
                              <div style={style} key={key} className="jss148">
                                {rowItems.map((itemId, index) => (
                                  <Card
                                    style={{ padding: '10px 10px' }}
                                    elastic
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
    this.setState({ loading: true, ismore: !this.state.ismore });
    const { isLogged, data } = this.props;

    const params = {
      catId: searchid,
      custId: isLogged ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      startsWith: 0,
      rowCount: 20,
      orderColumn: "",
      highlight: false,
    };

    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        this.setState({
          products: res.payload.data.hits.hits,
          loading: false,
          count: 20,
          aggregations: res.payload.data,
          categories: res.payload.data.aggregations.categories,
          catid: searchid,
        });
      }
    });

    this.props.getCategoryParents({ id: this.props.match.params.id });
  };

  // renderBreadCrumb = () => {
  //   try {
  //     const { categoryparents } = this.props;
  //     return (
  //       <div className="e-breadcrumb">
  //         <ul className="list-unstyled">
  //           {categoryparents.map(category => (
  //             <li key={category.catnm}>
  //               <Link to={category.route ? category.route : ""}>
  //                 <span>{category.catnm}</span>
  //               </Link>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   } catch (error) {
  //     return console.log(error);
  //   }
  // };

  render() {
    const { id } = this.props.match.params;
    if (id !== searchid) {
      this.getData();
    }

    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10">
            {/* {this.renderBreadCrumb()} */}
            <div className="row row10">
              {this.renderLeftPanel()}
              {this.renderFilteredList()}
            </div>
          </div>
        </div>
        <BackTop />
      </div>
    );
  }
}

export default CategoryInfo;
