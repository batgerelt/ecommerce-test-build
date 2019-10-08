/* eslint-disable no-unused-expressions */
/* eslint-disable import/first */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout } from "antd";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types";
import ScrollToTop from "react-router-scroll-top";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import localeMn from "react-intl/locale-data/mn";
import { Header, Footer, Mobilemenu } from "../../layouts";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import { ForgetModal } from "../../components/ForgetModal";
import Notfound from "../Exception/404";
import style from "./style.less";
import {
  Locale as LocaleModel,
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
  Auth as AuthModel,
  Cart as CartModel,
  Product as ProductModel,
  Search as SearchModel,
  Filter as FilterModel,
  Recipe as RecipeModel,
  Profile as ProfileModel,
  Attribute as AttributeModel,
  Brand as BrandModel,
  User as UserModel,
} from "../../models";
import {
  Locale,
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
  Order,
  Emart,
  Brand,
} from "../";
import PaymentReturn from "../Checkout/components/PaymentReturn";

import IntlGlobalProvider from '../../components/IntlGlobalProvider';
import translationEn from "../../translations/en.json";
import translationMn from "../../translations/mn.json";

import "../../scss/app.scss";
import "react-toastify/dist/ReactToastify.css";

addLocaleData([...localeEn, ...localeMn]);

const translation = {
  en: translationEn,
  mn: translationMn,
};

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...LocaleModel,
      ...CategoryModel,
      ...StaticModel,
      ...MenuModel,
      ...AuthModel,
      ...CartModel,
      ...ProductModel,
      ...SearchModel,
      ...FilterModel,
      ...RecipeModel,
      ...ProfileModel,
      ...AttributeModel,
      ...BrandModel,
      ...UserModel,
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
    this.props.getCategoryAll();
    this.props.getAttributeAll();
    this.props.getAttributeValue();
    this.props.getAllBrand();
    this.props.getAllPromotion();
    this.props.getTags();
    this.props.setLang();
  }

  render() {
    const { lang } = this.props.locale;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <IntlProvider locale={lang} messages={translation[lang]} textComponent={Fragment}>
          <IntlGlobalProvider>
            <Router>
              <Layout>
                <ScrollToTop>
                  {/** Global буюу веб-ийн хаанаас ч хандах боломжтой components */}
                  <ForgetModal onRef={ref => (this.ForgetModal = ref)} {...this.props} {...this} />
                  <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} {...this} />
                  <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />
                  <Mobilemenu onRef={ref => (this.Mobilemenu = ref)} {...this.props} {...this} />

                  {/** fixed header */}
                  <Header onRef={ref => (this.Header = ref)} {...this.props} {...this} />
                  {/*  */}

                  {/** Үндсэн root болон nested root-үүд доор байрлана */}
                  <Layout.Content>
                    <div>
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/discount" component={Discount} />
                        <Route path="/new" render={() => <New />} />
                        <Route path="/recipe" component={Recipe} />
                        <Route path="/package" component={Package} />
                        <Route path="/season" component={Season} />
                        <Route path="/productdetail/:id" component={ProductDetail} />
                        <Route path="/checkout" component={Checkout} />
                        <Route path="/info/:id" component={Static} />
                        <Route path="/category/:id" component={Category} />
                        <Route path="/brand/:id" component={Brand} />
                        <Route path="/recipedetail/:id" component={RecipeDetail} />
                        <Route path="/cart" component={Cart} />
                        <Route path="/packagedetail/:id" component={PackageDetail} />
                        <Route path="/emart" component={Emart} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/search/:cat/:word/:time" component={Search} />
                        <Route path="/search/:cat/:time" component={Search} />
                        <Route path="/ResetPassword/:key" component={PassReset} />
                        <Route path="/confirm/:key" component={Confirm} />
                        <Route path="/order/:id" component={Order} />
                        <Route path="/golomtPayment" component={PaymentReturn} />
                        <Route path="/qpayReturn" component={PaymentReturn} />
                        <Route path="*" component={Notfound} />
                      </Switch>
                    </div>
                  </Layout.Content>
                </ScrollToTop>
                <Footer {...this.props} />
              </Layout>
            </Router>
          </IntlGlobalProvider>
        </IntlProvider>
      </Layout>
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
