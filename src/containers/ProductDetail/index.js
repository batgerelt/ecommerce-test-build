import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import CryptoJS from "crypto-js";
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
import Skelton from "../../components/Skeltons/productDetail";

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

  componentWillMount() {
    this.getData(this.props.match.params.id);
    this.getFeedback();
  }

  componentWillReceiveProps(nextProps) {
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
    // const { id } = this.props.match.params;
    this.props.getProductDetail({ skucd: id });
    this.props.getProductRelational({ skucd: id });
    this.props.getProductComment({ skucd: id });
    this.props.getProductCollection({ skucd: id });
    this.props.getProductAttribute({ skucd: id });
    if (localStorage.getItem("auth") !== null) {
      this.props.getProductRate({ skucd: id });
      this.props.addViewList({ skucd: id });
    }
  };

  render() {
    return (
      <Spin
        spinning={this.props.isProductDetail}
        indicator={<Loader />}
      >
        {
          <List {...this.props} {...this} isEmpty={this.state.isEmpty} loading={this.state.loading} isLoggedIn={localStorage.getItem('auth') !== null} />
        }
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </Spin>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
