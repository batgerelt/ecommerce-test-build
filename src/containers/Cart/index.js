import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoginModal } from "../../components/Login";

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
      ...ProductModel,
      // addWishList: ProductModel.addWishList,
      // getProduct: ProductModel.getProductDetail,
      removeAddedWishColor: ProductModel.removeAddedWishColor,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    try {
      if (localStorage.getItem('auth') !== null) {
        this.props.getProducts(this.props.data[0].info.customerInfo.id);
        this.props.getWishByCount({ count: 6 });
        this.props.getStaticInfo();
      } else {
        // const { products } = this.props;
        // products.forEach(async (prod) => {
        //   const result = await this.props.getProductDetail({ skucd: prod.skucd });
        //   let product = result.payload.data.products;
        //   product.qty = prod.qty;
        //   product.insymd = prod.insymd;
        //   this.props.updateProductLocally(product);
        // });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} isLoggedIn={localStorage.getItem('auth') !== null} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
