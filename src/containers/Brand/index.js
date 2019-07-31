import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Category as CategoryModel,
  Filter as FilterModel,
  Cart as CartModel,
  Auth as AuthModel,
  Product as ProductModel,
  Search as SearchModel,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.category,
  ...state.filter,
  ...state.cart,
  ...state.auth,
  ...state.product,
  ...state.search,
  ...state.brand,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...CategoryModel,
    ...FilterModel,
    ...CartModel,
    ...AuthModel,
    ...ProductModel,
    ...SearchModel,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
