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
} from "../../models";
import Home from "./list";

const mapStateToProps = state => ({
  ...state.brand,
  ...state.category,
  ...state.banner,
  ...state.product,
  ...state.widget,
  ...state.package,
  ...state.recipe,
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
    this.props.getWidget();
    this.props.getAllPackage();
    this.props.getNewProduct({});
    this.props.getRecipeAll();
  }

  render() {
    return <Home {...this.props} {...this.state} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
