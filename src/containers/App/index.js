/* eslint-disable import/extensions */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/first */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout } from "antd";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import localeMn from "react-intl/locale-data/mn";
import { Header, Footer, Mobilemenu } from "../../layouts";
import { LoginModal, TokenExpiredModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import { ForgetModal } from "../../components/ForgetModal";
import Notfound from "../Exception/404";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import 'react-notifications-component/dist/theme.css';

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
import ReactNotification from 'react-notifications-component';

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
    this.props.getMenu();
    this.props.getStaticInfo();
    this.props.getTags();
    this.props.setLang();
  }
  componentDidMount() {
    this.props.getCategoryMenu();
    this.props.getAllBrand();
    this.props.getStaticPages();
    this.props.getAttributeAll();
    this.props.getAttributeValue();
    this.props.getCategoryAll();
    this.props.getAllPromotion();
  }
  render() {
    const { lang } = this.props.locale;
    try {
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
                    <TokenExpiredModal {...this} {...this.props} />

                    {/** fixed header */}
                    <Header onRef={ref => (this.Header = ref)} {...this.props} {...this} />

                    {/** Үндсэн root болон nested root-үүд доор байрлана */}
                    <Layout.Content>
                      <div>
                        <Switch>
                          <Route exact path="/" component={Home} />
                          <Route path="/discount" component={Discount} />
                          <Route path="/new" component={New} />
                          <Route path="/recipe" component={Recipe} />
                          <Route path="/package" component={Package} />
                          <Route path="/season" component={Season} />
                          <Route path="/productdetail/:id/:orderid" component={ProductDetail} />
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
                  <MessengerCustomerChat
                    pageId="1438714326447694"
                    appId="2707334876026775"
                    htmlRef={"www.emartmall.mn"}
                    themeColor="#ffb200"
                    minimized
                  />
                  <ReactNotification />
                  <Footer {...this.props} />
                </Layout>
              </Router>
            </IntlGlobalProvider>
          </IntlProvider>
        </Layout>
      );
    } catch (error) {
      return console.log('error: ', error);
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
