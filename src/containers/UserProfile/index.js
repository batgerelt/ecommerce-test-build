import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
  Recipe as RecipeModel,
  Cart as CartModel,
} from "../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
  ...state.recipe,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ...ProfileModel,
    RecipeModel,
    CartModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  componentWillMount() {
    this.props.getCustomer({ custid: this.props.data[0].info.customerInfo.id });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
