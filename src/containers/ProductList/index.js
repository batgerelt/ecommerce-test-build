/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Search as SearchModel,
  Product as ProductModel,
  Cart as CartModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.search,
  ...state.product,
  ...state.auth,
  ...state.cart,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...SearchModel,
    ...ProductModel,
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    brand: true, emart: true, attribute: true, products: [],
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.match.params.id ?
      this.props.searchProductBrand({ id: this.props.match.params.id })
        .then(res => this.setState({ products: res.payload.data })) :
      this.props.getEmartProduct({ start: 0, rowcnt: 100 })
        .then(res => this.setState({ products: res.payload.data }));
  }

  render() {
    return <List {...this.props} id={this.props.match.params.id} {...this.state} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
