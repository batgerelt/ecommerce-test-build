/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Collapse, Spin } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  LoginRegisterPanel,
  PaymentTypePanel,
  PaymentPanel,
  DeliveryInfo,
  DeliveryPanel,
} from "./components";
import { Loader } from "../../components";

const MySwal = withReactContent(Swal);
const Panel = Collapse.Panel;

class Checkout extends React.Component {
  state = {
    activeKey: ["1"],
    customerInfo: null,
    companyInfo: null,
    deliveryTypeExpanded: false,
    paymentTypeExpanded: false,
    payType: false,
    loading: false,
    chnged: false,
  };

  componentDidUpdate(nextProps) {
    if (!this.props.isLogged && nextProps.isLogged) {
      this.props.history.push("/");
    }
    if (this.checkLoggedIn()) {
      if (this.props.loading !== nextProps.loading) {
        this.setState({ activeKey: ["2"], chnged: true });
      }
    }
  }

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: false,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  componentWillMount = () => {
    const { products } = this.props;
    if (products.length === 0) {
      this.errorMsg("Уучлаарай таны сагс хоосон байна. Сагсандаа бараа нэмнэ үү ?");
      this.props.history.push("/cart");
    }
  }

  changeDeliveryType = () => {
    this.setState({ deliveryTypeExpanded: true });
  }

  changePaymentType = () => {
    this.setState({ paymentTypeExpanded: true });
  }

  changePayType = () => {
    this.setState({ payType: true });
  }

  deliveryInfo = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this upper-first checkout-panel-title">
          <i className="fa fa-truck" aria-hidden="true" />
          <span><FormattedMessage id="checkout.deliveryType.title" /></span>
        </a>
      </h5>
    </div>
  );

  customerTab = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this upper-first checkout-panel-title">
          <i className="fa fa-user" aria-hidden="true" />
          <span><FormattedMessage id="checkout.registerAsUser.title" /></span>
        </a>
      </h5>
    </div>
  );

  callback = (key) => {
    this.setState({
      activeKey: key,
    });
  };

  changeLoading = (val) => {
    this.setState({ loading: val });
  }

  paymentType = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this upper-first checkout-panel-title">
          <i className="fa fa-credit-card" aria-hidden="true" />
          <span><FormattedMessage id="checkout.paymentType.title" /></span>
        </a>
      </h5>
    </div>
  );

  optionType = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this upper-first checkout-panel-title">
          <i className="fa fa-plus-square" aria-hidden="true" />
          <span><FormattedMessage id="checkout.extra.title" /></span>
        </a>
      </h5>
    </div>
  );

  checkLoggedIn = () => {
    if (localStorage.getItem('auth') !== null) {
      return true;
    }
    return false;
  }

  render() {
    const {
      deliveryTypeExpanded, paymentTypeExpanded, payType, loading,
    } = this.state;
    return (
      <Spin
        spinning={loading}
        indicator={<Loader />}
      >
        <div className="section section-gray">
          <div className="container pad10">
            <div className="checkout-container" >
              <div className="row row10">
                <div className="col-lg-8 pad10">
                  <div className="accordion" id="accordionExample">
                    <div className="card">
                      <div className="card-header" id="headingOne">
                        <Collapse
                          accordion
                          activeKey={this.checkLoggedIn() ? this.state.activeKey : ["1"]}
                          onChange={this.callback}
                        >
                          {
                            localStorage.getItem("auth") === null ?
                              <Panel
                                showArrow={false}
                                header={this.customerTab()}
                                key="1"
                              >
                                <LoginRegisterPanel onRef={ref => (this.LoginRegisterPanel = ref)} {...this} {...this.props} />
                              </Panel>
                              : ''
                          }
                          <Panel
                            header={this.deliveryInfo()}
                            showArrow={false}
                            disabled={!this.checkLoggedIn()}
                            key={"2"}
                          >
                            <DeliveryPanel onRef={ref => (this.DeliveryPanel = ref)} {...this} {...this.props} />
                          </Panel>
                          <Panel
                            header={this.paymentType()}
                            showArrow={false}
                            disabled={!(deliveryTypeExpanded && this.checkLoggedIn())}
                            key={"3"}
                          >
                            <PaymentTypePanel onRef={ref => (this.PaymentTypePanel = ref)} {...this} {...this.props} />
                          </Panel>
                          <Panel
                            header={this.optionType()}
                            showArrow={false}
                            disabled={!(paymentTypeExpanded && this.checkLoggedIn())}
                            key="4"
                          >
                            <PaymentPanel onRef={ref => (this.PaymentPanel = ref)} {...this} {...this.props} />
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                </div>
                <DeliveryInfo onRef={ref => (this.DeliveryInfo = ref)} {...this} {...this.props} />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Checkout;
