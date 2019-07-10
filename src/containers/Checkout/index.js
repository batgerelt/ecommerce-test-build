/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-danger */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Checkout as CheckoutModel,
  User as UserModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.checkout,
  ...state.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CheckoutModel,
    ...UserModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    loading: false,
  }
  componentWillMount() {
    let auth = JSON.parse(localStorage.getItem("auth"));
    this.props.getPaymentTypes();
    this.props.getDeliveryTypes();
    this.props.getBankInfo();
    if (auth !== null) {
      this.props.getUserInfo({ custid: auth.customerInfo.id });
      this.props.getSystemLocation();
    }
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
