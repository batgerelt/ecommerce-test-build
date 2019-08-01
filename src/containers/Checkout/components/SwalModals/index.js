/* eslint-disable array-callback-return */
/* eslint-disable react/no-danger */
/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { connect } from "react-redux";
import { Collapse, Tabs, Divider, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isMobile } from "react-device-detect";

const MySwal = withReactContent(Swal);
const formatter = new Intl.NumberFormat("en-US");
// eslint-disable-next-line prefer-destructuring
const Panel = Collapse.Panel;
// eslint-disable-next-line prefer-destructuring
const TabPane = Tabs.TabPane;

class SwalModals extends React.Component {
  state = {
    chosenBank: [],
    mode: "left",
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: false,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  componentWillMount() {
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
    const { data } = this.props;
    if (data.length !== 0) {
      // eslint-disable-next-line array-callback-return
      data.map((item, i) => {
        if (item.bankid === e) {
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
    MySwal.close();
  }

  handleBackBasket = () => {
    MySwal.close();
    this.props.history.push("cart");
  }

  onSubmit = () => {
    const { checkProductZone } = this.props;
    this.props.replaceProductsRemotely({ body: checkProductZone.data }).then((res) => {
      if (res.payload.success) {
        if (res.payload.data.length === 0) {
          this.errorMsg("Уучлаарай таны сагс хоосон байна. Сагсандаа бараа нэмнэ үү ?");
          this.props.history.push("/cart");
        } else {
          MySwal.close();
          this.props.changeDeliveryType();
          this.props.callback("3");
        }
      }
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    try {
      const { chosenBank } = this.state;
      const {
        checkProductZone, type, dataValue, ordData, readyBtn,
      } = this.props;
      const { mode } = this.state;
      if (type === "delete") {
        return (
          <div className="checkout-container msg-bank">
            <div className="card-content" style={{ textAlign: "center" }}>
              <p className="text agreement-modal-text" style={{ color: "black" }}>
                {`"${checkProductZone.message}"`}
              </p>
              <p>барааг таны сонгосон хаягт хүргэх боломжгүй байна.</p>
              <div className="button-container">
                <button className="btn btn-main" onClick={this.onSubmit} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase" style={{ fontWeight: "normal" }}>Барааг сагснаас хасаад захиалгыг үргэлжлүүлэх</span>
                </button>
                <button className="btn btn-dark" onClick={this.handleChangeAddress} style={{ whiteSpace: "initial", width: "100%", marginBottom: "3%" }}>
                  <span className="text-uppercase">Хаяг солих</span>
                </button>
                <button className="btn btn-dark" onClick={this.handleBackBasket} style={{ whiteSpace: "initial", width: "100%" }}>
                  <span className="text-uppercase">Сагс руу буцах</span>
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (type === "msgBank") {
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
                            <span>{item.banknm}</span>
                          </span>
                        </li>
                      }
                      key={item.bankid}
                    >
                      <div className="col-md-12 pad10">
                        <p className="title">
                          <strong>Гүйлгээний мэдээлэл</strong>
                        </p>
                        <div className="menu-content text-left">
                          <ul className="list-unstyled">
                            <li>
                              <span>Данс</span>
                              <strong>{item.account}</strong>
                            </li>
                            <li>
                              <span>Гүйлгээний утга</span>
                              <strong>{ordData.order.ordernumber}</strong>
                            </li>
                            <li>
                              <span>Хүлээн авагчийн нэр</span>
                              <strong>{item.name}</strong>
                            </li>
                            <li>
                              <span>Мөнгөн дүн</span>
                              <strong>
                                {formatter.format(ordData.order.totalamount)}₮
                              </strong>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TabPane>
                  );
                })}
              </Tabs>
              <div className="text-right" style={{ marginTop: "10px" }}>
                <a
                  onClick={e => readyBtn(e, chosenBank, ordData, type)}
                  className="btn btn-main"
                >
                  <span className="text-uppercase">Болсон</span>
                </a>
              </div>
            </div>
          </div>
        );
      }

      if (type === "qpay") {
        return (
          <div className="checkout-container msg-bank">
            <div className="card-content">
              <div className="col-md-12 pad10">
                <p className="title">
                  <strong>Гүйлгээний мэдээлэл</strong>
                </p>
                <div className="menu-content" style={{ display: "flex" }}>
                  <div style={{ width: "50%" }}>
                    <ul className="list-unstyled">
                      <li>
                        <span>Гүйлгээний утга</span>
                        <strong>{ordData.order.ordernumber}</strong>
                      </li>
                      <li>
                        <span>Мөнгөн дүн</span>
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
                    Төлөх аргууд
                  </Divider>
                  <div className="row">{this.renderBankLogo()}</div>
                </div>
              ) : (
                  ""
                )}

              <div className="text-center" style={{ marginTop: "10px" }}>
                <a
                  onClick={e => readyBtn(e, chosenBank, ordData, type)}
                  className="btn btn-main"
                >
                  <span className="text-uppercase">Болсон</span>
                </a>
              </div>
            </div>
          </div>
        );
      }

      if (type === "paymentSuccess") {
        const {
          PaymentTypePanel, chosenInfo, paymentType, chosenBankInfo, userinfo, ordData,
        } = this.props;
        return (
          <div className="wrap">
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
                            Таны захиалга амжилттай бүртгэгдлээ
                          </span>
                        </h4>
                      </div>
                      <div className="message">
                        <h5 className="title flex-this flex-space">
                          <span className="text-uppercase">
                            Захиалга <strong>{ordData.order.ordernumber}</strong>
                          </span>
                        </h5>
                        <ul className="list-unstyled class">
                          <li className="flex-this flex-space">
                            <span>Худалдаж авсан барааны тоо:</span>
                            <strong className="big">
                              {ordData.order.orderquantity}
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>Мөнгөн дүн:</span>
                            <strong className="big">
                              {formatter.format(ordData.order.totalamount)}₮
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>Төлбөрийн төрөл:</span>
                            <strong className="big">{PaymentTypePanel.state.chosenPaymentType.name}</strong>
                          </li>
                          {paymentType !== "qpay" ? (
                            <div>
                              <li className="flex-this flex-space">
                                <span>Банк:</span>
                                <strong className="big">{chosenBankInfo.banknm}</strong>
                              </li>
                              <li className="flex-this flex-space">
                                <span>Дансны дугаар:</span>
                                <strong className="big">
                                  {chosenBankInfo.account}
                                </strong>
                              </li>
                              <li className="flex-this flex-space">
                                <span>Хүлээн авагч:</span>
                                <strong className="big">{chosenBankInfo.name}</strong>
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
                            Хүргэлтийн мэдээлэл:
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
                            {chosenInfo.length !== 0
                              ? `${chosenInfo.phonE1}, ${chosenInfo.phonE2}`
                              : ""}
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-map-marker "
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {chosenInfo.length !== 0
                              ? `${chosenInfo.provincenm},
                              ${chosenInfo.districtnm},
                              ${chosenInfo.committeenm},
                              ${chosenInfo.address}`
                              : ""}
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
                        <p>
                          Та төлбөрөө <b style={{ fontWeight: "bold" }}>2</b>{" "}
                          цагийн дотор төлснөөр таны захиалга баталгаажиж
                          идэвхжинэ. Тус хугацаанд төлбөр төлөгдөөгүй тохиолдолд
                        захиалгыг автоматаар цуцлах болохыг анхаарна уу. <br />
                          {paymentType !== "qpay" ? (
                            <div>
                              Төлбөрийг дээрх дансанд шилжүүлэх ба захиалгын
                              <b style={{ fontWeight: "bold" }}>
                                {ordData.order.ordernumber}
                              </b>{" "}
                              дугаарыг гүйлгээний утга дээр заавал бичнэ үү.
                            </div>
                          ) : (
                              ""
                            )}
                          <br />
                          <br />
                          Хүргэлттэй холбоотой лавлах зүйлс байвал доорх утсаар
                          холбогдоно уу. Баярлалаа
                        </p>
                        <strong className="text-uppercase">
                          Лавлах утас: 7611 0101
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
                            Нүүр хуудасруу буцах
                          </span>
                        </a>
                        <a
                          className="btn btn-dark"
                          onClick={(e) => {
                            MySwal.close();
                            this.props.history.push(`/order/${ordData.order.id}`);
                          }}
                        >
                          <span className="text-uppercase">Захиалга харах</span>
                        </a>
                      </div>
                      {/*  <div className="bottom-text text-center">
                      <p>И-баримтыг таны имэйлрүү явуулсан.</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default SwalModals;
