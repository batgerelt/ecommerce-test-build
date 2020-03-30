/* eslint-disable camelcase */
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import {
  DynamicMenu as DynamicMenuModel,
  Banner as BannerModel,
  Category as CategoryModel,
  Filter as FilterModel,
  Cart as CartModel,
  Auth as AuthModel,
  Product as ProductModel,
  Search as SearchModel,
  Menu as MenuModel,
} from "../../models";
import List from "./list";
import { Loader } from "../../components";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.dynamicmenu,
  ...state.banner,
  ...state.category,
  ...state.filter,
  ...state.cart,
  ...state.auth,
  ...state.product,
  ...state.search,
  ...state.menu,
  ...state.brand,
  ...state.attribute,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...DynamicMenuModel,
    ...MenuModel,
    ...BannerModel,
    ...CategoryModel,
    ...FilterModel,
    ...CartModel,
    ...AuthModel,
    ...ProductModel,
    ...SearchModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    banner: [],
    loading: false,
    promotid: null,
  }

  UNSAFE_componentWillMount() {
    this.getData(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getData(nextProps.match.params.id);
    }
  }

  getData = (id) => {
    this.setState({ loading: true, promotid: null });
    this.props.getDynamicBanner({ id }).then((res) => {
      if (res.payload.success) {
        if (res.payload.data !== null) {
          let tmp = [];
          tmp.push(res.payload.data);
          this.setState({ banner: tmp });
        } else {
          this.setState({ banner: [] });
        }
      }
    });
    this.props.getSeasonMenu({ id }).then((res) => {
      this.setState({ loading: false, promotid: res.payload.data[0].promotid });
    });
  }

  render() {
    return (
      <Spin
        spinning={this.state.loading}
        indicator={<Loader />}
      >
        {this.state.promotid !== null ?
          <List {...this.props} {...this} promotid={this.state.promotid} isLoggedIn={localStorage.getItem('auth') !== null} banner={this.state.banner} />
          : ""}
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </Spin>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
