import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  Category as CategoryModel,
  Filter as FilterModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.category,
  ...state.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...CategoryModel,
      ...FilterModel,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  state = { isloading: true };

  componentWillMount() {
    this.props
      .getCategoryInfo({ id: this.props.match.params.id })
      .then((res) => {
        this.setState({ isloading: false });
      });
    this.props.categoryFilter({
      body: {
        catid: this.props.match.params.id,
        parameters: [],
        minprice: 0,
        maxprice: 0,
        ordercol: "price_asc",
        rowcount: 0,
        startswith: 0,
      },
    });
  }

  render() {
    const { isloading } = this.state;
    return isloading ? null : (
      <List {...this.props} id={this.props.match.params.id} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
