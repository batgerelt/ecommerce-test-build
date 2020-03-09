/* eslint-disable consistent-return */
/* eslint-disable react/no-string-refs */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, Spin, message, Modal, DatePicker } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isMobile } from "react-device-detect";
import { store } from 'react-notifications-component';
import moment from "moment";
import {
  LoginRegisterPanel,
  PaymentTypePanel,
  PaymentPanel,
  DeliveryInfo,
  DeliveryPanel,
  SwalModals,
} from "./components";
import { Loader, Notification } from "../../components";
import DateModal from "./components/DateModal";

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
      cardInfo: [],
      ePointServer: {},
      freeCond: 0,
      submitLoading: false,
      deliveryPrice: 0,
      visible: false,

      dateClick: false,
      zoneSet: null,
      chosenDeliveryCycleId: null,
      deliveryDesc: null,
      timeType: [],
      phone2: null,

      openModal: true,
    };
  }

  OpenModal = () => {
    this.setState({ openModal: false });
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

  componentWillReceiveProps(nextProps) {
    if (this.props.products !== nextProps.products) {
      this.setState({ totalPrice: this.getTotalPrice(nextProps.products), totalQty: this.getTotalQty(nextProps.products) }, () => {
        this.changeDeliveryTab(this.state.chosenDelivery);
      });
    }
  }

  getEpointSignin = () => {
    if (localStorage.getItem('emartmall_token') !== null) {
      this.props.getEpoint().then((res) => {
        this.setState({ cardInfo: res.payload.data, ePointServer: res.payload });
      });
    }
  }

  componentWillMount = () => {
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
    this.getDeliveryPrice();
  }

  getDeliveryPrice = (last, isNew) => {
    if (localStorage.getItem('emartmall_token') !== null) {
      if (this.state.chosenDelivery.id === 1) {
        if (last === false) {
          this.setState({ deliveryPrice: 0 });
        }
        if (this.props.userinfo.main !== null) {
          let type = "1";
          if (this.state.chosenDelivery.id !== undefined) {
            type = this.state.chosenDelivery.id;
          }
          let skus = [];
          this.props.products.map((ind) => {
            skus.push(ind.skucd);
          });
          let orderAmount = this.state.totalPrice === 0 ? this.getTotalPrice(this.props.products) : this.state.totalPrice;
          const param = {
            typeid: type,
            deliveryDate: this.state.chosenDate === null ? moment(new Date(), "YYYY-MM-DD") : this.state.chosenDate,
            locid: this.state.chosenAddress.locid === undefined ? this.props.userinfo.main.locid : this.state.chosenAddress.locid,
            orderAmount,
            skucdList: skus,
          };
          if (this.state.addresstype === "new" && last === false) {
            this.setState({ deliveryPrice: 0 });
          } else {
            this.props.getDeliveryPrice({ body: { ...param } }).then((res) => {
              if (res.payload.success) {
                this.setState({ deliveryPrice: res.payload.data.price });
              }
            });
          }
        }

        if (last === true) {
          let type = "1";
          if (this.state.chosenDelivery.id !== undefined) {
            type = this.state.chosenDelivery.id;
          }
          let skus = [];
          this.props.products.map((ind) => {
            skus.push(ind.skucd);
          });
          let orderAmount = this.state.totalPrice === 0 ? this.getTotalPrice(this.props.products) : this.state.totalPrice;
          const param = {
            typeid: type,
            deliveryDate: this.state.chosenDate === null ? moment(new Date(), "YYYY-MM-DD") : this.state.chosenDate,
            locid: this.state.chosenAddress.locid,
            orderAmount,
            skucdList: skus,
          };
          this.props.getDeliveryPrice({ body: { ...param } }).then((res) => {
            if (res.payload.success) {
              this.setState({ deliveryPrice: res.payload.data.price });
            }
          });
        }
      }

      if (this.state.chosenDelivery.id === 2) {
        let type = "1";
        if (this.state.chosenDelivery.id !== undefined) {
          type = this.state.chosenDelivery.id;
        }
        let skus = [];
        this.props.products.map((ind) => {
          skus.push(ind.skucd);
        });
        let orderAmount = this.state.totalPrice === 0 ? this.getTotalPrice(this.props.products) : this.state.totalPrice;
        const param = {
          typeid: type,
          deliveryDate: this.state.chosenDate === null ? moment(new Date(), "YYYY-MM-DD") : this.state.chosenDate,
          locid: this.state.chosenAddress.locid === undefined ? this.props.userinfo.main.locid : this.state.chosenAddress.locid,
          orderAmount,
          skucdList: skus,
        };
        this.props.getDeliveryPrice({ body: { ...param } }).then((res) => {
          this.setState({ deliveryPrice: res.payload.data.price });
        });
      }

      if (this.state.chosenDelivery.id === 3) {
        const param = {
          type: "3",
        };
        this.props.getDeliveryPrice({ body: { ...param } }).then((res) => {
          this.setState({ deliveryPrice: res.payload.data.price });
        });
      }
    }
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

  changeDeliveryTab = (item, last) => {
    const { totalPrice } = this.state;
    if (totalPrice >= item.freecondition && item.freecondition !== 0) {
      this.setState({ freeCond: item.price });
      item.price = 0;
    } else {
      item.price += this.state.freeCond;
      this.setState({ freeCond: 0 });
    }
    this.setState({ chosenDelivery: item }, () => this.getDeliveryPrice(last));
  }

  getDeliveryTypeValue = (body, date) => { }

  changeChosenDate = (item, changeCom, click) => {
    let temp = moment(item).format('YYYY-MM-DD');
    this.setState({ chosenDate: item }, () => (click === true ? this.getDeliveryPrice(changeCom) : null));
    this.props.getDeliveryTime({ deliverydate: temp }).then((res) => {
      this.setState({ timeType: res.payload.data, chosenDeliveryCycleId: res.payload.data[0].id });
    });
  }

  changechosenDeliveryCycleId = (temp, item, timeType) => {
    let last = true;
    this.clickDate();
    this.setState({ chosenDeliveryCycleId: temp, chosenDate: item, timeType }, () => this.getDeliveryPrice(last));
  }

  scrollTo = (top, left) => {
    window.scroll({
      top,
      left,
      behavior: 'smooth',
    });
  }

  callback = (key) => {
    const { activeKey } = this.state;
    if (key === "3" && activeKey === "2") {
      this.onSubmitDeliveryPanel();
    } else if (key === "2" && activeKey === "3") {
      this.setState({ activeKey: "2" });
    } else {
      this.setState({ activeKey: key });
    }
  };

  changeChosenAddress = (item, last, isNew) => {
    if (this.props.userinfo.main !== null) {
      this.setState({ chosenAddress: item }, this.getDeliveryPrice(last, isNew));
    } else {
      item.name = this.props.userinfo.info.firstname;
      item.phone1 = this.props.userinfo.info.phone1;
      item.address = this.props.userinfo.info.address;
      this.setState({ chosenAddress: item }, () => this.getDeliveryPrice(last, isNew));
    }
  }

  changeAddressType = (item) => {
    this.setState({ addresstype: item });
  }

  changeAddress = () => {
    this.setState({ activeKey: "2" });
  }

  changeZoneSet = (item) => {
    this.setState({ zoneSet: item });
  }

  clickDate = () => {
    this.setState({ dateClick: true });
  }

  clickDateFalse = () => {
    this.setState({ dateClick: false });
  }

  onSubmitDeliveryPanel = (e) => {
    e !== undefined ? e.preventDefault() : '';
    if (!this.state.dateClick) {
      this.state.deliveryPanelForm.validateFields(async (err, values) => {
        if (!err) {
          MySwal.fire({
            html: (
              <SwalModals
                visible={this.state.visible}
                type={"date"}
                data={[]}
                ordData={[]}
                onRef={ref => (this.SwalModals = ref)}
                chosenDate={this.state.chosenDate}
                zoneSet={this.state.zoneSet}
                getDeliveryTime={this.props.getDeliveryTime}
                clickDate={this.clickDate}
                chosenDeliveryCycleId={this.state.chosenDeliveryCycleId}
                changeChosenDate={this.changeChosenDate}
                changechosenDeliveryCycleId={this.changechosenDeliveryCycleId}
                deliveryId={this.state.chosenDelivery.id}
                openModal={this.state}

              />
            ),
            animation: true,
            button: false,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            closeOnEsc: true,
          });
        }
      });
    } else {
      let isEmail = true;
      let isReturn = true;
      const { chosenAddress, addresstype, chosenDelivery } = this.state;
      const {
        products,
        userinfo,
        intl,
      } = this.props;

      this.state.deliveryPanelForm.validateFields(async (err, values) => {
        if (!err) {
          this.setState({ phone2: values.phone2, deliveryDesc: values.explanation });
          chosenAddress.phone1 !== values.phone1 ? chosenAddress.phone1 = values.phone1 : null;
          chosenAddress.name !== values.name ? chosenAddress.name = values.name : null;
          chosenAddress.address !== values.address ? values.address !== undefined ? chosenAddress.address = values.address : null : null;

          if (values.email !== undefined && userinfo.info.email === null) {
            let result = await this.props.addUserEmail(values.email);
            if (!result.payload.success) {
              isEmail = false;
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: false,
                },
                content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
              });
            }
          }

          let body = {};
          body.id = chosenAddress.id;
          body.custid = 1;
          body.locid = chosenAddress.locid;
          body.name = values.name;
          body.phonE1 = values.phone1;
          body.address = chosenAddress.address === undefined ? values.address : chosenAddress.address;
          body.provincenm = chosenAddress.provincenm;
          body.districtnm = chosenAddress.districtnm;
          body.committeenm = chosenAddress.committeenm;

          if (addresstype === "new" && chosenDelivery.id !== 3) {
            this.props.addAddress({ body }).then((res) => {
              if (res.payload.success) {
                chosenAddress.id = res.payload.data;
                body.id = res.payload.data;
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
                    duration: 3000,
                    onScreen: false,
                  },
                  content: <Notification type="success" text={intl.formatMessage({ id: res.payload.message })} />,
                });
              }
            });
          }

          if (products.length !== 0) {
            if (chosenDelivery.id === 3 || chosenDelivery.id === 2) {
              if (isEmail) {
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
              await this.props.getCheckProductZone({ body: tmp, locid }).then((res) => {
                this.changeLoading(false);
                if (res.payload.success) {
                  if (isEmail) {
                    this.changeDeliveryType(true);
                    this.setState({ activeKey: "3" });
                    let paymentType = document.getElementById("paymentType");
                    paymentType.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }
                } else {
                  isReturn = false;
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
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    closeOnEsc: false,
                  });
                }
              });
            }
          }
          if (isEmail && isReturn) {
            this.setState({ activeKey: "3" });
          }
        }
      });
    }
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
    console.log("end darlaa");
    this.DeliveryInfo.handleSubmit();
  }

  render() {
    const {
      submitLoading,
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
                          activeKey={this.checkLoggedIn() ? this.state.activeKey : "1"}
                          onChange={this.callback}
                          accordion
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
                              visible={this.state.visible}
                              clickDate={this.clickDate}
                              clickDateFalse={this.clickDateFalse}
                              changeZoneSet={this.changeZoneSet}
                              changechosenDeliveryCycleId={this.changechosenDeliveryCycleId}
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
                  localStorage.getItem("emartmall_token") ?
                    <DeliveryInfo
                      onRef={ref => (this.DeliveryInfo = ref)}
                      onSubmitDeliveryPanel={this.onSubmitDeliveryPanel}
                      mainState={this.state}
                      changeLoading={this.changeLoading}
                      setUseEpoint={this.setUseEpoint}
                      changeCardInfo={this.changeCardInfo}
                      container={this.container}
                      changeEpointUsedPoint={this.changeEpointUsedPoint}
                      getEpointSignin={this.getEpointSignin}
                      {...this.props}
                    /> : null
                }
                <div className="col-lg-8 pad10" />
                {
                  isMobile ?
                    isLoggedIn ?
                      <div className="sticky-btn">
                        <button className="btn btn-main btn-block" onClick={this.handleSubmit} disabled={!isLoggedIn || submitLoading}>
                          <span className="text-uppercase">
                            {activeKey === "2" ? "Төлбөрийн төрөл сонгох" : <FormattedMessage id="shared.sidebar.button.pay" />}
                          </span>
                        </button>
                      </div>
                      : null : null
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
