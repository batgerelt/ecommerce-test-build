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
import { injectIntl } from 'react-intl';
import { BackTop } from "antd";
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Banner, PageBanner, Loader } from "../../components";
import { CARD_TYPES } from "../../utils/Consts";

let count = 10;
class Discount extends React.Component {
  infiniteLoaderRef = React.createRef();
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
      module: 'discount',
      startsWith: 0,
      rowCount: 10,
      orderColumn: 'catid_desc',
      highlight: false,
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    this.props.getDiscountProducts({ body: { ...this.state } }).then((res) => {
      if (res.payload.success && res.payload.data) {
        this.setState({
          headerProducts: res.payload.data.hits.hits,
          rowCount: 20,
          total: res.payload.data.hits.total.value,
        });
      }
    });
  }

  loadMoreRows = () => {
    let self = this;
    let { products } = this.state;
    this.props.getDiscountProducts({ body: { ...this.state, startsWith: count } })
      .then((res) => {
        res.payload.data.hits.hits.map(i => products.push(i._source));
        self.setState({ products });
      });
  }

  renderMainBanner = () => {
    try {
      const { banner, menuDiscount, intl } = this.props;
      return menuDiscount[0] && (
        <PageBanner
          title={intl.locale === "mn" ? menuDiscount[0].menunm : menuDiscount[0].menunm_en}
          subtitle={intl.locale === "mn" ? menuDiscount[0].subtitle : menuDiscount[0].subtitle_en}
          banners={banner.length === 0 ? [] : banner.header}
          bgColor="#EF3340"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderHeaderProduct = () => {
    try {
      const { headerProducts } = this.state;
      const data = [];

      headerProducts.map(i => data.push(i._source));
      return (
        <div className="container pad10" style={{ paddingTop: '20px' }}>
          <div className="row row10">
            {
              headerProducts.map((item, i) => (
                <Card
                  isDiscount
                  elastic
                  key={i}
                  shape={CARD_TYPES.slim}
                  item={item._source}
                  {...this.props}
                />
              ))
            }
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  renderSubBanner = () => {
    try {
      return <Banner data={this.props.banner.footer} />;
    } catch (error) {
      // return console.log(error);
      return null;
    }
  };

  loadItems = () => {

  }

  renderFooterProduct = () => {
    try {
      const { products } = this.state;
      console.log('products: ', products);
      let items = [];
      products.map((i, index) => items.push(
        <Card
          elastic
          key={index}
          shape={CARD_TYPES.slim}
          item={i}
          {...this.props}
        />,
      ));

      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMoreRows}
          hasMore={!this.props.isFetchingDiscount}
          // loader={<div className="d-flex justify-content-center">loading...</div>}
          threshold={500}
        >
          <div className="container pad10 discount-list">
            <div className="row row10">
              {items}
            </div>
          </div>
        </InfiniteScroll>

      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return (
      <div className="top-container top-container-responsive discount-container">
        {this.props.menuDiscount === undefined ? null : this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
        <BackTop />
      </div>
    );
  }
}

export default injectIntl(Discount);
