/* eslint-disable brace-style */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
import React from "react";
import { injectIntl } from 'react-intl';
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
// import InfiniteScroll from 'react-infinite-scroller';
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

  renderMainBanner = () => {
    try {
      const { banner, menuRecipe, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuRecipe[0].menunm : menuRecipe[0].menunm_en}
          subtitle={intl.locale === "mn" ? menuRecipe[0].subtitle : menuRecipe[0].subtitle_en}
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
    // const { recipeScroll } = this.props;
    // if (width >= 340 && width < 500) {
    //   return 2475;
    // }
    // if (recipeScroll[item.index].length <= 3) {
    //   return 306.5;
    // }
    // return ITEM_HEIGHT;

    let tmp;

    const { windowWidth } = this.props;

    // iPhone 5/SE
    if (windowWidth < 321) {
      tmp = 2360;
    }
    // iPhone 6/7/8
    else if (windowWidth < 376) {
      tmp = 2655;
    }
    // iPhone 6/7/8 Plus
    else if (windowWidth < 415) {
      tmp = 2865;
    }
    // mobile (horizontal)
    else if (windowWidth < 576) {
      tmp = 3700;
    } else if (windowWidth < 768) {
      tmp = 535;
    } else if (windowWidth < 992) {
      tmp = 645;
    } else if (windowWidth < 1200) {
      tmp = 795;
    } else {
      tmp = 900;
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
                                <div style={style} key={key} className="jss149">
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
      <div className="top-container top-container-responsive">
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
