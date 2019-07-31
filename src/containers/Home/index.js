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
    ...AuthModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getCategoryMenu();
    this.props.getBrand();
    this.props.getHomePageBanner();
    this.props.getEmartProduct({});
    this.props.getDiscountProduct({});
    this.props.getWidget();
    this.props.getPackage({
      order: 'price_asc',
      start: 0,
      rowcnt: 20,
    });
    this.props.getNewProduct({});
    this.props.getRecipe({
      order: 'price_asc',
      start: 0,
      rowcnt: 20,
    });
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
