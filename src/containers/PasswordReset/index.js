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
  componentWillMount() {
    this.props.changePassword({ id: this.props.match.params.key, password: '1234' }).then((res) => {
      if (!res.payload.success) {
        return <Redirect to="/" />;
      }
      return null;
    });
  }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
