/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-else-return */
/* eslint-disable radix */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { BackTop, Spin, Select, Tree, Icon } from "antd";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { SkeltonCard, Banner, Loader, SearchFilterSet } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";
import Card from "./components/card";
import PageBanner from "./components/banner";
import crossImage from "../../scss/assets/svg/error-black.svg";

const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5;
let scrollTopNumber = 0;

class Discount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      headerProducts: [],
      loading: false,
      total: 0,
      isMobilePanel: false,

      categoryId: null,
      selectCat: false,

      fetch: false,
      loadingCart: false,
      catId: 0,
      custId: 0,
      value: "",
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      module: "hourdiscount",
      startsWith: 0,
      rowCount: 20,
      orderColumn: "startnew_desc, endnew_asc, updatedate_desc, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC",
      highlight: false,

      aggregations: null,
    };
  }

  loadMoreRows = () =>
    this.props.getDiscountProducts({ body: { ...this.state, startsWith: this.props.discountproductCount } }).then((res) => {
      this.setState({
        aggregations: res.payload.data,
        categories: res.payload.data.aggregations.categories,
      });
      console.log("index");
    },
    );

  renderHelmet = () => {
    const { menuDiscount, intl } = this.props;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>{intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en}</title>
        <meta name="description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
        <meta name="keywords" content="emartmall,emart,ecommerce,shopping,e-mart,имарт,хямдрал,discount" />
        <meta name="url" content={window.location.href} />

        {/* FACEBOOK SHARE META TAGS */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en} />
        <meta property="og:description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://api.emartmall.mn/Resource/emartmall.png" />

        {/* TWITTER SHARE META TAGS */}
        <meta name="twitter:site" content={window.location.href} />
        <meta name="twitter:title" content={intl.locale === "mn" ? menuDiscount.menunm : menuDiscount.menunm_en} />
        <meta name="twitter:description" content={intl.locale === "mn" ? menuDiscount.subtitle : menuDiscount.subtitle_en} />
      </Helmet>
    );
  }

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      return null;
    }
  };

  renderSkeltonCard = () => {
    let result = [];
    for (let i = 0; i < itemsInRow; i++) { result.push(<SkeltonCard key={i} />); }
    return result;
  }

  generateItemHeight = () => {
    if (window.innerWidth < 576) {
      return 320;
    } else if (window.innerWidth < 768) {
      return 405;
    } else if (window.innerWidth < 992) {
      return 300;
    } else if (window.innerWidth < 1200) {
      return 375;
    } else {
      return 350;
    }
  }

  getRowsAmount = (itemsAmount, hasMore) => Math.ceil(itemsAmount / itemsInRow) + (hasMore ? 1 : 0);

  noRowsRenderer = () => null;

  handleDetail = index => scrollTopNumber = index;

  renderFooterProduct = () => {
    try {
      const { discountproducts, discountproductTotal, isFetchingDiscount } = this.props;
      return (
        <div className="container discount-list px-0">
          <div className="row">
            <AutoSizer disableHeight >
              {({ width }) => {
                const rowCount = Math.ceil(discountproducts.length / itemsInRow + (discountproductTotal === 0 ? 1 : discountproductTotal !== discountproducts.length ? 1 : 0));
                return (
                  <InfiniteLoader
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => !!discountproducts[index * itemsInRow] || false}
                    loadMoreRows={this.loadMoreRows}
                    threshold={1}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller className="WindowScroller">
                        {({ height, scrollTop }) => (
                          <List
                            style={{ outline: "none" }}
                            autoHeight
                            ref={registerChild}
                            height={height}
                            width={width}
                            scrollTop={scrollTop}
                            /* onScroll={e => console.log(e)} */
                            rowCount={rowCount}
                            rowHeight={this.generateItemHeight}
                            noRowsRenderer={this.noRowsRenderer}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => (
                                // eslint-disable-next-line react/jsx-indent
                                <div style={style} key={key} className="emartmall-scroll-list">
                                  {
                                    discountproducts.slice(index * itemsInRow, (index * itemsInRow) + itemsInRow).map(i => (
                                      <Card
                                        elastic
                                        rowIndex={index}
                                        isVisible={isVisible}
                                        key={i.skucd}
                                        shape={CARD_TYPES.slim}
                                        item={i}
                                        handleDetail={this.handleDetail}
                                        {...this.props}
                                      />
                                    ))
                                  }
                                  {/* {isFetchingDiscount && <React.Fragment>{this.renderSkeltonCard()}</React.Fragment>} */}
                                </div>
                              )}
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
      );
    } catch (error) {
      return console.log(error);
    }
  };

  /* renderCategoryList = () => {
    try {
      console.log("promotionall: ", this.props.promotionall);
      console.log("categoryId: ", this.state.categoryId);
      console.log("bucket: ", this.state.aggregations);

      const { promotionall } = this.props;
      const { categoryId, bucket } = this.state;
      const lang = this.props.intl;
      let array = [];
      let tempArray = [];
      let res = this.props.promotid.split(",");

      bucket.buckets.map((item) => {
        res.find(i => (Number(i) === item.key ? tempArray.push(item) : null));
      });

      res.map((item) => {
        promotionall.map(i => (i.id === Number(item) ? array.push(i) : null));
      });

      return (
        <ul className="list-unstyled category-list">
          {
            array.map((cat, key) => (
              <div key={key}>
                <Link
                  to={`/e/${this.props.match.params.id}/${promotionall.find(i => i.id === cat.id).id}`}
                  key={key}
                >
                  <li className={cat.id === categoryId ? "selected" : "disabled"} >
                    <span onClick={() => this.handleClickCategory(cat)}>
                      {
                        lang === "mn" ?
                          promotionall.find(i => i.id === cat.id).name
                          :
                          promotionall.find(i => i.id === cat.id).nameen
                      }
                    </span>
                  </li>
                </Link>
              </div>
            ))
          }
        </ul>
      );
    } catch (error) {
      return null;
    }
  } */

  renderCategoryList = () => {
    try {
      const { categoryall, intl } = this.props;
      const lang = intl.locale;
      const { categories } = this.state;
      if (categories.buckets.length !== 0) {
        return (
          <Tree.DirectoryTree
            switcherIcon={<Icon type="down" />}
            onSelect={this.handleClickCategory}
            showIcon={false}
            defaultExpandAll
          >
            {categories.buckets.map(one => (
              <Tree.TreeNode
                title={lang === "mn" ? categoryall.find(i => i.id === one.key).name : categoryall.find(i => i.id === one.key).nameen}
                key={one.key}
                id={one.doc_count}
              >
                {one.buckets.buckets &&
                  one.buckets.buckets.map((two) => {
                    if (two.key !== 0) {
                      return (
                        <Tree.TreeNode
                          title={lang === "mn" ? categoryall.find(i => i.id === two.key).name : categoryall.find(i => i.id === two.key).nameen}
                          key={two.key}
                          id={two.doc_count}
                        >
                          {
                            two.buckets !== undefined && two.buckets.buckets !== undefined ?
                              two.buckets.buckets.map(three => (
                                three.key === 0 ? null :
                                  <Tree.TreeNode
                                    title={
                                      lang === "mn"
                                        ? categoryall.find(i => i.id === three.key).name
                                        : categoryall.find(i => i.id === three.key).nameen
                                    }
                                    key={three.key}
                                    id={three.doc_count}
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
      return null;
    }
  };

  showMobilePanel = () => this.setState({ isMobilePanel: !this.state.isMobilePanel });

  renderFilter = () => {
    try {
      const leftPanel = `left-panel${this.state.isMobilePanel ? " show" : ""}`;
      return (
        <div className="col-lg-3 col-md-4">
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

  renderFilteredList = () => {
    try {
      const { loading } = this.state;
      const { intl } = this.props;
      const { aggregations } = this.state;
      return (
        <div className="col-lg-9 col-md-8">
          <div className="list-filter">
            <div className="row">
              <div className="col-md-4">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }}>
                      {loading ? "" : aggregations ? aggregations.hits.total.value : null}
                    </strong>
                    {loading ? "" : <FormattedMessage id="search.searchResult.label.product" />}
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
          {this.renderFooterProduct()}
        </div>
      );
    } catch (error) {
      return console.log("error: ", error);
    }
  }

  render() {
    const { banner } = this.props;
    return (
      <div className="top-container top-container-responsive discount-container">
        <PageBanner />
        <div className="section season">
          <div className="container pad10">
            <div className="row row10">
              {this.renderFilter()}
              {this.renderFilteredList()}
            </div>
          </div>
        </div>
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Discount);
