import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Banner as BannerModel,
  Menu as MenuModel,
  Cart as CartModel,
  Auth as AuthModel,
  Locale as LocaleModel,
  Deal,
} from "../../models";
import List from "./list";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
  ...state.auth,
  ...state.locale,
  ...state.search,
  ...state.deal,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...MenuModel,
    ...CartModel,
    ...AuthModel,
    ...LocaleModel,
    ...Deal,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [], footer: [] } }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.props.resetDealProducts();
    const param = {
      catId: 0,
      value: "",
      attribute: "",
      color: "",
      brand: "",
      promotion: "",
      minPrice: 0,
      maxPrice: 0,
      level: 0,
      highlight: true,
      attributeQty: 0,
      custId: 0,
      module: "hourdiscount",
      language: "",
      startsWith: 0,
      rowCount: 0,
      orderColumn: "updateddate_desc, ISAVAILABLE_DESC, SALEPERCENT_DESC, RATE_DESC",
    };
  }

  render() {
    return (
      <div>
        {!this.state.loading ? <List {...this.props} {...this.state} {...this} /> : null}
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
