import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Cart as CartModel,
  Auth as AuthModel,
  Static as StaticModel,
  Profile as ProfileModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.cart,
  ...state.static,
  ...state.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CartModel,
    ...StaticModel,
    ...ProfileModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    try {
      // if (this.props.isLogged) {
      //   this.props.getProducts(this.props.data[0].info.customerInfo.id);
      // } else {
      //   let cart = {};
      //   let products = [];

      //   let serializedCart = localStorage.getItem('cart');
      //   if (serializedCart !== null) {
      //     cart = JSON.parse(serializedCart);
      //     ({ products } = cart);
      //   }

      //   console.log(this.props);
      //   // this.props.products = products;
      // }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
