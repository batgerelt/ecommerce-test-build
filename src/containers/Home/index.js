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
  state = { banner: { header: [], middle: [], footer: [] } }
  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    // this.props.getCategoryMenu();
    this.props.getBrand();
    this.props.getHomePageBanner().then(res => {
      const { banner } = this.state;
      const response = res.payload.data;
      banner.header.push(response.header[Math.floor(Math.random() * response.header.length)]);
      banner.middle.push(response.middle[Math.floor(Math.random() * response.middle.length)]);
      banner.footer.push(response.footer[Math.floor(Math.random() * response.footer.length)]);
      return this.setState({ banner });
    });
    this.props.getWidget();
    this.props.getPackage({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });
    this.props.getNewProduct({});
    this.props.getRecipe({
      order: 'date_desc',
      start: 0,
      rowcnt: 20,
    });
    this.props.getDiscountProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 20,
      order: `date_desc`,
    });
    this.props.getEmartProduct({
      jumcd: '99',
      start: 0,
      rowcnt: 20,
      order: `date_desc`,
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
