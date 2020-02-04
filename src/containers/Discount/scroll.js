/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-danger */
import React, { useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { InfiniteLoader, WindowScroller, List, AutoSizer } from "react-virtualized";
import {
  Discount as DiscountModel,
  Banner as BannerModel,
  Menu as MenuModel,
  Cart as CartModel,
  Auth as AuthModel,
  Locale as LocaleModel,
} from "../../models";
import { SkeltonCard, Banner, PageBanner, FiveCard, Loader } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

function emartMallScroll(props) {
  console.log('props: ', props);
  const itemsInRow = window.innerWidth < 768 ? 2 : window.innerWidth < 1200 ? 4 : 5;
  const params = {
    catId: 0,
    custId: 0,
    value: '',
    attribute: "",
    color: "",
    brand: "",
    promotion: "",
    minPrice: 0,
    maxPrice: 0,
    module: 'discount',
    startsWith: 0,
    rowCount: 20,
    orderColumn: 'catid_desc,rate_desc',
    highlight: false,
  };

  useEffect(() => {
    props.getDiscountProducts();
  }, []);

  const { discountproducts, discountproductTotal, isFetchingDiscount } = props;
  return (
    <div className="container pad10 discount-list">
      <div className="row row10">
        <AutoSizer disableHeight >
          {({ width }) => {
                const rowCount = Math.ceil(discountproducts.length / itemsInRow + (discountproductTotal === 0 ? 1 : discountproductTotal !== discountproducts.length ? 1 : 0));
                return (
                  <InfiniteLoader
                    rowCount={rowCount}
                    isRowLoaded={({ index }) => !!discountproducts[index * itemsInRow] || false}
                    loadMoreRows={() => props.getDiscountProducts({ body: { ...params, startsWith: props.discountproductCount } })}
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
                            rowCount={rowCount}
                            rowHeight={375}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={({
                              index, style, key, isVisible,
                            }) => (
                              <div style={style} key={key} className="emartmall-scroll-list">
                                {console.log('height, scrollTop: ', height, scrollTop)}
                                {
                                            discountproducts.slice(index * itemsInRow, (index * itemsInRow) + itemsInRow).map(i => (
                                            //   <h1>{i.skucd}</h1>
                                              <FiveCard
                                                elastic
                                                isVisible={isVisible}
                                                key={i.skucd}
                                                shape={CARD_TYPES.slim}
                                                item={i}
                                                {...props}
                                              />
                                  ))
                                }
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
}

// map state to props
const mapStateToProps = state => ({
  ...state.discount,
  ...state.menu,
  ...state.cart,
  ...state.auth,
  ...state.locale,
  ...state.search,
});

// dispatch to props
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...DiscountModel,
    ...BannerModel,
    ...MenuModel,
    ...CartModel,
    ...AuthModel,
    ...LocaleModel,
  }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(emartMallScroll));
