import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { Redirect } from "react-router-dom";
import NotFound from "../Exception/404";
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Cart as CartModel,
} from "../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...ProfileModel,
    ...CartModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  componentWillMount() {
    if (localStorage.getItem('auth') !== null) {
      this.props.getCustomer().then((res) => {
        if (res.payload.success) {
          localStorage.setItem('percent', res.payload.data.info.cstatus);
        }
      });
    }
  }

  render() {
    if (localStorage.getItem('auth') !== null) {
      return <List {...this.props} />;
    }
    return <NotFound />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
