import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CryptoJS from "crypto-js";
import { Spin } from "antd";
import { Loader } from "../../../../components";
import PaymentReturn from "./PaymentReturn";
import { EncryptKey } from "../../../../utils/Consts";
import {
  Checkout as CheckoutModel,
  Cart as CartModel,
} from "../../../../models";

const mapStateToProps = state => ({
  ...state.checkout,
  ...state.cart,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...CheckoutModel,
    ...CartModel,
  }, dispatch),
});


class Payment extends React.Component {
  state = {
    loading: true,
    isReturn: false,
    return: '',
    qpayReturn: false,
  };

  getUrlParams = (location, name) => {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    let results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  componentDidMount() {
    const { location } = this.props.history;
    if (location.pathname === "/qpayReturn") {
      if (location.state != null) {
        this.setState({ qpayReturn: true, loading: false, return: location.state });
      }
      // let invoiceId = this.getUrlParams(location, "invoiceId");
    } else {
      this.setState({ loading: false });
      let tmp = {
        trans_number: this.getUrlParams(location, "trans_number"),
        success: this.getUrlParams(location, "success"),
        error_code: this.getUrlParams(location, "error_code"),
        error_desc: this.getUrlParams(location, "error_desc"),
        card_number: this.getUrlParams(location, "card_number"),
        signature: this.getUrlParams(location, "signature"),
      };
      this.props.checkGolomtMerchant({ body: tmp }).then((res) => {
        if (!res.payload.success) {
          if (res.payload.data.ordstatus === 15) {
            this.props.clearLocally();
            this.setState({ isReturn: true, return: res }, () => {
              this.props.history.push({
                pathname: `/order/${this.encryptUrl(res.payload.data.order.id)}`,
                state: this.state,
              });
            });
          } else if (res.payload.data.ordstatus === 16 || res.payload.data.ordstatus === 14 || res.payload.data.ordstatus === 18) {
            this.setState({ isReturn: true, return: res }, () => {
              this.props.history.push({
                pathname: "/cart",
                state: this.state,
              });
            });
          }
        } else {
          this.props.clearLocally();
        }
      });
    }
  }

  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext.toString().replace(/\+/g, 'xMl3Jk').replace(/\//ig, 'Por21Ld').replace(/=/g, 'Ml32');
  }


  render() {
    // <PaymentReturn loading {...this.props} {...this} />
    const { loading } = this.state;
    return (
      loading ?
        <Spin spinning={loading} indicator={<Loader />} qpayReturn={this.state.qpayReturn} />
        : <PaymentReturn loading {...this.props} {...this} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);
