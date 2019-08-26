import React from 'react';
import { connect } from 'react-redux';
import CryptoJS from "crypto-js";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Profile as ProfileModel,
} from "../../models";
import List from "./list";
import { EncryptKey } from "../../utils/Consts";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ...ProfileModel,
  }, dispatch),
});

class OrderDetail extends React.Component {
  componentWillMount() {
    let id = this.props.match.params.id.toString().replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '=');
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
