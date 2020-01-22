/**
 * @author Ariunkhuslen
 * @email ga.ariuka27@gmail.com
 * @create date 2020-01-08 14:46:04
 * @modify date 2020-01-08 14:46:04
 * @desc [description]
 */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-danger */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from "antd";
import {
  Auth as AuthModel,
  Checkout as CheckoutModel,
  User as UserModel,
  Cart as CartModel,
  Profile as ProfileModel,
  Static as StaticModel,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";
import { ForgetModal } from "../../components/ForgetModal";
import { Loader } from "../../components";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.checkout,
  ...state.user,
  ...state.cart,
  ...state.staticcontent,
  getOrderDetail: state.profile.getOrderDetail,
  epointCardInfo: state.profile.epointCardInfo,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CheckoutModel,
    ...UserModel,
    ...CartModel,
    ...ProfileModel,
    ...StaticModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    loading: true,
    loadingType: true,
  }
  componentWillMount() {
    this.getData();
  }

  getData = () => {
    console.log("this.props", this.props);
    let skus = [];
    this.props.products.map((ind) => {
      console.log(ind.skucd);
    });
    const param = {
      typeid: "1",
      deliveryDate: "2020-01-22T01:29:33.381Z",
      locid: this.props.userInfo.main.locid,
      orderAmount: 205,
      skucdList: [
        "8656170005332",
      ],
    };
    this.props.getPaymentTypes();
    this.props.getDeliveryTypes();
    this.props.getBankInfo();
    if (localStorage.getItem("auth") !== null) {
      this.props.getUserInfo().then(() => {
        this.props.getSystemLocation().then(() => {
          this.setState({ loading: false });
        });
      });
    } else {
      this.setState({ loading: false });
    }
    /* this.props.getDeliveryPrice({ body: { ...param } }).then((res) => {
      console.log("res", res);
    }); */
    console.log(this.props);
  }

  render() {
    const { loading, loadingType } = this.state;
    return (
      <Spin
        spinning={loading}
        indicator={<Loader />}
      >
        {
          !loading ?
            <List {...this.props} loading={loading} LoginModal={this.LoginModal} ForgetModal={this.ForgetModal} isLoggedIn={localStorage.getItem('auth') !== null} />
            : null
        }
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} {...this} />
        <ForgetModal onRef={ref => (this.ForgetModal = ref)} {...this.props} />
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
