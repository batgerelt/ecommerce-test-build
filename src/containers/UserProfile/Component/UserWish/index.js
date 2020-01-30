import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Cart as CartModel,
  Locale as LocaleModel,
} from "../../../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.cart,
  ...state.locale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ...ProfileModel,
    ...CartModel,
    ...LocaleModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.getWish();
  }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
