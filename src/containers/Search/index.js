/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Search as SearchModel,
  Cart as CartModel,
  Attribute as AttributeModel,
  Auth as AuthModel,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.search,
  ...state.cart,
  ...state.auth,
  ...state.attribute,
  ...state.category,
  ...state.brand,
  ...state.locale,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...SearchModel,
    ...CartModel,
    ...AttributeModel,
    ...AuthModel,
  }, dispatch),
});

class Page extends React.Component {
  render() {
    return (
      <div>
        <List {...this.props} {...this} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
