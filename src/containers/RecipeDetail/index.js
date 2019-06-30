import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Recipe as RecipeModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.recipe,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...RecipeModel,
  }, dispatch),
});

class RecipeDetail extends React.Component {
  componentWillMount() {
    this.props.getRecipeDetail({ id: this.props.match.params.id });
    this.props.getRecipeProducts({ id: this.props.match.params.id });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);
