/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Search as SearchModel,
  Cart as CartModel,
  Attribute as AttributeModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.search,
  ...state.cart,
  ...state.auth,
  ...state.attribute,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...SearchModel,
    ...CartModel,
    ...AttributeModel,
  }, dispatch),
});

class Page extends React.Component {
  componentWillMount() {
    const { id, key } = this.props.match.params;
    // parseInt(key) === 1 ? this.props.searchKeyWord({ keywordid: id }) : this.props.searchWord({ keyword: id });

    const params = {
      catId: 0,
      value: id,
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      level: 0,
      parameters: [],
      language: "",
      startsWith: 0,
      rowCount: 10,
      orderColumn: "",
    };

    this.props.searchKeyWordFilter({ body: { ...params } });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
