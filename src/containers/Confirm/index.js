import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from "react-router-dom";
import { message } from 'antd';
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
    this.props.confirm({ key: this.props.match.params.key }).then((Res) => {
      if (!Res.payload.success) {
        message.success(intl.formatMessage({ id: Res.payload.code }));
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
