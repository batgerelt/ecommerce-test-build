import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Filter as FilterModel,
  Cart as CartModel,
  Auth as AuthModel,
  Search as SearchModel,
} from "../../models";
import { Loader } from "../../components";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.filter,
  ...state.cart,
  ...state.auth,
  ...state.search,
  ...state.category,
  ...state.attribute,
  ...state.brand,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...FilterModel,
    ...CartModel,
    ...AuthModel,
    ...SearchModel,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [] } }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { banner } = this.state;
    this.props.getSeasonBanner().then((res) => {
      banner.header = res.payload.data.header;
      return this.setState(banner);
    });
    this.props.getSeasonMenu({});
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} isLoggedIn={localStorage.getItem('auth') !== null} banner={this.state.banner} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
