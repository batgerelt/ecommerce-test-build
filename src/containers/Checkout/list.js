/* eslint-disable react/no-string-refs */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, Spin, message } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isMobile } from "react-device-detect";
import { store } from 'react-notifications-component';
import {
  LoginRegisterPanel,
  PaymentTypePanel,
  PaymentPanel,
  DeliveryInfo,
  DeliveryPanel,
  SwalModals,
} from "./components";
import { Loader, Notification } from "../../components";

const MySwal = withReactContent(Swal);
const Panel = Collapse.Panel;

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "1",
      customerInfo: null,
      companyInfo: null,
      deliveryTypeExpanded: false,
      paymentTypeExpanded: false,
      payType: false,
      loading: false,
      chnged: false,
      chosenDelivery: {},
      totalPrice: 0,
      totalQty: 0,
      chosenAddress: {},
      addresstype: "edit",
      isEmail: true,
      deliveryPanelForm: {},
      chosenDate: null,
      chosenRadio: 1,
      organizationData: [],
      chosenPaymentType: {},
      useEpoint: false,
      epointUsedPoint: 0,
      cardInfo: null,
    };
  }

  /* componentDidUpdate(nextProps) {
    if (localStorage.getItem('auth') === null) {
      this.props.history.push("/");
    }
  } */

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: false,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  setDeliveryPanelForm = (item) => {
    this.setState({ deliveryPanelForm: item });
  }

  componentWillMount = () => {
    this.scrollTo(0, 0);
    const { products, userinfo } = this.props;
    if (this.checkLoggedIn()) {
      if (!this.props.loading) {
        this.setState({ activeKey: "2", chnged: true });
      }
    }
    if (products.length === 0) {
      this.errorMsg("Уучлаарай таны сагс хоосон байна. Сагсандаа бараа нэмнэ үү ?");
      this.props.history.push("/cart");
    }
    if (userinfo.card !== undefined) {
      this.setState({ cardInfo: userinfo.card });
    }
    this.setState({ totalPrice: this.getTotalPrice(products), totalQty: this.getTotalQty(products) });
  }

  changeDeliveryType = (value) => {
    this.setState({ deliveryTypeExpanded: value });
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
    if (!isMobile) {
      if (key !== undefined) {
        const { activeKey } = this.state;
        if (key === "3" && activeKey === "2") {
          this.onSubmitDeliveryPanel();
          // this.scrollTo(0, 0);
        } else if (key === "2" && activeKey === "3") {
          this.setState({ activeKey: "2" });
          this.scrollTo(0, 0);
        } else {
          this.setState({ activeKey: key });
        }
      }
    }
  };

  changeLoading = (val) => {
    this.setState({ loading: val });
  }

  paymentType = () => (
    <div className="title-container flex-space" id="paymentType">
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

  getTotalQty = (products) => {
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }
    const qties = products && products.map(prod => (prod.qty ? prod.qty : 0));
    return qties && qties.length > 0
      ? qties.reduce((acc, cur) => acc + cur)
      : 0;
  }

  getTotalPrice = (products) => {
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }
    const prices = products && products.map((prod) => {
      const price = prod.salepercent && prod.discountprice
        ? prod.issalekg && prod.currentprice ? prod.currentprice : prod.discountprice
        : prod.issalekg && prod.currentprice ? prod.currentprice : prod.price;
      return (prod.addminqty > 1 ? prod.currentunitprice : price) * (prod.qty ? prod.qty : 0);
    });
    return prices && prices.length > 0
      ? prices.reduce((acc, cur) => acc + cur)
      : 0;
  };

  changeDeliveryTab = (item) => {
    const { totalPrice } = this.state;
    if (totalPrice >= item.freecondition && item.freecondition !== 0) {
      item.price = 0;
    }
    this.setState({ chosenDelivery: item });
  }

  getDeliveryTypeValue = (body, date) => { }

  changeChosenDate = (item) => {
    this.setState({ chosenDate: item });
  }

  scrollTo = (top, left) => {
    window.scroll({
      top,
      left,
      behavior: 'smooth',
    });
  }

  onSubmitDeliveryPanel = (e) => {
    e !== undefined ? e.preventDefault() : '';
    const {
      products,
      userinfo,
      intl,
    } = this.props;
    const { chosenAddress, addresstype, chosenDelivery } = this.state;
    this.state.deliveryPanelForm.validateFields((err, values) => {
      if (!err) {
        chosenAddress.phone1 = values.phone1;
        chosenAddress.name = values.name;
        chosenAddress.address = values.address;
        if (values.email !== undefined && userinfo.info.email === null) {
          this.props.addUserEmail(values.email).then((res) => {
            if (!res.payload.success) {
              this.setState({ isEmail: false });
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false,
                },
                content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
              });
            } else {
              this.setState({ isEmail: true });
            }
          });
        }
        let body = {};
        body.id = chosenAddress.id;
        body.custid = 1;
        body.locid = chosenAddress.locid;
        body.address = values.address;
        body.name = values.name;
        body.phonE1 = values.phone1;
        body.phonE2 = values.phone2;
        if (addresstype === "new" && chosenDelivery.id !== 3) {
          this.props.addAddress({ body }).then((res) => {
            if (res.payload.success) {
              chosenAddress.id = res.payload.data;
              body.id = res.payload.data;
              this.changeChosenAddress(chosenAddress);
              this.changeAddressType("edit");
              this.props.getUserInfo().then((res) => {
                if (res.payload.success) {
                  this.setState({ noAddress: false });
                }
              });
            } else {
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false,
                },
                content: <Notification type="success" text={intl.formatMessage({ id: res.payload.message })} />,
              });
            }
          });
        }
        body.provincenm = chosenAddress.provincenm;
        body.districtnm = chosenAddress.districtnm;
        body.committeenm = chosenAddress.committeenm;
        this.getDeliveryTypeValue(body, this.state.chosenDate);
        if (products.length !== 0) {
          if (chosenDelivery.id === 3 || chosenDelivery.id === 2) {
            if (this.state.isEmail) {
              if (isMobile) {
                let paymentType = document.getElementById("paymentType");
                paymentType.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }
              this.changeDeliveryType(true);
              this.setState({ activeKey: "3" });
            }
          } else {
            this.changeLoading(true);
            let locid = this.state.chosenAddress.locid;
            let tmp = [];
            products.map((item) => {
              let it = {
                skucd: item.skucd,
                qty: item.qty,
              };
              tmp.push(it);
            });
            this.props.getCheckProductZone({ body: tmp, locid }).then((res) => {
              this.changeLoading(false);
              if (res.payload.success) {
                if (this.state.isEmail) {
                  this.changeDeliveryType(true);
                  this.setState({ activeKey: "3" });
                  if (isMobile) {
                    let paymentType = document.getElementById("paymentType");
                    paymentType.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }
                }
              } else {
                MySwal.fire({
                  html: (
                    <SwalModals
                      type={"delete"}
                      data={[]}
                      ordData={[]}
                      onRef={ref => (this.SwalModals = ref)}
                      {...this}
                      {...this.props}
                    />
                  ),
                  type: "warning",
                  animation: true,
                  button: false,
                  showCloseButton: false,
                  showCancelButton: false,
                  showConfirmButton: false,
                  focusConfirm: false,
                  allowOutsideClick: false,
                  closeOnEsc: false,
                });
              }
            });
          }
        }
      }
    });
  }

  changeChosenAddress = (item) => {
    if (this.props.userinfo.main !== null) {
      this.setState({ chosenAddress: item });
    } else {
      item.name = this.props.userinfo.info.firstname;
      item.phone1 = this.props.userinfo.info.phone1;
      this.setState({ chosenAddress: item });
    }
  }

  changeAddressType = (item) => {
    this.setState({ addresstype: item });
  }

  changeChosenRadio = (item) => {
    this.setState({ chosenRadio: item });
  }

  setOrganizationData = (item) => {
    this.setState({ organizationData: item });
  }

  setChosenPaymentType = (item) => {
    this.setState({ chosenPaymentType: item });
  }

  changeCompanyInfo = (item) => {
    this.setState({ companyInfo: item });
  }

  setUseEpoint = (value, usedPoint) => {
    this.setState({ useEpoint: value, epointUsedPoint: usedPoint });
  }

  continueCheckout = (epointUsedPoint, useEpoint) => {
    this.setState({ epointUsedPoint, useEpoint });
  }

  changeCardInfo = (item) => {
    this.setState({ cardInfo: item });
  }

  changeEpointUsedPoint = (item) => {
    this.setState({ epointUsedPoint: item });
  }

  handleSubmit = () => {
    this.DeliveryInfo.handleSubmit();
  }
  render() {
    const {
      deliveryTypeExpanded,
      loading,
      activeKey,
    } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Spin
        spinning={loading}
        indicator={<Loader />}
      >
        <div className="section">
          <div className="container pad10">
            <div className="checkout-container" >
              <div className="row row10" ref={(node) => { this.container = node; }}>
                <div className="col-lg-8 pad10">
                  <div className="accordion" id="accordionExample">
                    <div className="card">
                      <div className="card-header" id="headingOne">
                        <Collapse
                          activeKey={this.checkLoggedIn() ? isMobile ? ["2", "3"] : this.state.activeKey : ["1"]}
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
                            id="deliveryPanelID"
                          >
                            <DeliveryPanel
                              {...this.props}
                              mainState={this.state}
                              changeDeliveryTab={this.changeDeliveryTab}
                              getDeliveryTypeValue={this.getDeliveryTypeValue}
                              changeChosenAddress={this.changeChosenAddress}
                              changeAddressType={this.changeAddressType}
                              setDeliveryPanelForm={this.setDeliveryPanelForm}
                              changeChosenDate={this.changeChosenDate}
                            />
                          </Panel>
                          <Panel
                            header={this.paymentType()}
                            showArrow={false}
                            disabled={!this.checkLoggedIn()}
                            key={"3"}
                            id="paymentTypePanelID"
                          >
                            <PaymentTypePanel
                              {...this.props}
                              mainState={this.state}
                              changeChosenRadio={this.changeChosenRadio}
                              setOrganizationData={this.setOrganizationData}
                              setChosenPaymentType={this.setChosenPaymentType}
                              changeCompanyInfo={this.changeCompanyInfo}
                              changeCardInfo={this.changeCardInfo}
                              setUseEpoint={this.setUseEpoint}
                            />
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  localStorage.getItem("auth") ?
                    <DeliveryInfo
                      onRef={ref => (this.DeliveryInfo = ref)}
                      onSubmitDeliveryPanel={this.onSubmitDeliveryPanel}
                      mainState={this.state}
                      changeLoading={this.changeLoading}
                      setUseEpoint={this.setUseEpoint}
                      changeCardInfo={this.changeCardInfo}
                      container={this.container}
                      changeEpointUsedPoint={this.changeEpointUsedPoint}
                      {...this.props}
                    /> : null
                }
                <div className="col-lg-8 pad10" />
                {
                  isMobile ?
                    <div className="sticky-btn">
                      <button className="btn btn-main btn-block" onClick={this.handleSubmit} disabled={!isLoggedIn}>
                        <span className="text-uppercase">
                          {activeKey === "2" ? "Төлбөрийн төрөл сонгох" : <FormattedMessage id="shared.sidebar.button.pay" />}
                        </span>
                      </button>
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default injectIntl(Checkout);
