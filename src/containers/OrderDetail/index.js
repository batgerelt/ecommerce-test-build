import React from 'react';
import { connect } from 'react-redux';
import CryptoJS from "crypto-js";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Cart as CartModel,
} from "../../models";
import List from "./list";
import { EncryptKey } from "../../utils/Consts";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ...ProfileModel,
    ...CartModel,
  }, dispatch),
});

class OrderDetail extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    let id = this.props.match.params.id.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
    let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);
    this.props.getOrderDetail({ ordid: plaintext });
  }

  render() {
    if (localStorage.getItem('auth') !== null) {
      return <List {...this.props} />;
    }
    return <Redirect to="/" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
