/* eslint-disable no-lonely-if */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import { Link } from "react-router-dom";
import { Spin, Select, BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";
import { CardList, Card, FilterSet, Loader } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";
// eslint-disable-next-line import/first

const Option = Select.Option;

let count = 20;
let screenWidth = 0;
class CategoryInfo extends React.Component {
  state = {
    loading: false,
    isListViewOn: false,
    minPrice: 0,
    maxPrice: 0,
    ordercol: "price_asc",
    parameters: [],
    products: [],
    subcategorys: [],
    parents: [],
    attributes: [],
    selectedPromoCatId: null,
    isLeftPanel: false,
    ITEM_HEIGHT: 284.98,
    shapeType: 2,
  };

  isRowLoaded = ({ index }) => index < this.state.products.length;

  // data nemeh heseg
  loadMoreRows = (key) => {
    const { minPrice, maxPrice, ordercol } = this.state;
    let parameters = this.state.parameters;
    if (!this.props.isFetching) {
      const params = {
        catId: this.props.id,
        parameters,
        minPrice,
        maxPrice,
        ordercol,
        rowcount: 20,
        startswith: count,
      };
      count += 20;
      this.props
        .categoryFilter({
          body: { ...params },
        })
        .then((res) => {
          if (res.payload.success) {
            console.log(params, res.payload);
          }
        });
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  getMaxItemsAmountPerRow = (width) => {
    screenWidth = width;
    if (this.state.shapeType === 2) {
      return Math.max(Math.floor(width / 264.98), 1);
    }
    return Math.max(Math.floor(width / 835), 1);
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

  handleSortChange = (value) => {
    const { parameters, minPrice, maxPrice } = this.state;
    const params = {
      catid: this.props.id,
      parameters,
      minprice: minPrice,
      maxprice: maxPrice,
      ordercol: value,
      rowcount: 0,
      startswith: 0,
    };
    this.setState({
      ordercol: value,
    });
    this.fetchProductData(params);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      products:
        nextProps.categoryfilter.length === 0 ? [] : nextProps.categoryfilter,
      subcategorys:
        nextProps.categoryinfo.length === 0
          ? []
          : nextProps.categoryinfo.subcategorys,
      parents:
        nextProps.categoryinfo.length === 0
          ? []
          : nextProps.categoryinfo.parents,
      attributes:
        nextProps.categoryinfo.length === 0
          ? []
          : nextProps.categoryinfo.attributes,
    });
  }

  handlePriceAfterChange = (value) => {
    const { parameters, ordercol } = this.state;
    const params = {
      catid: this.props.id,
      parameters,
      minprice: value[0],
      maxprice: value[1],
      ordercol,
      rowcount: 0,
      startswith: 0,
    };
    this.setState({
      minPrice: value[0],
      maxPrice: value[1],
    });
    this.fetchProductData(params);
  };

  handleAttributeChange = (e) => {
    const { minPrice, maxPrice, ordercol } = this.state;
    let parameters = this.state.parameters;
    const i = parameters.indexOf(e.target.value);
    if (e.target.checked) {
      parameters.push(e.target.value);
    } else if (i !== -1) {
      parameters.splice(i, 1);
    }
    this.setState({ parameters });
    const params = {
      catId: this.props.id,
      parameters,
      minPrice,
      maxPrice,
      ordercol,
      rowcount: 0,
      startswith: 0,
    };

    this.fetchProductData(params);
  };

  fetchProductData = (params) => {
    this.props.resetFullCategory();
    count = 20;
    this.setState({ loading: true });
    this.props
      .categoryFilter({
        body: { ...params },
      })
      .then((res) => {
        if (res.payload.success) {
          this.setState({ products: res.payload.data });
        }
        this.setState({ loading: false });
      });
  };

  renderBreadCrumb = () => {
    try {
      const { parents } = this.state;
      return (
        <div className="e-breadcrumb">
          <ul className="list-unstyled">
            {parents.map(category => (
              <li key={category.catnm}>
                <Link to={category.route ? category.route : ""}>
                  <span>{category.catnm}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  handleViewChange = (e) => {
    e.preventDefault();
    this.props.resetCategory();
    count = 20;
    if (this.state.isListViewOn) {
      this.setState({ shapeType: 2 });
    } else {
      this.setState({ shapeType: 4 });
    }
    this.setState({ isListViewOn: !this.state.isListViewOn });
  };

  generateItemHeight = (width) => {
    let tmp;
    if (!this.state.isListViewOn) {
      if (width < 400) {
        tmp = 350;
      } else {
        tmp = 284.98;
      }
    } else {
      if (width < 400) {
        tmp = 197;
      } else {
        tmp = 120;
      }
    }
    return tmp;
  };

  renderLeftPanel = () => {
    try {
      const { id } = this.props;
      const { subcategorys, products, parents } = this.state;
      let tmp = <div className="block">Ангилал байхгүй байна</div>;
      if (parents.length !== 0) {
        tmp = parents.map((item, i) => {
          if (item.id === parseInt(id)) {
            return (
              <div key={i} className="block">
                <div className="accordion">
                  <h6
                    style={{
                      marginLeft: "10px",
                      marginTop: "10px",
                      marginBittom: 0,
                    }}
                  >
                    {item.catnm}
                  </h6>
                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div className="collapse-content">
                      <ul className="list-unstyled">
                        {subcategorys.map((sub, index) => {
                          if (sub.parentid === item.id) {
                            return (
                              <li key={index}>
                                <Link to={sub.route ? sub.route : ""}>
                                  {sub.catnm}
                                </Link>
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        });
      }
      return tmp;
    } catch (error) {
      return console.log(error);
    }
  };

  renderFilteredList = () => {
    try {
      const { attributes } = this.state;
      let filters =
        attributes &&
        attributes.map((attr, index) => (
          <FilterSet
            key={index}
            onAttributeChange={this.handleAttributeChange}
            onPriceAfterChange={this.handlePriceAfterChange}
            minPrice={this.state.minPrice}
            maxPrice={this.state.maxPrice}
            data={attr}
          />
        ));

      return filters;
    } catch (error) {
      return console.log(error);
    }
  };

  renderProducts = () => {
    try {
      const { isListViewOn, products } = this.state;
      let result = null;
      if (products.length !== 0) {
        result = (
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
                            const { product } = this.state;
                            const maxItemsPerRow = this.getMaxItemsAmountPerRow(
                              width,
                            );
                            const rowItems = this.generateIndexesForRow(
                              index,
                              maxItemsPerRow,
                              products.length,
                            ).map(itemIndex => products[itemIndex]);
                            return (
                              <div style={style} key={key} className="jss148">
                                {rowItems.map(itemId => (
                                  <Card
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
      return result;
    } catch (error) {
      return console.log(error);
    }
  };

  getSelectedCat = () => {
    const { parents } = this.state;
    const { id } = this.props;
    let tmp = "";
    parents.map((item, i) => {
      if (item.id === parseInt(id)) {
        tmp = item.catnm;
      }
      return tmp;
    });
    return tmp;
  };

  render() {
    if (this.props.categoryinfo.length !== 0) {
      const { isLeftPanel, products, isListViewOn } = this.state;
      const leftPanel = `left-panel${isLeftPanel ? " show" : ""}`;
      const leftPanel1 = `${isLeftPanel ? " show" : ""}`;
      return (
        <div className="top-container">
          <div className="section">
            <div className="container pad10">
              {this.renderBreadCrumb()}
              <div className="row row10">
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
                        <strong>Хайлтын үр дүн</strong>
                      </h5>
                      <p className="title">
                        <span>Ангилал</span>
                      </p>
                      {this.renderLeftPanel()}
                      <div>
                        <h5 className="title">
                          <strong>Шүүлтүүр</strong>
                        </h5>
                        <div className="left-filter">
                          {this.renderFilteredList()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-8 pad10">
                  <div className="list-filter">
                    <div className="row row10">
                      <div className="col-lg-6 pad10">
                        <div className="total-result">
                          <p className="text">
                            <strong>"{this.getSelectedCat()}"</strong>{" "}
                            {products.length} бараа олдлоо
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
                          <div
                            className="form-group my-select flex-this"
                            style={{ marginRight: "10px" }}
                          >
                            <label
                              htmlFor="inputState"
                              style={{
                                marginTop: "7px",
                                marginRight: "5px",
                              }}
                            >
                              Эрэмбэлэх:
                            </label>
                            <Select
                              defaultValue={this.state.ordercol}
                              onChange={this.handleSortChange}
                              className="form-control"
                              id="inputState"
                            >
                              <Option value="price_desc">Үнэ буурахаар</Option>
                              <Option value="price_asc">Үнэ өсөхөөр</Option>
                            </Select>
                          </div>
                          <div className="form-group flex-this">
                            <Link
                              to=""
                              className={isListViewOn ? "btn active" : "btn"}
                              onClick={this.handleViewChange}
                            >
                              <i className="fa fa-th-list" aria-hidden="true" />
                            </Link>
                            <Link
                              to=""
                              className={isListViewOn ? "btn" : "btn active"}
                              onClick={this.handleViewChange}
                            >
                              <i className="fa fa-th" aria-hidden="true" />
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <Spin spinning={this.state.loading}>
                    {this.renderProducts()}
                  </Spin>
                </div>
              </div>
            </div>
          </div>
          <BackTop />
        </div>
      );
    }
    return null;
  }
}

export default CategoryInfo;
