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
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

let ITEM_HEIGHT = 620;
class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = { headerProducts: [] };
  }

  componentWillMount() { window.scrollTo(0, 0); }

  renderMainBanner = () => {
    try {
      const { banner, menuPackage, intl } = this.props;
      return (
        <PageBanner
          title={intl.locale === "mn" ? menuPackage.menunm : menuPackage.menunm_en}
          subtitle={intl.locale === "mn" ? menuPackage.subtitle : menuPackage.subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#8CBD3F"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

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

  loadMoreRows = async (key) => {
    try {
      this.props.getPackageScroll({
        order: "date_desc",
        start: this.props.packageCount,
        rowcnt: 8,
      });
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => null

  generateItemHeight = (item, width) => {
    try {
      const { packageScroll } = this.props;
      if (packageScroll[item.index].length <= 3) {
        return 326.5;
      }
      if (width >= 300 && width < 390) {
        return 1850.06;
      }

      if (width >= 390 && width < 480) {
        return 2400;
      }
      if (width <= 752) {
        return 2869.5;
      }
      return ITEM_HEIGHT;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { packageScroll, widgetAll } = this.props;
      return (
        <div className="package" style={{ paddingTop: '20px' }}>
          <div className="container pad10">
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

export default injectIntl(Discount);
