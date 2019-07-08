import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Cart as CartModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getDiscountProduct({});
    this.props.getDiscountBanner();
    this.props.getDiscountMenu({});
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
