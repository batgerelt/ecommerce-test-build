/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-danger */
/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { defineMessages } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Collapse, Tabs, Divider, Button, DatePicker, Col, Row, Select, Form, Input } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isMobile } from "react-device-detect";

import { intl } from '../../../../components/IntlGlobalProvider';
import { EncryptKey } from "../../../../utils/Consts";
import DateModal from "../DateModal";

const MySwal = withReactContent(Swal);
const formatter = new Intl.NumberFormat("en-US");
// eslint-disable-next-line prefer-destructuring
const Panel = Collapse.Panel;
// eslint-disable-next-line prefer-destructuring
const TabPane = Tabs.TabPane;
const { Option } = Select;

class SwalModals extends Component {
  state = {
    chosenBank: [],
    mode: "left",
  };

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: false,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { type } = this.props;
    if (type === "msgBank") {
      const { dataValue } = this.props;
      if (dataValue.length !== 0) {
        this.setState({ chosenBank: dataValue[0] });
      }
    }
  }

  getOrderDate = () => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year} оны ${month} сарын ${day} ны өдөр`;
  };

  changeTab = (e) => {
    const { dataValue } = this.props;
    if (dataValue.length !== 0) {
      // eslint-disable-next-line array-callback-return
      dataValue.map((item, i) => {
        if (item.bankid === parseInt(e)) {
          this.setState({ chosenBank: item });
        }
      });
    }
  };

  renderBankLogo = () => {
    const { ordData } = this.props;
    let tmp;
    if (ordData.qpay.qPay_deeplink.length !== 0) {
      tmp = ordData.qpay.qPay_deeplink.map((item, i) => {
        return (
          <div className="checkout-qpay" key={i}>
            <a href={item.link}>
              <img
                alt="logo"
                src={process.env.IMAGE + item.url}
                height="80px"
                style={{ marginBottom: "5px" }}
              />
              <center>{item.name}</center>
            </a>
          </div>
        );
      });
    }
    return tmp;
  };

  handleChangeAddress = () => {
    this.props.changeAddress();
    MySwal.close();
  }

  handleBackBasket = () => {
    MySwal.close();
    this.props.history.push("cart");
  }

  scrollTo = (top, left) => {
    window.scroll({
      top,
      left,
      behavior: 'smooth',
    });
  }

  onClose = () => {
    MySwal.close();
  }

  onSubmit = () => {
    const { checkProductZone } = this.props;
    this.props.replaceProductsRemotely({ body: checkProductZone.data.skucds }).then((res) => {
      if (res.payload.success) {
        if (res.payload.data.length === 0) {
          this.errorMsg("Уучлаарай таны сагс хоосон байна. Сагсандаа бараа нэмнэ үү ?");
          this.props.history.push("/cart");
        } else {
          MySwal.close();
          this.props.changeDeliveryType(true);
          this.props.callback("3");
        }
      }
    });
  }

  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext.toString().replace(/\+/g, 'xMl3Jk').replace(/\//ig, 'Por21Ld').replace(/=/g, 'Ml32');
  }

  // eslint-disable-next-line consistent-return
  render() {
    try {
      const { chosenBank } = this.state;
      const {
        checkProductZone, type, dataValue, ordData, readyBtn, totalQty, intl,
      } = this.props;
      const { mode } = this.state;
      const { getFieldDecorator } = this.props.form;
      if (type === "continueOrder") {
        const { msgId, onSubmit } = this.props;
        const messages = defineMessages({
          warning: {
            id: msgId,
          },
        });

        return (
          <div className="checkout-container msg-bank">
            <div className="card-content" style={{ textAlign: "center" }}>
              <div dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.warning) }} />

              <div className="button-container">
                <button className="btn btn-main" onClick={e => onSubmit(e)} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase" style={{ fontWeight: "normal" }}>
                    {intl.formatMessage({ id: "checkout.swal.button.continueCheckOut" })}
                  </span>
                </button>
                <button className="btn btn-dark" onClick={this.handleBackBasket} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase">
                    {intl.formatMessage({ id: "checkout.swal.button.backToCart" })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (type === "delete") {
        const messages = defineMessages({
          warning: {
            id: "checkout.swal.delivery.error",
          },
        });

        return (
          <div className="checkout-container msg-bank">
            <div className="card-content" style={{ textAlign: "center" }}>
              <div style={{ maxHeight: "290px", overflow: "auto", marginBottom: "10px" }}>
                {
                  checkProductZone.data.skunms.map((item, index) => {
                    return <p style={{ textAlign: "left" }} key={index}>{item}</p>;
                  })
                }
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong><p>дээрх барааг таны сонгосон хаягт хүргэх боломжгүй байна.</p></strong>
              </div>

              <div className="button-container">
                <button className="btn btn-main" onClick={this.onSubmit} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase" style={{ fontWeight: "normal" }}>
                    {intl.formatMessage({ id: "checkout.swal.button.removeFromCartAndProceed" })}
                  </span>
                </button>
                <button className="btn btn-dark" onClick={this.handleChangeAddress} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase">
                    {intl.formatMessage({ id: "checkout.swal.button.changeAddress" })}
                  </span>
                </button>
                <button className="btn btn-dark" onClick={this.handleBackBasket} style={{ whiteSpace: "initial", width: "100%" }}>
                  <span className="text-uppercase">
                    {intl.formatMessage({ id: "checkout.swal.button.backToCart" })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (type === "msgBank") {
        const { paymentType } = this.props;
        const messages = defineMessages({
          warning2: {
            id: "checkout.swal.info.orderCancellation",
          },
          warning3: {
            id: "checkout.swal.info.orderPayment",
          },
        });
        return (
          <div className="checkout-container msg-bank">
            <div className="card-content">
              <Tabs
                tabPosition={isMobile ? "top" : mode}
                onChange={this.changeTab}
              >
                {dataValue.map((item, i) => {
                  return (
                    <TabPane
                      tab={
                        <li
                          className="active"
                          style={{ textAlign: "left", fontWeight: "100" }}
                        >
                          <span className="contain">
                            <img
                              alt="logo"
                              src={`${process.env.IMAGE}${item.logo}`}
                              style={{ marginRight: "5px" }}
                              width="22px"
                            />
                            <span>{intl.locale === "mn" ? item.banknm : item.banknm_en}</span>
                          </span>
                        </li>
                      }
                      key={item.bankid}
                    >
                      <div className="col-md-12 pad10">
                        {/* <p className="title">
                          <strong>
                            {intl.formatMessage({ id: "checkout.swal.label.transactionInfo" })}
                          </strong>
                        </p> */}
                        {/* paymentType !== "qpay" ? (
                          <div className="text d-flex chosen-bank-message-container">
                            <i
                              className="fa fa-info"
                              aria-hidden="true"
                            />
                            <p className="text flex-this">{intl.formatMessage(messages.warning3, { orderNumber: ordData.order.ordernumber })}</p>
                          </div>
                        ) : (
                            ""
                          ) */}
                        <div className="menu-content text-left">
                          <div className="col-md-12">
                            {
                              paymentType !== "qpay" ? (
                                <div style={{ fontWeight: 'bold' }}>
                                  <p
                                    className="text"
                                    style={{
                                      paddingLeft: '0px',
                                      fontWeight: 'normal',
                                      fontSize: "13px",
                                      textAlign: 'justify',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.warning3, { orderNumber: `<b class="color-red">${ordData.order.ordernumber}</b>` }) }}
                                  />
                                  <br />
                                </div>
                              ) : (
                                  ""
                                )
                            }
                          </div>
                          <div style={{ display: "flex" }}>
                            <div className="col-md-6">
                              <ul className="list-unstyled">
                                <li>
                                  <span className="fontWeight-normal">
                                    {intl.formatMessage({ id: "checkout.swal.label.account" })}
                                  </span>
                                  <strong className="strong-500">{item.account}</strong>
                                </li>
                                <li>
                                  <span className="fontWeight-normal">
                                    {intl.formatMessage({ id: "checkout.swal.label.transactionDescription" })}
                                  </span>
                                  <strong className="strong-500">{ordData.order.ordernumber}</strong>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <ul className="list-unstyled">
                                <li>
                                  <span className="fontWeight-normal">
                                    {intl.formatMessage({ id: "checkout.swal.label.receiverName" })}
                                  </span>
                                  <strong className="strong-500">{item.name}</strong>
                                </li>
                                <li>
                                  <span className="fontWeight-normal">
                                    {intl.formatMessage({ id: "checkout.swal.label.amount" })}
                                  </span>
                                  <strong className="strong-500">
                                    {formatter.format(ordData.order.payamount)}₮
                                  </strong>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="text d-flex chosen-bank-message-container pad-bot-0" style={{ marginTop: "10px" }}>
                          <i
                            className="fa fa-info"
                            aria-hidden="true"
                          />
                          <p style={{ fontSize: "13px", textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.warning2, { hours: `<b class="fontBold">24</b>` }) }} />
                        </div>
                      </div>
                    </TabPane>
                  );
                })}
              </Tabs>
              <div className="text-right" style={{ marginTop: "10px", paddingRight: "10px" }}>
                <a
                  onClick={e => readyBtn(e, chosenBank, ordData, type, totalQty)}
                  className="btn btn-main"
                >
                  <span className="text-uppercase">
                    {intl.formatMessage({ id: "checkout.swal.label.done" })}
                  </span>
                </a>
              </div>
            </div>
          </div>
        );
      }

      if (type === "qpay") {
        const { interval } = this.props;
        return (
          <div className="checkout-container msg-bank">
            <div className="card-content">
              <div className="col-md-12 pad10">
                <p className="title">
                  <strong>
                    {intl.formatMessage({ id: "checkout.swal.label.qpayTransactionInfo" })}
                  </strong>
                </p>
                <div className="menu-content" style={{ display: "flex" }}>
                  <div style={{ width: "50%" }}>
                    <ul className="list-unstyled">
                      <li>
                        <span>
                          {intl.formatMessage({ id: "checkout.swal.label.transactionDescription" })}
                        </span>
                        <strong>{ordData.order.ordernumber}</strong>
                      </li>
                      <li>
                        <span>
                          {intl.formatMessage({ id: "checkout.swal.label.amount" })}
                        </span>
                        <strong>
                          {formatter.format(ordData.order.payamount)}₮
                        </strong>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img
                      alt="qr code"
                      src={`data:image/png;base64, ${ordData.qpay.qPay_QRimage}`}
                      className="qr-code img-fluid"
                      height="200px"
                    />
                  </div>
                </div>
              </div>
              {isMobile ? (
                <div>
                  <Divider style={{ color: "rgba(0, 0, 0, 0.5)" }}>
                    {intl.formatMessage({ id: "checkout.swal.label.transactionMethods" })}
                  </Divider>
                  <div className="row">{this.renderBankLogo()}</div>
                </div>
              ) : (
                  ""
                )}

              <div className="text-center" style={{ marginTop: "10px" }}>
                <a
                  onClick={(e) => {
                    clearInterval(interval);
                    readyBtn(e, chosenBank, ordData, type);
                  }}
                  className="btn btn-main"
                >
                  <span className="text-uppercase">
                    {intl.formatMessage({ id: "checkout.swal.label.done" })}
                  </span>
                </a>
              </div>
            </div>
          </div>
        );
      }

      if (type === "paymentSuccess") {
        const {
          chosenInfo, paymentType, chosenBankInfo, userinfo, ordData, mainState,
        } = this.props;
        const messages = defineMessages({
          warning1: {
            id: "checkout.swal.label.orderNumber",
          },
          warning2: {
            id: "checkout.swal.info.orderCancellation",
          },
          warning3: {
            id: "checkout.swal.info.orderPayment",
          },
        });
        return (
          <div className="wrap" >
            <div className="success-message-container">
              <div className="container pad10">
                <div className="row row10">
                  <div className="offset-md-1 col-md-10 pad10">
                    <div className="content">
                      <div className="text-center">
                        <img
                          alt="image"
                          src={require("../../../../scss/assets/images/demo/4.png")}
                          width="80px"
                        />
                        <h4 className="title">
                          <span className="text-uppercase">
                            {intl.formatMessage({ id: "checkout.swal.info.success" })}
                          </span>
                        </h4>
                      </div>
                      <div className="message">
                        <h5 className="title flex-this flex-space">
                          <span
                            className="text-uppercase"
                            dangerouslySetInnerHTML={{
                              __html: intl.formatMessage(messages.warning1, {
                                orderNumber: `<strong>${ordData.order.ordernumber}</strong>`,
                              }),
                            }}
                          />
                        </h5>
                        <ul className="list-unstyled class">
                          <li className="flex-this flex-space">
                            <span>
                              {intl.formatMessage({ id: "checkout.swal.label.productsCount" })}
                            </span>
                            <strong className="big">
                              {totalQty}
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>
                              {intl.formatMessage({ id: "checkout.swal.label.amount" })}:
                            </span>
                            <strong className="big">
                              {formatter.format(ordData.order.payamount)}₮
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>
                              {intl.formatMessage({ id: "checkout.swal.label.paymentType" })}:
                            </span>
                            <strong className="big">{intl.locale === "mn" ? mainState.chosenPaymentType.name : mainState.chosenPaymentType.name_en}</strong>
                          </li>
                          {paymentType !== "qpay" ? (
                            <div>
                              <li className="flex-this flex-space">
                                <span>
                                  {intl.formatMessage({ id: "checkout.swal.label.bank" })}:
                                </span>
                                <strong className="big">{intl.locale === "mn" ? chosenBankInfo.banknm : chosenBankInfo.banknm_en}</strong>
                              </li>
                              <li className="flex-this flex-space">
                                <span>
                                  {intl.formatMessage({ id: "checkout.swal.label.accountNumber" })}:
                                </span>
                                <strong className="big">
                                  {chosenBankInfo.account}
                                </strong>
                              </li>
                              <li className="flex-this flex-space">
                                <span>
                                  {intl.formatMessage({ id: "checkout.swal.label.receiver" })}:
                                </span>
                                <strong className="big">{intl.locale === "mn" ? chosenBankInfo.name : chosenBankInfo.name_en}</strong>
                              </li>
                            </div>
                          ) : (
                              ""
                            )}
                        </ul>
                      </div>
                      <div className="user-detail text-left">
                        <h5 className="title flex-this flex-space">
                          <span className="text-uppercase">
                            {intl.formatMessage({ id: "shared.sidebar.title.deliveryInfo" })}:
                          </span>
                        </h5>
                        <p className="text flex-this">
                          <i
                            className="fa fa-user"
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {`${ordData.delivery.custname}`}
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-phone "
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {" "}
                            {mainState.chosenAddress.length !== 0
                              ? `${mainState.chosenAddress.phone1}`
                              : ""}
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-envelope"
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {ordData.mail}
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-map-marker "
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {
                              ordData.delivery.deliverytype !== 3 ?
                                mainState.chosenAddress.length !== 0
                                  ? `${mainState.chosenAddress.provincenm},
                              ${mainState.chosenAddress.districtnm},
                              ${mainState.chosenAddress.committeenm},
                              ${mainState.chosenAddress.address}`
                                  : "" : "Улаанбаатар хот Хан-Уул дүүрэг, 1-р хороо, Хан-Уул салбар"
                            }
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-calendar"
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>{ordData.order.deliverydate.substring(0, 10)}</span>
                        </p>
                      </div>
                      <div className="bottom-text text-center">
                        <div style={{ fontSize: '0.8rem' }}>
                          {intl.formatMessage({ id: "checkout.swal.label.sentEbarimt" })}
                          {/* intl.formatMessage({ id: "checkout.swal.info.contract" }) */}
                        </div>
                        <strong className="text-uppercase">
                          {intl.formatMessage({ id: "checkout.swal.label.contract" })}: 7611 0101
                        </strong>
                      </div>
                      <div className="btn-container text-center">
                        <a
                          className="btn btn-main"
                          onClick={(e) => {
                            MySwal.close();
                            this.props.history.push("/");
                          }}
                        >
                          <span className="text-uppercase">
                            {intl.formatMessage({ id: "checkout.swal.label.backToHomepage" })}
                          </span>
                        </a>
                        <br /><br />
                        <a
                          className="btn btn-dark"
                          onClick={(e) => {
                            MySwal.close();
                            this.props.history.push(`/order/${this.encryptUrl(ordData.order.id)}`);
                          }}
                        >
                          <span className="text-uppercase">
                            {intl.formatMessage({ id: "checkout.swal.label.showOrders" })}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (type === "date") {
        return (
          <DateModal
            visible
            onClose={this.onClose}
            {...this.props}
          />
        );
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Form.create({ name: "Modal" })(SwalModals);
