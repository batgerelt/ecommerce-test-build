/* eslint-disable arrow-body-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import React from "react";
import { BackTop } from "antd";
import {
  InfiniteLoader,
  WindowScroller,
  List,
  AutoSizer,
} from "react-virtualized";
import { CardList, Banner, PageBanner, Card } from "../../components";
import { CARD_LIST_TYPES } from "../../utils/Consts";

let ITEM_HEIGHT = 660;
class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      headerProducts: [],
      packagebanner: [],
    };
  }

  componentWillMount() {
    try {
      this.props.getPackageScroll({
        order: "date_desc",
        start: this.props.packageCount,
        rowcnt: 8,
      });
    } catch (error) {
      return console.log(error);
    }
  }

  componentDidMount() {
    try {
      const selected = this.props.packagebanner.footer[Math.floor(Math.random() * this.props.packagebanner.footer.length)];
      this.setState({ packagebanner: selected });
    } catch (error) {
      return console.log(error);
    }
  }

  renderMainBanner = () => {
    try {
      const { packagebanner, menuPackage } = this.props;
      return (
        <PageBanner
          title={menuPackage.menunm}
          subtitle={menuPackage.subtitle}
          banners={packagebanner.length === 0 ? [] : packagebanner.header}
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
        <div className="package" style={{ paddingTop: '10px' }}>
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

  /* componentDidUpdate(prevProps) {
    if (this.props.packagebanner.length !== prevProps.packagebanner.length) {
      const selected = this.props.packagebanner.footer[Math.floor(Math.random() * this.props.packagebanner.footer.length)];
      this.setState({ packagebanner: selected });
    }
  } */

  renderSubBanner = () => {
    try {
      const { packagebanner } = this.state;
      return (
        <Banner data={packagebanner} />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  loadMoreRows = async (key) => {
    try {
      setTimeout(() => {
        this.props.getPackageScroll({
          order: "date_desc",
          start: this.props.packageCount,
          rowcnt: 8,
        });
      }, 1000);
    } catch (error) {
      return console.log(error);
    }
  };

  noRowsRenderer = () => <div>No data</div>;

  generateItemHeight = (item, width) => {
    try {
      const { packageScroll } = this.props;
      if (packageScroll[item.index].length <= 3) {
        return 306.5;
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
        <div className="section">
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

export default Discount;
