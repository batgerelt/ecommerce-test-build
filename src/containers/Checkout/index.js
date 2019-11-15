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
  getOrderDetail: state.profile.getOrderDetail,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CheckoutModel,
    ...UserModel,
    ...CartModel,
    ...ProfileModel,
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

  getData = async () => {
    this.props.getPaymentTypes();
    await this.props.getDeliveryTypes();
    this.props.getBankInfo();
    if (localStorage.getItem("auth") !== null) {
      await this.props.getUserInfo().then((res) => {
        this.setState({ loading: false });
      });
      this.props.getSystemLocation();
      /* this.props.getEpointCardInfo().then((res) => {
        console.log(res);
      }); */
    } else {
      this.setState({ loading: false });
    }
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
