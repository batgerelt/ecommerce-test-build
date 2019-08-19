import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  Cart as CartModel,
  Auth as AuthModel,
  Static as StaticModel,
  Profile as ProfileModel,
  Product as ProductModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.cart,
  ...state.staticcontent,
  ...state.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...AuthModel,
      ...CartModel,
      ...StaticModel,
      ...ProfileModel,
      addWishList: ProductModel.addWishList,
      removeAddedWishColor: ProductModel.removeAddedWishColor,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    try {
      if (this.props.isLogged) {
        this.props.getProducts(this.props.data[0].info.customerInfo.id);
        this.props.getWishByCount({ count: 5 });
        this.props.getStaticInfo();
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
