import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Cart as CartModel,
} from "../../../../models";

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
    this.props.getCustomer().then((res) => {
      console.log("res.payload", res.payload);
    });
  }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
