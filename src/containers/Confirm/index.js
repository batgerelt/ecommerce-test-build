import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from "react-router-dom";
import { store } from 'react-notifications-component';
import { Notification } from "../../components";
import {
  Profile as ProfileModel,
  Auth as AuthModel,
  Locale as LocaleModel,
  Category as CategoryModel,
  Static as StaticModel,
  Menu as MenuModel,
  Cart as CartModel,
  Product as ProductModel,
  Search as SearchModel,
  Filter as FilterModel,
  Recipe as RecipeModel,
  Attribute as AttributeModel,
  Brand as BrandModel,
  User as UserModel,
} from "../../models";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import List from "./list";

import { intl } from '../../components/IntlGlobalProvider';

const mapStateToProps = state => ({
  ...state.profile,
  ...state.auth,
  ...state.staticcontent,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
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
  }, dispatch),
});

class PackageDetail extends React.Component {
  componentWillMount() {
    this.props.getStaticInfo();
    this.props.confirm({ key: this.props.match.params.key }).then((res) => {
      if (!res.payload.success) {
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
        });
      } else {
        this.props.logout();
        this.props.clearLocally();
        this.props.clearUserModelState();
      }
    });
  }

  render() {
    const { confirms } = this.props;
    return (
      <div>
        <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
        {
          confirms.length === 0 ? null : confirms.success ? <List {...this.props} {...this} /> : <Redirect to="/" />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetail);
