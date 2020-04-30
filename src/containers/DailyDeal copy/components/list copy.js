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
import { BackTop, Spin, Select } from "antd";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import Helmet from "react-helmet";
import { SkeltonCard, Banner, Loader, SearchFilterSet } from "../../../components";
import { CARD_TYPES } from "../../../utils/Consts";
import Card from "./card";
import PageBanner from "./banner";

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

      catId: 0,
      custId: 0,
      value: '',
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      module: 'hourdiscount',
      startsWith: 0,
      rowCount: 20,
      orderColumn: 'catid_desc, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC',
      highlight: false,

      aggregations: [],
    };
  }

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

  loadMoreRows = () => this.props.getDiscountProducts({ body: { ...this.state, startsWith: this.props.discountproductCount } }).then(res => this.setState({ aggregations: res.payload.data.aggregations }));

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      return null;
    }
  };

  // нэг мөр хоосон харагдаад байсан тул skelton харуулав
  // skelton нь нэг мөр харагдана mobile(2 card) tablet(4 card) desktop(5 card) etc...
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
        <div className="container pad10 discount-list px-0">
          <div className="row row10">
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
                            onScroll={e => console.log(e)}
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

  renderFilteredList = () => {
    try {
      const { loading } = this.state;
      const { intl } = this.props;
      return (
        <div className="col-lg-9 col-md-8 px-0">
          <div className="list-filter">
            <div className="row">
              <div className="col-md-4">
                <div className="total-result">
                  <p className="text">
                    <strong style={{ marginRight: 5 }} />
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
          <div className="list-filter pad10">
            <div className="row">
              {this.renderFooterProduct()}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log("error: ", error);
    }
  }

  renderFilter = () => {
    try {
      const { aggregations } = this.state;
      console.log(aggregations);
      return (
        <div className="col-lg-3 col-md-4 pad10">
          <div className={`left-panel-container show`} >
            <div className={leftPanel}>
              <button className="button buttonBlack filter-cross">
                <img
                  // src={crossImage}
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
                    data={aggregations}
                    promotion
                  />
                </div>
              </div>

            </div>
          </div>
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


<div className="list-filter">
  <div className="row">
    <div className="col-md-4">
      <div className="total-result">
        <p className="text">
          <strong style={{ marginRight: 5 }}>
            {loading ? "" : "100"}
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
  <div className="list-filter">
    <div className="row">
      {this.renderFooterProduct()}
    </div>
  </div>








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