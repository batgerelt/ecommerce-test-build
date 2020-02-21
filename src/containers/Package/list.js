/* eslint-disable brace-style */
/* eslint-disable arrow-body-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
import { injectIntl } from 'react-intl';
import { BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import windowSize from 'react-window-size';
import Helmet from "react-helmet";
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

let ITEM_HEIGHT = 620;
let count = 8;

class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = { headerProducts: [] };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.getPackageScroll({ order: "date_desc", start: count, rowcnt: 8 });
    window.scrollTo(0, 0);
  }

  renderHelmet = () => {
    const { menuPackage, intl } = this.props;
    return (
      <Helmet>
        {/* HTML META TAGS */}
        <title>{intl.locale === "mn" ? menuPackage.menunm : menuPackage.menunm_en}</title>
        <meta name="description" content={intl.locale === "mn" ? menuPackage.subtitle : menuPackage.subtitle_en} />
        <meta name="keywords" content="emartmall,emart,ecommerce,shopping,e-mart,имарт,шинэ,new" />
        <meta name="url" content={window.location.href} />

        {/* FACEBOOK SHARE META TAGS */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={intl.locale === "mn" ? menuPackage.menunm : menuPackage.menunm_en} />
        <meta property="og:description" content={intl.locale === "mn" ? menuPackage.subtitle : menuPackage.subtitle_en} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://api.emartmall.mn/Resource/emartmall.png" />

        {/* TWITTER SHARE META TAGS */}
        <meta name="twitter:site" content={window.location.href} />
        <meta name="twitter:title" content={intl.locale === "mn" ? menuPackage.menunm : menuPackage.menunm_en} />
        <meta name="twitter:description" content={intl.locale === "mn" ? menuPackage.subtitle : menuPackage.subtitle_en} />
      </Helmet>
    );
  }

  renderHeaderProduct = () => {
    try {
      const { widgetAll } = this.props;
      return (
        <div className="package" style={{ paddingTop: '20px' }}>
          <div className="container pad10">
            {
              <CardList
                cardListType={CARD_LIST_TYPES.horizontal}
                seq={widgetAll.find(i => i.slug === "package").type}
                items={this.props.packageAll.slice(0, 8)}
                {...this.props}
              />
            }
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderSubBanner = () => {
    try {
      return (<Banner data={this.props.banner.footer} />);
    } catch (error) {
      return null;
    }
  };

  loadMoreRows = async () => {
    count += 8;
    await this.props.getPackageScroll({ order: "date_desc", start: count, rowcnt: 8 });
  };

  noRowsRenderer = () => null

  generateItemHeight = (item, width) => {
    // try {
    //   const { packageScroll } = this.props;
    //   if (packageScroll[item.index].length <= 3) {
    //     return 326.5;
    //   }
    //   if (width >= 300 && width < 390) {
    //     return 1870.06;
    //   }

    //   if (width >= 390 && width < 480) {
    //     return 2400;
    //   }
    //   if (width <= 752) {
    //     return 2869.5;
    //   }
    //   return ITEM_HEIGHT;
    // } catch (error) {
    //   return console.log(error);
    // }

    let tmp;

    const { windowWidth } = this.props;

    // iPhone 5/SE
    if (windowWidth < 321) {
      tmp = 1825;
    }
    // iPhone 6/7/8
    else if (windowWidth < 376) {
      tmp = 2025;
    }
    // iPhone 6/7/8 Plus
    else if (windowWidth < 415) {
      tmp = 2170;
    }
    // mobile (horizontal)
    else if (windowWidth < 576) {
      tmp = 2735;
    } else if (windowWidth < 768) {
      tmp = 1600;
    } else if (windowWidth < 992) {
      tmp = 1350;
    } else if (windowWidth < 1200) {
      tmp = 1060;
    } else {
      tmp = 655;
    }

    return tmp;
  }

  renderFooterProduct = () => {
    try {
      const { packageScroll, widgetAll } = this.props;
      return (
        <div className="package">
          <div className="container pad10 package-list">
            <AutoSizer disableHeight>
              {({ width }) => {
                return (
                  <InfiniteLoader
                    ref={this.infiniteLoaderRef}
                    rowCount={packageScroll.length}
                    isRowLoaded={(index) => {
                      return !!packageScroll[index];
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
                            rowCount={packageScroll.length}
                            rowHeight={index => this.generateItemHeight(index, width)}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({ index, style, key }) => {
                              return (
                                <div style={style} key={key} className="jss149">
                                  <CardList
                                    cardListType={CARD_LIST_TYPES.horizontal}
                                    seq={widgetAll.find(i => i.slug === "package").type}
                                    items={packageScroll[index]}
                                    second
                                    {...this.props}
                                  />
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
    const { banner } = this.props;
    return (
      <div className="top-container top-container-responsive package-container">
        {this.renderHelmet()}
        <PageBanner banner={banner.header} />
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default windowSize(injectIntl(Discount));
