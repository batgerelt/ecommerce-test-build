import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import { Loader } from "../../../../components";
import GolomtMerchant from "./GolomtMerchant";
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


class MerchantReturn extends React.Component {
  state = {
    loading: true,
    isMerchantFalse: false,
    return: '',
  };

  getUrlParams = (props, name) => {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    let results = regex.exec(props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  componentDidMount() {
    let tmp = {
      trans_number: this.getUrlParams(this.props, "trans_number"),
      success: this.getUrlParams(this.props, "success"),
      error_code: this.getUrlParams(this.props, "error_code"),
      error_desc: this.getUrlParams(this.props, "error_desc"),
      card_number: this.getUrlParams(this.props, "card_number"),
      signature: this.getUrlParams(this.props, "signature"),
    };
    this.props.checkGolomtMerchant({ body: tmp }).then((res) => {
      console.log(res);
      if (!res.payload.success) {
        if (res.payload.data.ordstatus === 15) {
          this.props.clearLocally();
          this.props.history.push("/profile/delivery");
        } else if (res.payload.data.ordstatus === 16 || res.payload.data.ordstatus === 14 || res.payload.data.ordstatus === 18) {
          this.setState({ isMerchantFalse: true, return: res }, () => {
            this.props.history.push({
              pathname: "/cart",
              state: this.state,
            });
          });
        }
      } else {
        this.setState({ loading: false });
        this.props.clearLocally();
      }
    });
  }

  render() {
    const { loading } = this.state;
    return (
      loading ?
        <Spin spinning={loading} indicator={<Loader />} />
        : <GolomtMerchant loading {...this.props} {...this} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MerchantReturn);
