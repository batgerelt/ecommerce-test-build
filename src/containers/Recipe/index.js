import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Cart as CartModel,
  Auth as AuthModel,
  Recipe as RecipeModel,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
  ...state.auth,
  ...state.recipe,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...CartModel,
    ...AuthModel,
    ...RecipeModel,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [], footer: [] } }
  /** Discount хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getRecipeMenu({});
    // Хандалт бүрт санамсаргүйгээр харуулж байгаа ба setState хийх үед солигдоод байсныг нь энд оруулав
    this.props.getRecipeBanner().then((res) => {
      if (res.payload.success) {
        const { banner } = this.state;

        banner.header = res.payload.data.header;
        banner.footer = res.payload.data.footer[Math.floor(Math.random() * res.payload.data.footer.length)];

        this.setState({ banner });
      }
    });
    this.props.getRecipe({
      order: "date_desc",
      start: 0,
      rowcnt: 6,
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
