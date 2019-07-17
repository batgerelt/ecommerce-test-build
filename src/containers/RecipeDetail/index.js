import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Auth as AuthModel,
  Cart as CartModel,
  Recipe as RecipeModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.cart,
  ...state.recipe,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...CartModel,
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
