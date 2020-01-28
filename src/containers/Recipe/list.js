/* eslint-disable no-unused-expressions */
/* eslint-disable brace-style */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
import React from "react";
import Helmet from "react-helmet";
import { injectIntl } from 'react-intl';
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { BackTop } from "antd";
import windowSize from 'react-window-size';
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";

const ITEM_HEIGHT = 870;
let count = 6;

class Recipe extends React.Component {
  infiniteLoaderRef = React.createRef();
  state = { headerProducts: [], loading: false, data: [] };

  componentWillMount() {
    this.props.getRecipeScroll({ order: "date_desc", start: count, rowcnt: 6 });
    window.scrollTo(0, 0);
  }

  renderHelmet = () => {
    const { menuRecipe, intl } = this.props;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>{intl.locale === "mn" ? menuRecipe.menunm : menuRecipe.menunm_en}</title>
        <meta name="description" content={intl.locale === "mn" ? menuRecipe.subtitle : menuRecipe.subtitle_en} />
        <meta name="keywords" content="emartmall,emart,ecommerce,shopping,e-mart,имарт,шинэ,new" />
        <meta name="url" content={window.location.href} />

        {/* FACEBOOK SHARE META TAGS */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={intl.locale === "mn" ? menuRecipe.menunm : menuRecipe.menunm_en} />
        <meta property="og:description" content={intl.locale === "mn" ? menuRecipe.subtitle : menuRecipe.subtitle_en} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://api.emartmall.mn/Resource/emartmall.png" />

        {/* TWITTER SHARE META TAGS */}
        <meta name="twitter:site" content={window.location.href} />
        <meta name="twitter:title" content={intl.locale === "mn" ? menuRecipe.menunm : menuRecipe.menunm_en} />
        <meta name="twitter:description" content={intl.locale === "mn" ? menuRecipe.subtitle : menuRecipe.subtitle_en} />
      </Helmet>
    );
  }

  renderMainBanner = () => {
    try {
      const { banner, menuRecipe, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuRecipe.menunm : menuRecipe.menunm_en}
          subtitle={intl.locale === "mn" ? menuRecipe.subtitle : menuRecipe.subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#F2769B"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      return (<Banner data={this.props.banner.footer} style={{ marginBottom: '20px' }} />);
    } catch (error) {
      return null;
    }
  };

  loadMoreRows = async () => {
    count += 6;
    await this.props.getRecipeScroll({ order: "date_desc", start: count, rowcnt: 6 });
  };

  noRowsRenderer = () => null

  renderHeaderProduct = () => {
    try {
      const { recipeAll } = this.props;
      let tmp = recipeAll.slice(0, 6);
      return (
        <div style={{ paddingTop: '20px' }}>
          <div className="container pad10">
            {tmp.length >= 6 ?
              (
                <CardList
                  cardListType={CARD_LIST_TYPES.vertical}
                  shape={3}
                  items={tmp}
                  {...this.props}
                />
              ) : (
                <CardList
                  shape={2}
                  cardListType={CARD_LIST_TYPES.horizontal}
                  items={tmp}
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

  generateItemHeight = (item, width) => {
    let tmp;
    const { windowWidth } = this.props;
    switch (windowWidth) {
      case windowWidth < 321:
        tmp = 2360;
        break;
      case windowWidth < 376:
        tmp = 2655;
        break;
      case windowWidth < 415:
        tmp = 2865;
        break;
      case windowWidth < 576:
        tmp = 3700;
        break;
      case windowWidth < 768:
        tmp = 535;
        break;
      case windowWidth < 992:
        tmp = 645;
        break;
      case windowWidth < 1200:
        tmp = 795;
        break;
      default:
        tmp = 900;
        break;
    }
    return tmp;
  }

  renderFooterProduct = () => {
    try {
      const { recipeScroll } = this.props;
      return (
        <div className="section">
          <div className="container pad10 recipe-list">
            <AutoSizer disableHeight>
              {({ width }) => {
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={recipeScroll.length}
                    isRowLoaded={(index) => {
                      return !!recipeScroll[index];
                    }}
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
                            rowCount={recipeScroll.length}
                            rowHeight={index => this.generateItemHeight(index, width)}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({ index, style, key }) => {
                              return (
                                <div style={style} key={key} className="">
                                  {recipeScroll[index].length >= 6 ?
                                    (
                                      <CardList
                                        cardListType={CARD_LIST_TYPES.vertical}
                                        shape={3}
                                        items={recipeScroll[index]}
                                        {...this.props}
                                      />
                                    ) : (
                                      <CardList
                                        shape={2}
                                        cardListType={CARD_LIST_TYPES.horizontal}
                                        items={recipeScroll[index]}
                                        {...this.props}
                                      />
                                    )}
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
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return (
      <div className="top-container top-container-responsive recipe-container">
        {this.renderHelmet()}
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default windowSize(injectIntl(Recipe));
