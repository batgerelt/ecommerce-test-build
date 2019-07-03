/* eslint-disable import/first */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types";
import ScrollToTop from "react-router-scroll-top";

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
  PackageDetail,
} from "../";
import { Header, Footer } from "../../layouts";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import {
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
  Auth as AuthModel,
  Cart as CartModel,
  Filter as FilterModel,
} from "../../models";

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
      ...FilterModel,
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

  componentDidMount() {
    // this.LoginModal.handleLoginModal();
  }

  hadleLogin = () => {
    this.LoginModal.handleLoginModal();
  };
  hadleLogin = () => {
    this.LoginModal.handleLoginModal();
  };

  render() {
    return (
      <Router>
        <ScrollToTop>
          {/** Global буюу веб-ийн хаанаас ч хандах боломжтой components */}
          <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} {...this} />
          <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />


          {/** fixed header */}
          <Header {...this.props} {...this} />
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
            <Route path="/packagedetail/:id" component={PackageDetail} />
            <Route path="/emart" component={ProductList} />
            <Route path="/search/:word" component={ProductList} />
          </Switch>

          {/** fixed footer */}
          <Footer {...this.props} />
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
