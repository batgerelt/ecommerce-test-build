import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Package as PackageModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.package,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...PackageModel,
  }, dispatch),
});

class OrderDetail extends React.Component {
  componentWillMount() {
    this.props.getDetailPackage({ id: this.props.match.params.id });
    this.props.getInfoPackage({ id: this.props.match.params.id });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
