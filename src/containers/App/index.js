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
  Category,
  ProductList,
  RecipeDetail,
  Cart,
} from "../";
import { Header, Footer } from "../../layouts";
import { LoginModal } from "../../components/Login";
import {
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
  Auth as AuthModel,
  Cart as CartModel,
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

  hadleLogin = () => { this.LoginModal.handleLoginModal(); }

  render() {
    return (
      <Router>
        <ScrollToTop>
          {/** Global буюу веб-ийн хаанаас ч хандах боломжтой components */}
          <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />

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
            <Route path="/info/:id" component={Static} />
            <Route path="/CategoryInfo/:id" component={Category} />
            <Route path="/brand/:id" component={ProductList} />
            <Route path="/recipedetail/:id" component={RecipeDetail} />
            <Route path="/cart" component={Cart} />
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
