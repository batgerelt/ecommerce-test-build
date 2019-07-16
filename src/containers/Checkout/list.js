/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { Collapse } from "antd";
import {
  LoginRegisterPanel,
  PaymentTypePanel,
  PaymentPanel,
  DeliveryInfo,
  DeliveryPanel,
} from "./components";

const Panel = Collapse.Panel;
class Checkout extends React.Component {
  state = {
    activeKey: ["1"],
    customerInfo: null,
    companyInfo: null,
  };

  componentDidMount() {
  }

  deliveryInfo = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this">
          <i className="fa fa-truck" aria-hidden="true" />
          <span>Хүргэлтийн төрөл</span>
        </a>
      </h5>
    </div>
  );

  customerTab = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this">
          <i className="fa fa-user" aria-hidden="true" />
          <span>Хэрэглэгчээр бүртгүүлэх</span>
        </a>
      </h5>
    </div>
  );

  callback = (key) => {
    this.setState({
      activeKey: key,
    });
  };

  setCompanyInfo = (value) => {
    this.setState({ companyInfo: value });
  }

  paymentType = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this">
          <i className="fa fa-credit-card" aria-hidden="true" />
          <span>Төлбөрийн төрөл</span>
        </a>
      </h5>
    </div>
  );

  optionType = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this">
          <i className="fa fa-plus-square" aria-hidden="true" />
          <span>Нэмэлт сонголт</span>
        </a>
      </h5>
    </div>
  );

  render() {
    return (
      <div className="section section-gray">
        <div className="container pad10">
          <div className="checkout-container">
            <div className="row row10">
              <div className="col-lg-8 pad10">
                <div className="accordion" id="accordionExample">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <Collapse
                        accordion
                        activeKey={this.state.activeKey}
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
                          // disabled={!isLoggedIn}
                          key={"2"}
                        >
                          <DeliveryPanel onRef={ref => (this.DeliveryPanel = ref)} {...this} {...this.props} />
                        </Panel>
                        <Panel
                          header={this.paymentType()}
                          showArrow={false}
                          key={"3"}
                        >
                          <PaymentTypePanel onRef={ref => (this.PaymentTypePanel = ref)} {...this} {...this.props} />
                        </Panel>
                        <Panel
                          header={this.optionType()}
                          showArrow={false}
                          key="4"
                        /*  disabled={
                          this.state.collapseType === "payment" ? false : true
                        } */
                        >
                          <PaymentPanel onRef={ref => (this.PaymentPanel = ref)} {...this} {...this.props} />
                        </Panel>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
              <DeliveryInfo onRef={ref => (this.DeliveryInfo = ref)} {...this} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Checkout;
