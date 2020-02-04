/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable import/first */
/* eslint-disable radix */
import React, { PureComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import { BackTop } from "antd";
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import Helmet from "react-helmet";

import { SkeltonCard, FiveCard, PageBanner, Banner } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5;

class Bookmarks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      fetch: false,
      headerProducts: [],
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
      module: "new",
      startsWith: 0,
      rowCount: 20,
      orderColumn: "startnew_desc,endnew_asc,updatedate_desc",
      highlight: false,
      total: 0,
    };
  }

  componentDidMount() {
  }

  renderHelmet = () => {
    const { menuNew, intl } = this.props;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>{intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en}</title>
        <meta name="description" content={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en} />
        <meta name="keywords" content="emartmall,emart,ecommerce,shopping,e-mart,имарт,шинэ,new" />
        <meta name="url" content={window.location.href} />

        {/* FACEBOOK SHARE META TAGS */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en} />
        <meta property="og:description" content={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://api.emartmall.mn/Resource/emartmall.png" />

        {/* TWITTER SHARE META TAGS */}
        <meta name="twitter:site" content={window.location.href} />
        <meta name="twitter:title" content={intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en} />
        <meta name="twitter:description" content={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en} />
      </Helmet>
    );
  }

  loadMoreRows = () => this.props.getNewProducts({ body: { ...this.state, startsWith: this.props.newproductCount } });

  noRowsRenderer = () => null;

  renderMainBanner = () => {
    try {
      const { banner, menuNew, intl } = this.props;
      return (
        <PageBanner
          className="newpagetitlebanner"
          title={intl.locale === "mn" ? menuNew.menunm : menuNew.menunm_en}
          subtitle={intl.locale === "mn" ? menuNew.subtitle : menuNew.subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#00A1E4"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

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

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  };

  // нэг мөр хоосон харагдаад байсан тул skelton харуулав
  // skelton нь нэг мөр харагдана mobile(2 card) tablet(4 card) desktop(5 card) etc...
  renderSkeltonCard = () => {
    let result = [];
    for (let i = 0; i < itemsInRow; i++) { result.push(<SkeltonCard key={i} />); }
    return result;
  }

  renderFooterProduct = () => {
    try {
      const { newproducts, isFetchingnew, newproductTotal } = this.props;
      return (
        <div className="container pad10 discount-list">
          <div className="row row10">
            <AutoSizer disableHeight >
              {({ width }) => {
                const rowCount = Math.ceil(newproducts.length / itemsInRow + (newproductTotal === 0 ? 1 : newproductTotal !== newproducts.length ? 1 : 0));
                // console.log('rowCount: ', rowCount);
                return (
                  <InfiniteLoader
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => newproducts[index * itemsInRow]}
                    loadMoreRows={() => this.loadMoreRows()}
                    threshold={1}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <WindowScroller className="newPageWindowScroller">
                        {({ height, scrollTop, isScrolling }) => (
                          <List
                            style={{ outline: "none" }}
                            autoHeight
                            ref={registerChild}
                            height={height}
                            isScrolling={isScrolling}
                            width={width}
                            scrollTop={scrollTop}
                            rowCount={rowCount}
                            rowHeight={() => this.generateItemHeight()}
                            noRowsRenderer={this.noRowsRenderer}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => (
                              <div style={style} key={key} className="emartmall-scroll-list">
                                {console.log(scrollTop, index)}
                                {
                                  newproducts.slice(index * itemsInRow, (index * itemsInRow) + itemsInRow).map(i => (
                                    <FiveCard
                                      elastic
                                      isVisible={isVisible}
                                      key={i.skucd}
                                      shape={CARD_TYPES.slim}
                                      item={i}
                                      {...this.props}
                                    />
                                  ))
                                  }
                                {isFetchingnew && <React.Fragment>{this.renderSkeltonCard()}</React.Fragment>}
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

  render() {
    return (
      <div className="top-container newproduct-container">
        {this.renderHelmet()}
        {this.renderMainBanner()}
        {/* {this.renderHeaderProduct()} */}
        {/* {this.renderSubBanner()} */}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Bookmarks);
