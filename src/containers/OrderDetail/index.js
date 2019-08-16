import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Profile as ProfileModel,
} from "../../models";
import List from "./list";

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
    this.props.getOrderDetail({ ordid: this.props.match.params.id });
  }

  render() {
    if (localStorage.getItem('auth') !== null) {
      return <List {...this.props} />;
    }
    return <Redirect to="/" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
