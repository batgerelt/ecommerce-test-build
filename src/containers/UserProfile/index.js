import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Recipe as RecipeModel,
} from "../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.recipe,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ProfileModel,
    RecipeModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  componentWillMount() { }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
