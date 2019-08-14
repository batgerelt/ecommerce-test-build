import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Cart as CartModel,
  Package as PackageModel,
  Locale as LocaleModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.cart,
  ...state.package,
  ...state.locale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CartModel,
    ...PackageModel,
    ...LocaleModel,
  }, dispatch),
});

class PackageDetail extends React.Component {
  componentWillMount() {
    this.props.getDetailPackage({ id: this.props.match.params.id });
    this.props.getInfoPackage({ id: this.props.match.params.id });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetail);
