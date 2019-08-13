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
  async componentWillMount() {
    await this.props.getCategoryMenu();
    await this.props.getBrand();
    await this.props.getHomePageBanner();
    await this.props.getWidget();
    await this.props.getPackage({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });
    await this.props.getNewProduct({});
    await this.props.getRecipe({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });
    await this.props.getDiscountProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 20,
      order: `price_asc`,
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
