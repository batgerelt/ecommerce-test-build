import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from "antd";

import {
  Category as CategoryModel,
  Brand as BrandModel,
  Banner as BannerModel,
  Product as ProductModel,
} from "../../models";
import { Loader } from "../../components";
import Home from "./list";

const mapStateToProps = state => ({
  ...state.brand,
  ...state.category,
  ...state.banner,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CategoryModel,
    ...BrandModel,
    ...BannerModel,
    ...ProductModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    iscat: true,
    isbrand: true,
    isbanner: true,
    emartprod: true,
  }

  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд  */
  componentWillMount() {
    this.props.getCategoryMenu().then(res => this.setState({ iscat: false })); // Menu-ийн өгөгдөл авах хүсэлт
    this.props.getBrand().then(res => this.setState({ isbrand: false })); // Brand-ийн өгөгдөл авах хүсэлт
    // this.props.getEmartProduct({
    //   jumcd: "99", startWith: 0, rowCount: 10, orderCol: "price_asc",
    // }).then(res => this.setState({ emartprod: false }));
  }

  render() {
    const { iscat, isbrand } = this.state;

    return (
      <Spin spinning={iscat || isbrand} indicator={<Loader />}>
        {iscat || isbrand ? <div /> : <Home {...this.props} {...this.state} /> }
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
