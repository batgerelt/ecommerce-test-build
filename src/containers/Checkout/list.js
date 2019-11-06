/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, Spin, message } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

  componentDidUpdate(nextProps) {
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this.props.history.push("/");
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
    const { activeKey } = this.state;
    if (key === "3" && activeKey === "2") {
      this.onSubmitDeliveryPanel();
      this.scrollTo(0, 0);
    } else if (key === "2" && activeKey === "3") {
      this.setState({ activeKey: "2" });
      this.scrollTo(0, 0);
    } else {
      this.setState({ activeKey: key });
    }
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

  getDeliveryTypeValue = (body, date) => {
    // console.log(body, date);
  }

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
                content: <Notification type="success" text={intl.formatMessage({ id: res.payload.code })} />,
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
      } else {
        console.log("aldaas");
      }
    });
  }

  changeChosenAddress = (item) => {
    this.setState({ chosenAddress: item });
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

  render() {
    const { deliveryTypeExpanded, loading } = this.state;
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
                <DeliveryInfo
                  onSubmitDeliveryPanel={this.onSubmitDeliveryPanel}
                  mainState={this.state}
                  changeLoading={this.changeLoading}
                  setUseEpoint={this.setUseEpoint}
                  changeCardInfo={this.changeCardInfo}
                  changeEpointUsedPoint={this.changeEpointUsedPoint}
                  {...this.props}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default injectIntl(Checkout);
