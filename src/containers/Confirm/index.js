import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
} from "../../models";
import { LoginModal } from "../../components/Login";
import { RegistrationModal } from "../../components/Registration";
import List from "./list";

const mapStateToProps = state => ({
  ...state.profile,
  ...state.auth,
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
  }, dispatch),
});

class PackageDetail extends React.Component {
  componentWillMount() {
    this.props.confirm({ key: this.props.match.params.key }).then((res) => {
    });
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} />
        <RegistrationModal onRef={ref => (this.RegistrationModal = ref)} {...this.props} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetail);
