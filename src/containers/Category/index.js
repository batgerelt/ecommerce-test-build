import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Category as CategoryModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({ ...state.category });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CategoryModel,
  }, dispatch),
});

class Page extends React.Component {
  state = { isloading: true }

  componentWillMount() {
    this.props.getCategoryInfo({ id: this.props.match.params.id }).then(res => this.setState({ isloading: false }));
  }

  render() {
    const { isloading } = this.state;
    return isloading ? null : <List {...this.props} id={this.props.match.params.id} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
