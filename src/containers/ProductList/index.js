import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Search as SearchModel,
  Product as ProductModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.search,
  ...state.product,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...SearchModel,
    ...ProductModel,
  }, dispatch),
});

class Page extends React.Component {
  state = { brand: true, emart: true, attribute: true }

  componentWillMount() {
    this.props.searchProductBrand({ id: this.props.match.params.id }).then(r => this.setState({ brand: false }));
    this.props.searchAttribute({ body: { brandid: 0, ismart: 1 } }).then(r => this.setState({ attribute: false }));
  }

  render() {
    const { brand, emart, attribute } = this.state;
    return brand || emart || attribute ? null : <List {...this.props} id={this.props.match.params.id} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
