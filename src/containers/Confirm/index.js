import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Profile as ProfileModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...ProfileModel,
  }, dispatch),
});

class PackageDetail extends React.Component {
  componentWillMount() { }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetail);
