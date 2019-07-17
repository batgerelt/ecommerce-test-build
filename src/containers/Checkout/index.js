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
} from "../../models";
import List from "./list";
import { Loader } from "../../components";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.checkout,
  ...state.user,
  ...state.cart,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CheckoutModel,
    ...UserModel,
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    loading: true,
  }
  componentWillMount() {
    let auth = JSON.parse(localStorage.getItem("auth"));
    this.props.getPaymentTypes();
    this.props.getDeliveryTypes();
    this.props.getBankInfo();
    if (auth !== null && auth !== undefined) {
      this.props.getUserInfo({ custid: auth.data[0].info.id }).then((res) => {
        this.setState({ loading: false });
      });
      this.props.getSystemLocation();
      this.props.getEpointCardInfo().then((res) => {
        console.log(res);
      });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <Spin
        spinning={loading}
        indicator={<Loader />}
      >
        <List {...this.props} />
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
