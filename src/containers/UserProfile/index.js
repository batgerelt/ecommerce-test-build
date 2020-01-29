/**
 * @author Ariunkhuslen
 * @email ga.ariuka27@gmail.com
 * @create date 2020-01-08 13:44:46
 * @modify date 2020-01-08 13:44:46
 * @desc [description]
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from "react-router-dom";
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Cart as CartModel,
  User as UserModel,
} from "../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.cart,
  clearUserModelState: state.user.clearUserModelState,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...ProfileModel,
    ...CartModel,
    ...UserModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  componentWillMount() {
    if (localStorage.getItem('auth') !== null) {
      this.props.getCustomer();
    }
  }

  render() {
    if (localStorage.getItem('auth') !== null) {
      return <List {...this.props} />;
    }
    return <Redirect to="/" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
