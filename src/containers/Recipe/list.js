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
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";

const ITEM_HEIGHT = 900;
class Recipe extends React.Component {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      headerProducts: [],
      recipebanner: [],
    };
  }

  renderMainBanner = () => {
    try {
      const { recipebanner, menuRecipe, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuRecipe.menunm : menuRecipe.menunm_en}
          subtitle={intl.locale === "mn" ? menuRecipe.subtitle : menuRecipe.subtitle_en}
          banners={recipebanner.length === 0 ? [] : recipebanner.header}
          bgColor="#F2769B"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };
  componentWillMount() {
    this.props.getRecipeScroll({
      order: "date_desc",
      start: this.props.recipeCount,
      rowcnt: 6,
    });
  }

  loadMoreRows = (key) => {
    try {
      setTimeout(() => {
        this.props.getRecipeScroll({
          order: "date_desc",
          start: this.props.recipeCount,
          rowcnt: 6,
        });
      }, 1000);
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  renderHeaderProduct = () => {
    try {
      const { recipeAll } = this.props;
      let tmp = recipeAll.slice(0, 6);
      return (
        <div style={{ paddingTop: '10px' }}>
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
    const { recipeScroll } = this.props;
    if (recipeScroll[item.index].length <= 3) {
      return 306.5;
    }
    return ITEM_HEIGHT;
  }

  componentDidUpdate(prevProps) {
    if (this.props.recipebanner.length !== prevProps.recipebanner.length) {
      const selected = this.props.recipebanner.footer[Math.floor(Math.random() * this.props.recipebanner.footer.length)];
      this.setState({ recipebanner: selected });
    }
  }

  renderSubBanner = () => {
    try {
      const { recipebanner } = this.state;
      return (
        <Banner data={recipebanner} />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderFooterProduct = () => {
    try {
      const { recipeScroll } = this.props;
      return (
        <div className="section">
          <div className="container pad10">
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

export default injectIntl(Recipe);
