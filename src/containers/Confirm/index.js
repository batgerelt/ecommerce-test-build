import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Profile as ProfileModel,
  Auth as AuthModel,
} from "../../models";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import List from "./list";

const mapStateToProps = state => ({
  ...state.profile,
  ...state.auth,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...ProfileModel,
    ...AuthModel,
  }, dispatch),
});

class PackageDetail extends React.Component {
  componentWillMount() {
    this.props.confirm({ key: this.props.match.params.key }).then((res) => {
    });
  }

  render() {
    return (
      <div>
        <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
        <List {...this.props} {...this} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetail);
