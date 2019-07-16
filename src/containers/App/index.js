/* eslint-disable import/first */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types";
import ScrollToTop from "react-router-scroll-top";

import { Header, Footer, Mobilemenu } from "../../layouts";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import Notfound from "../Exception/404";
import {
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
  Auth as AuthModel,
  Cart as CartModel,
  Product as ProductModel,
  Search as SearchModel,
  Filter as FilterModel,
  Recipe as RecipeModel,
} from "../../models";
import {
  Home,
  Discount,
  New,
  Recipe,
  Package,
  Season,
  ProductDetail,
  Static,
  Checkout,
  Category,
  ProductList,
  RecipeDetail,
  Cart,
  Search,
  PackageDetail,
  Profile,
  PassReset,
  Confirm,
} from "../";

import "../../scss/app.scss";
import "react-toastify/dist/ReactToastify.css";

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...CategoryModel,
      ...StaticModel,
      ...MenuModel,
      ...AuthModel,
      ...CartModel,
      ...ProductModel,
      ...SearchModel,
      ...FilterModel,
      ...RecipeModel,
    },
    dispatch,
  ),
});

class App extends Component {
  state = { dataSource: {} };

  componentWillMount() {
    this.props.getCategoryMenu();
    this.props.getStaticInfo();
    this.props.getMenu();
    this.props.getStaticPages();
  }

  render() {
    return (
      <Router>
        <ScrollToTop >
          <div onClick={() => this.Header.handleDropDownClose()}>
            {/** Global буюу веб-ийн хаанаас ч хандах боломжтой components */}
            <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} {...this} />
            <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />
            <Mobilemenu onRef={ref => (this.Mobilemenu = ref)} {...this.props} {...this} />

            {/** fixed header */}
            <Header onRef={ref => (this.Header = ref)} {...this.props} {...this} />
            {/** Үндсэн root болон nested root-үүд доор байрлана */}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/discount" component={Discount} />
              <Route path="/new" component={New} />
              <Route path="/recipe" component={Recipe} />
              <Route path="/package" component={Package} />
              <Route path="/season" component={Season} />
              <Route path="/productdetail/:id" component={ProductDetail} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/info/:id" component={Static} />
              <Route path="/category/:id" component={Category} />
              <Route path="/brand/:id" component={ProductList} />
              <Route path="/recipedetail/:id" component={RecipeDetail} />
              <Route path="/cart" component={Cart} />
              <Route path="/packagedetail/:id" component={PackageDetail} />
              <Route path="/emart" component={ProductList} />
              <Route path="/profile" component={Profile} />
              <Route path="/search/:id/:key" component={Search} />
              <Route path="/ResetPassword/:key" component={PassReset} />
              <Route path="/confirm/:key" component={Confirm} />
              <Route path="*" component={Notfound} />
            </Switch>

            {/** fixed footer */}
            <Footer {...this.props} />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
