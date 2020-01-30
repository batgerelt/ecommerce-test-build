import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
} from "../../models";

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

class UserProfile extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.checkKey({ key: this.props.match.params.key });
  }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
