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
  ...state.product,
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
    category: true,
    brand: true,
    banner: true,
    emart: true,
    discount: true,
  }

  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд  */
  componentWillMount() {
    this.props.getCategoryMenu().then(r => this.setState({ category: false })); // Menu-ийн өгөгдөл авах хүсэлт
    this.props.getBrand().then(r => this.setState({ brand: false })); // Brand-ийн өгөгдөл авах хүсэлт
    this.props.getEmartProduct({ }).then(r => this.setState({ emart: false }));
    this.props.getDiscountProduct({ }).then(r => this.setState({ discount: false }));
  }

  render() {
    const { category, brand } = this.state;

    return (
      <Spin spinning={category || brand} indicator={<Loader />}>
        <Home {...this.props} {...this.state} />
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
