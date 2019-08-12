import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginModal } from "../../components/Login";
import {
  Auth as AuthModel,
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Cart as CartModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getNewMenu({});
    this.props.getNewBanner();
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Page));
