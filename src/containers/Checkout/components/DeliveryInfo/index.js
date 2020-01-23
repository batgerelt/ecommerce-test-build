/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-danger */
import React from "react";
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Checkbox, Modal, Button, Radio } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isMobile } from "react-device-detect";
import { store } from 'react-notifications-component';
import { Notification } from "../../../../components";
import { SwalModals, IndividualTab } from "../";

const RadioGroup = Radio.Group;
const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);

let interval;

class DeliveryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAgreement: false,
      modal2Visible: false,
      agreementData: [],
      chosenInfo: {},
      organizationData: [],
      notif: false,
      checkedEpoint: (props.mainState.cardInfo === null),
      giftvisible: false,
      imgnm: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillMount() {
    this.props.getUserInfo().then((res) => {
      if (res.payload.data.card !== undefined) {
        this.setState({ checkedEpoint: true });
        this.props.changeCardInfo(res.payload.data.card);
      }
    });
  }

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

  setModal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
    this.setState({ notif: false });
  }

  handleScroll = () => {
    let calcBottom =
      document.getElementById("scroll-tst").scrollHeight -
      document.getElementById("scroll-tst").scrollTop;
    let clientHeight = document.getElementById("scroll-tst").clientHeight;
    if (calcBottom === clientHeight) {
      this.timer = setTimeout(() => {
        this.setState({ notif: false });
        this.setModal2Visible(false);
      }, 200);
      document
        .getElementById("scroll-tst")
        .removeEventListener("scroll", this.handleScroll);
    }
  };

  handleAgreement = (e) => {
    this.setState({ checkedAgreement: e.target.checked, notif: false });
  };

  getAgreementData = () => {
    this.props.getStaticPage({ id: 42 }).then((res) => {
      if (res.payload.success) {
        this.setModal2Visible(true);
        document.getElementById("scroll-tst").scrollTop = 0;
        document.getElementById("scroll-tst").addEventListener("scroll", this.handleScroll);
      }
    });
  }

  handleSubmit = (e) => {
    this.setState({ loading: true });
    const {
      userinfo, products, mainState,
    } = this.props;
    if (mainState.activeKey === '2') {
      this.props.onSubmitDeliveryPanel();
      if (isMobile) {
        if (this.state.notif) {
          window.scrollTo(0, 700);
        } else {
          window.scrollTo(0, 85);
        }
      }
      if (window.innerWidth < 1024) {
        if (this.state.notif) {
          window.scrollTo(0, 700);
        } else {
          window.scrollTo(0, 85);
        }
      } else if (this.state.notif) {
        window.scrollTo(0, 700);
      } else {
        window.scrollTo(0, 85);
      }
    } else if (mainState.activeKey === '3') {
      if (!this.state.checkedAgreement) {
        if (isMobile) {
          if (this.state.notif) {
            window.scrollTo(0, 700);
          } else {
            window.scrollTo(0, 85);
          }
        }
        if (window.innerWidth < 1024) {
          if (this.state.notif) {
            window.scrollTo(0, 700);
          } else {
            window.scrollTo(0, 85);
          }
        }
        this.setState({ notif: true });
      } else if (userinfo !== undefined && userinfo !== null && userinfo.length !== 0) {
        this.props.changeLoading(true);
        let tmp = {};
        tmp.custId = userinfo.info.id;
        tmp.deliveryTypeId = mainState.chosenDelivery.id;
        tmp.custName = mainState.chosenAddress.name;
        tmp.custAddressId = mainState.chosenAddress.id;
        tmp.phone1 = mainState.chosenAddress.phone1;
        tmp.paymentType = mainState.chosenPaymentType.id;
        tmp.addPoint = 0;
        tmp.deliveryDate = mainState.chosenDate;
        tmp.usedPoint = mainState.epointUsedPoint;
        tmp.items = products;
        tmp.locId = mainState.chosenAddress.locid;
        tmp.custAddress =
          `${mainState.chosenAddress.provincenm},
          ${mainState.chosenAddress.districtnm},
          ${mainState.chosenAddress.committeenm},
          ${mainState.chosenAddress.address}`;
        tmp.address = mainState.chosenAddress.address;
        if (mainState.organizationData.length === 0) {
          tmp.taxRegno = "";
          tmp.taxName = "";
        } else {
          tmp.taxRegno = mainState.organizationData.regno;
          tmp.taxName = mainState.organizationData.name;
        }
        this.sendPayment(tmp);
      }
    }
    this.setState({ loading: false });
  }

  continueCheckout = () => {
    this.props.continueCheckout(0, false);
    this.handleSubmit();
  }

  sendPayment = (tmp) => {
    try {
      const { intl, mainState } = this.props;
      let data;
      this.props.sendCheckoutOrder({ body: tmp }).then((res) => {
        this.props.changeLoading(false);
        // MySwal.close();
        if (res.payload.success) {
          if (mainState.chosenPaymentType.id === 2) {
            data = this.props.bankInfo;
            this.openLastModal("msgBank", data, res.payload.data);
          }
          if (mainState.chosenPaymentType.id === 3) {
            interval = setInterval(() => {
              this.props.getOrderDetail({ ordid: res.payload.data.order.id }).then((response) => {
                if (response.payload.success) {
                  if (response.payload.data.info.statusid === 2) {
                    MySwal.close();
                    this.props.history.push({
                      pathname: `/qpayReturn`,
                      state: response.payload.data,
                    });
                  }
                }
              });
            }, 1000);
            this.props.clearRemotely();
            this.openLastModal("qpay", [], res.payload.data);
          }

          if (mainState.chosenPaymentType.id === 1) {
            this.changeWindow(res);
          }
        } else if (res.payload.code === "621") {
          MySwal.fire({
            html: (
              <SwalModals
                type={"continueOrder"}
                msgId={res.payload.code}
                onSubmit={this.continueCheckout}
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
        } else {
          const messages = defineMessages({
            error: {
              id: res.payload.code,
            },
          });
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification type="warning" text={intl.formatMessage(messages.error, { name: res.payload.data })} />,
          });
        }
      });
    } catch (error) {
      return console.log("Aldaa: ", error);
    }
  }

  changeWindow = (res) => {
    let mapForm = document.createElement("form");
    mapForm.target = "_self";
    mapForm.method = "POST";
    mapForm.action = res.payload.data.url.url;

    let keyNumber = document.createElement("input");
    keyNumber.type = "hidden";
    keyNumber.name = "key_number";
    keyNumber.value = res.payload.data.url.key_number;

    let transNumber = document.createElement("input");
    transNumber.type = "hidden";
    transNumber.name = "trans_number";
    transNumber.value = res.payload.data.url.trans_number;

    let trans_amount = document.createElement("input");
    trans_amount.type = "hidden";
    trans_amount.name = "trans_amount";
    trans_amount.value = res.payload.data.url.trans_amount;

    let time = document.createElement("input");
    time.type = "hidden";
    time.name = "time";
    time.value = res.payload.data.url.time;

    let lang_ind = document.createElement("input");
    lang_ind.type = "hidden";
    lang_ind.name = "lang_ind";
    lang_ind.value = res.payload.data.url.lang_ind;

    let signature = document.createElement("input");
    signature.type = "hidden";
    signature.name = "signature";
    signature.value = res.payload.data.url.signature;

    mapForm.appendChild(keyNumber);
    mapForm.appendChild(transNumber);
    mapForm.appendChild(trans_amount);
    mapForm.appendChild(time);
    mapForm.appendChild(lang_ind);
    mapForm.appendChild(signature);

    document.body.appendChild(mapForm);
    let map = window.open(res.payload.data.url.url, "_self", "");
    if (map) {
      mapForm.submit();
    } else {
      console.log('error');
    }
  }

  openLastModal = (type, data, ordData) => {
    MySwal.fire({
      html: (
        <SwalModals
          type={type}
          dataValue={data}
          interval={interval}
          ordData={ordData}
          readyBtn={this.handlePayment}
          totalQty={this.props.mainState.totalQty}
          {...this.props}
        />
      ),
      width: type === "qpay" ? "30em" : "40em",
      animation: true,
      allowEnterKey: true,
      button: false,
      onClose: this.closeSwal,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      allowOutsideClick: false,
      closeOnEsc: false,
    });
  };

  closeSwal = (e) => {
    clearInterval(interval);
  }

  handleAgreementNotif = (value) => {
    this.setState({ notif: value, checkedAgreement: value });
    if (value) {
      this.getAgreementData();
    }
  }

  handlePayment = (e, item, ordData, type, totalQty) => {
    e.preventDefault();
    this.props.clearRemotely();
    MySwal.fire({
      html: (
        <SwalModals
          type={"paymentSuccess"}
          paymentType={type}
          chosenBankInfo={item}
          chosenInfo={this.state.chosenInfo}
          ordData={ordData}
          totalQty={totalQty}
          onRef={ref => (this.SwalModals = ref)}
          {...this}
          {...this.props}
        />
      ),
      width: "40em",
      button: false,
      animation: true,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      allowOutsideClick: false,
      closeOnEsc: false,
    });
  };

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: true,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  handleCheckEpoint = (e) => {
    const { mainState } = this.props;
    let cardInfo = mainState.cardInfo;
    if (!e.target.checked) {
      if (cardInfo !== null && mainState.epointUsedPoint !== 0) {
        cardInfo.point = parseFloat(cardInfo.point) + mainState.epointUsedPoint;
        this.props.changeCardInfo(cardInfo);
        this.props.setUseEpoint(false, 0);
      }
    }
    this.setState({ checkedEpoint: e.target.checked });
  }

  showModal = (picture) => {
    this.setState({ imgnm: picture, giftvisible: true });
  }

  onCancel = () => {
    this.setState({ giftvisible: false });
  }

  render() {
    let img = process.env.IMAGE + this.state.imgnm;
    const { checkedAgreement, checkedEpoint, loading } = this.state;
    const {
      staticpage,
      intl,
      mainState,
      isLoggedIn,
    } = this.props;
    const lang = intl.locale;
    return (
      <div className="col-lg-4 pad10">
        {
          <div className="block right-panel">
            <p className="title font-weight-bold">
              <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
            </p>
            <hr />

            <div className="content">
              <p className="text flex-this">
                <i className="fa fa-truck" />
                <span>
                  {lang === "mn"
                    ? `${this.checkError(mainState.chosenDelivery.typenm)}`
                    : `${this.checkError(mainState.chosenDelivery.typenm_en)}`}
                </span>
              </p>
              <p className="text flex-this">
                <i
                  className="fa fa-user"
                  aria-hidden="true"
                />
                <span>
                  {this.checkError(mainState.chosenAddress.name)}
                </span>
              </p>
              <p className="text flex-this">
                <i
                  className="fa fa-phone"
                  aria-hidden="true"
                />
                <span>
                  {`${this.checkError(mainState.chosenAddress.phone1)}`}
                </span>
              </p>
              <div className="d-flex mb-2">
                <i
                  className="fa fa-map-marker"
                  aria-hidden="true"
                />
                <p className="text flex-this shake-rotate">
                  {
                    this.checkError(mainState.chosenDelivery.id) !== 3 ?
                      <span>
                        {
                          this.props.userinfo.main !== null ? `${this.checkError(mainState.chosenAddress.provincenm)} 
                        ${this.checkError(mainState.chosenAddress.districtnm)}
                        ${this.checkError(mainState.chosenAddress.committeenm)}
                        ${this.checkError(mainState.chosenAddress.address)}` : null
                        }
                      </span>
                      :
                      <span>
                        Улаанбаатар хот Хан-Уул дүүрэг, 1-р хороо, Хан-Уул салбар
                      </span>
                  }
                </p>
              </div>
            </div>
            <hr />
            <div className="content px-3">
              <p className="title pb-2">
                <strong><FormattedMessage id="shared.sidebar.label.payment" /></strong>
              </p>
            </div>
            <hr />
            <div className="content pb-2">
              <p className="text flex-space">
                <span><FormattedMessage id="shared.sidebar.label.products" /> ({mainState.totalQty}):</span>
                <strong>{formatter.format(mainState.totalPrice)}₮</strong>
              </p>
              <p className="text flex-space">
                <span><FormattedMessage id="shared.sidebar.label.deliveryCost" />:</span>
                <strong>{`${formatter.format(this.checkError(mainState.deliveryPrice))}₮`}</strong>
              </p>
              {
                mainState.useEpoint ?
                  <p className="text flex-space">
                    {/* <span>Имарт карт оноо:</span> */}
                    <span><FormattedMessage id="shared.sidebar.label.epoint" />:</span>
                    <strong style={{ color: "red" }}>{`-${formatter.format(mainState.epointUsedPoint)}`}₮</strong>
                  </p> : ""
              }
              <hr />
              <p className="text flex-space result-price">
                <span><FormattedMessage id="checkout.sidebar.label.totalAmount" />:</span>
                <strong>{formatter.format(mainState.totalPrice + (mainState.deliveryPrice) - (mainState.useEpoint ? mainState.epointUsedPoint : 0))}₮</strong>
              </p>
              {
                mainState.chosenRadio === 1 ?
                  <Checkbox checked={checkedEpoint} onChange={this.handleCheckEpoint} style={{ marginBottom: '10px' }}>
                    {" "}
                    <a>
                      <span>Ипойнт карт ашиглах</span>
                    </a>
                  </Checkbox>
                  : null
              }
              <br />
              {
                checkedEpoint && mainState.chosenRadio === 1 ? <IndividualTab
                  {...this.props}
                  setUseEpoint={this.props.setUseEpoint}
                  changeCardInfo={this.props.changeCardInfo}
                  changeEpointUsedPoint={this.props.changeEpointUsedPoint}
                  showModal={this.showModal}
                  getEpointSignin={this.props.getEpointSignin}
                /> : null
              }
              <Checkbox className={this.state.notif ? "agreementcheck" : ""} checked={checkedAgreement} onChange={this.handleAgreement} autoFocus={this.state.notif} />
              {" "}
              <a id="agreementId" style={{ paddingLeft: '8px' }}>
                <span onClick={e => this.handleAgreementNotif(true)} style={{ color: this.state.notif ? "red" : "", textDecoration: "underline" }}><FormattedMessage id="shared.sidebar.checkbox.acceptance" /></span>
              </a>
            </div>
          </div>
        }
        {
          !isMobile ?
            isLoggedIn ?
              <div className="sticky-btn">
                <button className="btn btn-main btn-block" onClick={this.handleSubmit} disabled={!isLoggedIn || loading}>
                  <span className="text-uppercase">
                    {
                      mainState.activeKey === "2" ? "Төлбөрийн төрөл сонгох" : <FormattedMessage id="shared.sidebar.button.pay" />
                    }
                  </span>
                </button>
              </div>
              : null : null
        }

        <Modal
          centered
          width="1000px"
          visible={this.state.modal2Visible}
          wrapClassName="vertical-center-modal"
          footer={false}
          onCancel={e => this.setModal2Visible(false)}
        >
          <div className="frame" id="scroll-tst">
            <div className="scroll">
              <div
                dangerouslySetInnerHTML={{
                  __html: intl.locale === "mn"
                    ? staticpage.description
                    : staticpage.description_en,
                }}
              />
            </div>
          </div>
        </Modal>
        <Modal
          title=""
          visible={this.state.giftvisible}
          onCancel={this.onCancel}
          closeOnEsc
          footer={null}
          className="no-padding"
        >
          <img alt="gitfImage" src={img} style={{ width: "100%" }} />
        </Modal>
      </div>
    );
  }
}

export default injectIntl((DeliveryInfo));
