/* eslint-disable import/first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import ScrollToTop from "react-router-scroll-top";

import { Home, Discount, New, Recipe, Package, Season } from '../';
import { Header, Footer } from "../../layouts";
import { LoginModal } from "../../components/Login";
import {
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
} from '../../models';

import "../../scss/app.scss";
import "react-toastify/dist/ReactToastify.css";

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CategoryModel,
    ...StaticModel,
    ...MenuModel,
  }, dispatch),
});

class App extends Component {
  state = { dataSource: {} }

  componentWillMount() {
    this.props.getCategoryMenu();
    this.props.getStaticInfo();
    this.props.getMenu();
    this.props.getStaticPage();
  }

  componentDidMount() {
    // this.LoginModal.handleLoginModal();
  }

  hadleLogin = () => { this.LoginModal.handleLoginModal(); }
  render() {
    const { category, menu, staticcontent } = this.props;

    if (category.categorymenu.length !== 0 && staticcontent.staticinfo !== null
      && menu.mainmenu.length !== 0 && staticcontent.staticpage.length !== 0) {
      return (
        <Router>
          <ScrollToTop>
            {/** Global буюу веб-ийн хаанаас ч хандах боломжтой components */}
            <LoginModal onRef={ref => (this.LoginModal = ref)} />

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
            </Switch>

            {/** fixed footer */}
            <Footer {...this.props} />
          </ScrollToTop>
        </Router>
      );
    }

    return null;
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
