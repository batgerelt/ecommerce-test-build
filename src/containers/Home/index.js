import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Category as CategoryModel } from "../../models";
import Home from "./list";

const mapStateToProps = state => ({ ...state.category });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({ ...CategoryModel }, dispatch),
});

class Page extends React.Component {
  render() {
    return <Home {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
