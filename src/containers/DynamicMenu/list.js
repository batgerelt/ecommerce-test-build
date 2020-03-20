/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable no-else-return */
/* eslint-disable brace-style */
/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Spin, Select, BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import windowSize from 'react-window-size';

import { Card, Loader, SearchFilterSet, PageBanner, Widget } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";
import styles from "./style.less";

let screenWidth = 0;
let searchword = null;

class CategoryInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryId: null,
      visible: false,
      products: [],
      isListViewOn: false,
      loading: false,
      isMobilePanel: false,
      ITEM_HEIGHT: 284.98,
      shapeType: 2,
      colors: [],
      brands: [],
      attributes: [],
      count: 0,
      aggregations: [],
      promotions: [],
      catId: 0,
      custId: 0,
      value: "",
      attribute: "",
      color: "",
      brand: "",
      promotion: null,
      minPrice: 0,
      maxPrice: 0,
      startsWith: 0,
      rowCount: 20,
      orderColumn: 'updateddate_desc, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC',
      highlight: false,
    };
  }

  /* UNSAFE_componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.getData();
    }
  } */

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = () => {
    try {
      const param = {
        catId: 0,
        custId: 0,
        value: "",
        attribute: "",
        color: "",
        brand: "",
        promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
        minPrice: 0,
        maxPrice: 0,
        startsWith: 0,
        rowCount: 20,
        orderColumn: 'updateddate_desc, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC',
        highlight: false,
      };
      this.setState({ loading: true, promotion: null });
      this.props.searchProduct({ body: { ...param } }).then((res) => {
        if (res.payload.success && res.payload.data) {
          this.setState({
            products: res.payload.data.hits.hits,
            startsWith: 20,
            aggregations: res.payload.data,
            promotions: res.payload.data.aggregations.promotions,
            loading: false,
          });
        }
      });
      return null;
    } catch (error) {
      return null;
    }
  }

  loadMoreRows = () => {
    try {
      const { searchKeyWordResponse } = this.props;
      if (this.state.products.length < searchKeyWordResponse.hits.total.value && !this.state.loading) {
        const { isLoggedIn, data } = this.props;
        const params = {
          catId: 0,
          custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
          value: searchword,
          attribute: this.state.attributes.join(','),
          color: this.state.colors.join(','),
          brand: this.state.brands.join(','),
          promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          startsWith: this.state.count,
          rowCount: 20,
          orderColumn: this.state.orderColumn,
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
      return null;
    }
  };

  renderHelmet = () => {
    const { menuRecipe } = this.props;
    const lang = this.props.intl;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>Улирал</title>
      </Helmet>
    );
  }

  visibleFalse = () => {
    this.setState({ visible: false });
  }

  visibleTrue = () => {
    this.setState({ visible: true });
  }

  handleChangeOrder = (e) => {
    const { isLoggedIn, data } = this.props;
    this.setState({ loading: !this.state.loading, orderColumn: e });
    const params = {
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.join(','),
      promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
      minPrice: this.state.minPrice,
      maxPrice: 0,
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
          count: 20,
          sort: e,
        });
      }
    });
  };

  handleViewChange = () => {
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
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.join(','),
      promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
      minPrice: e[0],
      maxPrice: e[1],
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.orderColumn,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
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
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: this.state.attributes.join(','),
      color: colors.join(','),
      brand: this.state.brands.join(','),
      promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.orderColumn,
      highlight: false,
    };
    this.props.searchProduct({ body: { ...params } }).then((res) => {
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
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: brands.join(','),
      promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.orderColumn,
      highlight: false,
    };

    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  }

  handleChangeAttribute = (e, value, attribute) => {
    const { isLoggedIn, data } = this.props;
    const { attributes } = this.state;
    if (e.target.checked) { attributes.push(`${attribute};${value}`); }
    else { attributes.map((i, index) => (i === `${attribute};${value}` ? attributes.splice(index, 1) : null)); }
    this.setState({ loading: !this.state.loading, attributes });

    const params = {
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: '',
      attribute: attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.join(','),
      promotion: this.state.promotion === null ? this.props.promotid : this.state.promotion,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.orderColumn,
      highlight: false,
    };

    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        this.setState({ products: res.payload.data.hits.hits, loading: !this.state.loading, count: 20 });
      }
    });
  };

  handleClickCategory = (cat) => {
    const { isLoggedIn, data } = this.props;
    this.setState({ loading: true });
    if (cat.key === this.state.categoryId) {
      this.setState({ categoryId: null, promotion: this.props.promotid });
    } else {
      this.setState({ categoryId: cat.key, promotion: cat.key });
    }
    const params = {
      catId: 0,
      custId: isLoggedIn ? data[0].info.customerInfo.id : 0,
      value: "",
      attribute: this.state.attributes.join(','),
      color: this.state.colors.join(','),
      brand: this.state.brands.join(','),
      promotion: cat.key === this.state.categoryId ? this.props.promotid : cat.key,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      startsWith: 0,
      rowCount: 20,
      orderColumn: this.state.orderColumn,
      highlight: false,
    };

    this.props.searchProduct({ body: { ...params } }).then((res) => {
      if (res.payload.success) {
        this.setState({
          products: res.payload.data.hits.hits,
          loading: false,
          count: 20,
          aggregations: res.payload.data,
          visible: false,
        });
      }
    });
  }

  renderCategoryList = () => {
    try {
      const { promotionall } = this.props;
      const { promotions, categoryId } = this.state;
      const { buckets } = promotions.buckets;
      const lang = this.props.intl;

      let array = [];
      let tempArray = [];
      let res = this.props.promotid.split(",");
      buckets.map((item) => {
        res.find(i => (Number(i) === item.key ? tempArray.push(item) : null));
      });

      res.map((item) => {
        tempArray.find(i => (i.key === Number(item) ? array.push(i) : null));
      });

      if (promotions) {
        return (
          <ul className="list-unstyled category-list">
            {
              array.map((cat, key) => (
                <div key={key}>
                  <Link
                    to={`/e/${this.props.match.params.id}/${promotionall.find(i => i.id === cat.key).id}`}
                    key={key}
                  >
                    <li className={cat.key === categoryId || cat.key == this.props.match.params.promotid ? "selected" : "disabled"}>
                      <span onClick={() => this.handleClickCategory(cat)}>
                        {
                          lang === "mn" ?
                            promotionall.find(i => i.id === cat.key).name
                            :
                            promotionall.find(i => i.id === cat.key).nameen
                        }
                      </span>
                    </li>
                  </Link>
                </div>
              ))
            }
          </ul>
        );
      }
      return <div className="block"><FormattedMessage id="search.filter.filter.noCategory" /></div>;
    } catch (error) {
      return null;
    }
  }

  renderLeftPanel = () => {
    try {
      const leftPanel = `left-panel${this.state.isMobilePanel ? " show" : ""}`;
      return (
        <div className="col-lg-3 col-md-4 pad10">
          <div className={`left-panel-container ${this.state.isMobilePanel ? " show" : ""}`} onClick={this.showMobilePanel}>
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
                    promotion
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }

  showMobilePanel = () => this.setState({
    isMobilePanel: !this.state.isMobilePanel,
  })

  renderFilteredList = () => {
    try {
      const { intl, searchKeyWordResponse } = this.props;
      const { loading } = this.state;

      return (
        <div className="col-lg-9 col-md-8 pad10 px-0">
          <div className="list-filter pad10">
            <div className="row">
              <div className="col-md-4">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }}>
                      {loading ? "" : searchKeyWordResponse.hits.total.value}
                    </strong>
                    {loading ? "" : <FormattedMessage id="search.searchResult.label.found" />}
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <form className="flex-this end">
                  <div className="text-right d-block d-md-none">
                    <a
                      className="btn btn-gray btn-filter"
                      onClick={this.visibleTrue}
                    >
                      <i className="fa fa-filter" aria-hidden="true" />
                      <span className="text-uppercase">
                        <FormattedMessage id="search.filter.filter.title" />
                      </span>
                    </a>
                  </div>
                  <div className="form-group my-select flex-this pr-1">
                    <Select
                      onChange={this.handleChangeOrder}
                      className="form-control"
                      id="inputState"
                      placeholder={intl.formatMessage({ id: "search.sort.label" })}
                    >
                      <Select.Option value="currentprice_desc">
                        <FormattedMessage id="search.sort.values.priceDesc" />
                      </Select.Option>
                      <Select.Option value="currentprice_asc">
                        <FormattedMessage id="search.sort.values.priceAsc" />
                      </Select.Option>
                    </Select>
                  </div>
                  <div className="form-group flex-this searchGridList pl-2">
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
      return null;
    }
  }

  isRowLoaded = ({ index }) => index < this.state.products.length;

  noRowsRenderer = () => (
    <div>
      <h1>placeholder content</h1>
    </div>
  );

  getRowsAmount = (width, itemsAmount, hasMore) => {
    const maxItemsPerRow = this.getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  };

  generateItemHeight = (width) => {
    let tmp;
    const windowWidth = this.props.windowWidth;
    const isList = this.state.isListViewOn;

    if (windowWidth < 576) { // is mobile
      tmp = windowWidth < 365 ? 340 : windowWidth < 420 ? 370 : windowWidth < 475 ? 450 : 480;
    } else if (windowWidth >= 576 && windowWidth <= 767) {
      tmp = 365;
    } else if (windowWidth >= 768 && windowWidth <= 991) {
      tmp = 350;
    }

    else if (windowWidth < 992) {
      tmp = isList ? 120 : 365;
    } else if (windowWidth < 1200) {
      tmp = isList ? 120 : 285;
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

  // eslint-disable-next-line arrow-body-style
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
                              <div style={style} key={key} className={`emartmall-scroll-list ${this.state.isListViewOn ? 'pl-1' : ''}`}>
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
      return null;
    }
  };

  renderBanner = () => {
    const lang = localStorage.getItem('lang');
    try {
      const { menuSeason, banner } = this.props;
      return menuSeason[0] && (
        <div>
          {
            this.props.match.params.id === "valentines" ?
              <PageBanner
                title={lang === "mn" ? menuSeason[0].menunm : menuSeason[0].menunm_en}
                subtitle={lang === "mn" ? menuSeason[0].subtitle : menuSeason[0].subtitle_en}
                banners={banner.header}
                bgColor="#F596B8"
                isValentina
              />
              :
              <PageBanner
                title={lang === "mn" ? menuSeason[0].menunm : menuSeason[0].menunm_en}
                subtitle={lang === "mn" ? menuSeason[0].subtitle : menuSeason[0].subtitle_en}
                banners={banner.header}
                bgColor="#FFAD00"
              />
          }
        </div>
      );
    } catch (error) {
      return null;
    }
  }

  renderMobileLeftPanel = () => {
    try {
      const { visible, aggregations } = this.state;
      return (
        <li className="list-inline-item user">
          <div className={`mobile-menu-container ${visible ? ' activated' : ''}`} >
            <div className={`fixed-mobile-menu ${visible ? ' activated' : ''}`} style={{ backgroundColor: "white" }}>
              <div style={{ padding: "10px", marginTop: "20px" }}>
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
                      data={aggregations}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={`fixed-left-side ${visible ? ' activated' : ''}`} style={{ width: "100%", height: "100%", backgroundColor: "transparent !important" }} onClick={this.visibleFalse} />
          </div>
        </li>
      );
    } catch (error) {
      return null;
    }
  };

  render() {
    const { banner } = this.props;
    return (
      <div className="top-container elastic-container">
        {this.renderHelmet()}
        <PageBanner banner={banner} />
        <div className="section season">
          <div className="container pad10">
            <div className="row row10">
              {this.renderLeftPanel()}
              {this.renderFilteredList()}
            </div>
          </div>
        </div>
        <BackTop />
        {this.renderMobileLeftPanel()}
      </div>
    );
  }
}

export default windowSize(injectIntl(CategoryInfo));
