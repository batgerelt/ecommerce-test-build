/* eslint-disable arrow-parens */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Category as CategoryModel,
  Brand as BrandModel,
  Banner as BannerModel,
  Product as ProductModel,
  Widget as WidgetModel,
  Package as PackageModel,
  Recipe as RecipeModel,
  Search as SearchModel,
  Cart as CartModel,
  User as UserModel,
  Auth as AuthModel,
} from "../../models";
import { LoginModal } from "../../components/Login";
import List from "./list";

const mapStateToProps = state => ({
  ...state.brand,
  ...state.category,
  ...state.banner,
  ...state.product,
  ...state.widget,
  ...state.package,
  ...state.recipe,
  ...state.search,
  ...state.cart,
  ...state.user,
  ...state.auth,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CategoryModel,
    ...BrandModel,
    ...BannerModel,
    ...ProductModel,
    ...WidgetModel,
    ...PackageModel,
    ...RecipeModel,
    ...SearchModel,
    ...CartModel,
    ...UserModel,
    ...AuthModel,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [], middle: [], footer: [] } }
  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    // this.props.getCategoryMenu();
    this.props.getBrand();
    this.props.getWidget();
    this.props.getPackage({});
    this.props.getNewProduct({});
    this.props.getRecipe({});
    this.props.getDiscountProduct({});
    this.props.getEmartProduct({});
    this.props.getDailydealProduct({});
    this.props.getCountDown({});

    // maaybe have error
    this.props.getHomePageBanner().then(res => {
      const { banner } = this.state;
      const response = res.payload.data;
      banner.header.push(response.header);
      banner.middle.push(response.middle[Math.floor(Math.random() * response.middle.length)]);
      banner.footer.push(response.footer[Math.floor(Math.random() * response.footer.length)]);
      return this.setState({ banner });
    });
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} {...this.state} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
