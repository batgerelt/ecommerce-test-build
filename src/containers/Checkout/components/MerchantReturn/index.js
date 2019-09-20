import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import { Loader } from "../../../../components";
import GolomtMerchant from "./GolomtMerchant";
import { Checkout as CheckoutModel } from "../../../../models";

const mapStateToProps = state => ({
  ...state.checkout,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...CheckoutModel,
  }, dispatch),
});


class MerchantReturn extends React.Component {
  state = { loading: true };

  getUrlParams = (props, name) => {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    let results = regex.exec(props.location.pathname);
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
    console.log(tmp);
    this.props.checkGolomtMerchant({ body: tmp }).then((res) => {
      console.log(res);
    });
    console.log(this.props);
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
