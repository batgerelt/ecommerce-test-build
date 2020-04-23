import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Banner as BannerModel,
  Menu as MenuModel,
  Cart as CartModel,
  Auth as AuthModel,
  Locale as LocaleModel,
  Deal,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
  ...state.auth,
  ...state.locale,
  ...state.search,
  ...state.deal,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...MenuModel,
    ...CartModel,
    ...AuthModel,
    ...LocaleModel,
    ...Deal,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [], footer: [] } }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentDidMount() {
    // Хандалт бүрт санамсаргүйгээр харуулж байгаа ба setState хийх үед солигдоод байсныг нь энд оруулав
    this.props.getDiscountMenu({});
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this.state} {...this} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
