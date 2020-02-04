import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import CryptoJS from "crypto-js";
import { FormattedMessage, injectIntl } from "react-intl";

import {
  Auth as AuthModel,
  Product as ProductModel,
  Cart as CartModel,
  Locale as LocaleModel,
} from "../../models";
import { EncryptKey } from "../../../src/utils/Consts";
import List from "./list";
import { Loader } from "../../components";
import { LoginModal } from "../../components/Login";


const mapStateToProps = state => ({
  ...state.auth,
  ...state.product,
  ...state.cart,
  ...state.category,
  ...state.locale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...AuthModel,
      ...ProductModel,
      ...CartModel,
      ...LocaleModel,
    },
    dispatch,
  ),
});


class Page extends React.Component {
  state = { isEmpty: false, loadingCollection: true };

  // eslint-disable-next-line camelcase
  componentDidMount() {
    this.getData(this.props.match.params.id);
    this.getFeedback();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.setState({ loading: true });
      this.getData(nextProps.match.params.id);
    }
  }

  getFeedback() {
    if (this.props.match.params.orderid !== undefined) {
      let id = this.props.match.params.orderid.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
      let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      this.props.isFeedBack({ orderid: plaintext, skucd: this.props.match.params.id });
    }
  }

  getData = (id) => {
    this.setState({ isEmpty: false });
    this.props.getProductDetail({ skucd: id }).then((res) => {
      if (res.payload.data.products === null) {
        this.setState({ isEmpty: true });
      }
    });
    this.props.getProductRelational({ skucd: id });
    this.props.getProductComment({ skucd: id });
    this.props.getProductCollection({ skucd: id });
    this.props.getProductAttribute({ skucd: id });
    if (localStorage.getItem("auth") !== null) {
      this.props.getProductRate({ skucd: id });
      this.props.addViewList({ skucd: id });
    }
  };

  renderHelmet = () => {
    try {
      const { images, products } = this.props.detail;
      const lang = this.props.intl.locale;
      return (
        <Helmet>
          <title>{products.title}</title>
          <meta name="url" content={window.location.href} />
          <link rel="image_src" href={process.env.IMAGE + images[0].img} />
          <meta name="description" content={products.description} />

          <meta name="twitter:title" content={lang === "en" ? products.title_en : products.title} />
          <meta name="twitter:description" content={products.description} />
          <meta name="twitter:image" content={process.env.IMAGE + images[0].img} />
          <meta name="twitter:site" content={window.location.href} />

          <meta property="og:type" content="product" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:title" content={lang === "en" ? products.title_en : products.title} />
          <meta property="og:description" content={products.description} />
          <meta property="og:image" content={process.env.IMAGE + images[0].img} />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content="119000" />
          <meta property="product:price:currency" content="MNT" />
          <meta property="product:retailer_item_id" content="FL4396" />
        </Helmet>
      );
    } catch (error) { return console.log('null: ', null); }
  }

  render() {
    return (
      <React.Fragment>
        <Spin
          spinning={this.props.isProductDetail}
          indicator={<Loader />}
        >
          {this.renderHelmet()}

          <List {...this.props} {...this} isEmpty={this.state.isEmpty} loading={this.state.loading} isLoggedIn={localStorage.getItem('auth') !== null} />
          <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
        </Spin>
      </React.Fragment>

    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Page));
