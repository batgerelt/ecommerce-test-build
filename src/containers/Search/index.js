/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Search as SearchModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.search,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...SearchModel,
  }, dispatch),
});

class Page extends React.Component {
  componentWillMount() {
    const { id, key } = this.props.match.params;
    parseInt(key) === 1 ? this.props.searchKeyWord({ keywordid: id }) : this.props.searchWord({ keyword: id });

    const params = {
      catid: 0,
      keywordid: id,
      parameters: [],
      minprice: 0,
      maxprice: 0,
      ordercol: 'price_asc',
      rowcount: 20,
      startswith: 0,
    };

    this.props.searchKeyWordFilter({ body: { ...params } });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
