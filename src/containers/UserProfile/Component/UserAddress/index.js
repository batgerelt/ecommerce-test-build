import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
} from "../../../../models";

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
    /* this.props.getSystemLocation();
    this.props.getDistrictLocation({ id: 11 });
    this.props.getCommmitteLocation({ provid: 11, distid: 1 }); */
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
