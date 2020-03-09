/* eslint-disable camelcase */
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
  state = {
    banner: [],
    loading: false,
    promotid: null,
  }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  // eslint-disable-next-line camelcase
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
      console.log(this.props);
      if (res.payload.success) {
        if (res.payload.data !== null) {
          let tmp = [];
          tmp.push(res.payload.data);
          this.setState({ banner: tmp });
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
