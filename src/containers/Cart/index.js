import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Cart as CartModel } from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    // this.props.getCartProducts();
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
