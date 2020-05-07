/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { BackTop, Avatar, Divider } from "antd";
import Button from "@material-ui/core/Button";
import { store } from "react-notifications-component";
import CryptoJS from "crypto-js";
import moment from "moment";
import { isMobile } from "react-device-detect";
import cliplist from "../../../src/scss/assets/images/demo/cliplist.png";
import { Notification } from "../../components";
import { EncryptKey } from "../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  state = { loading: false };

  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext
      .toString()
      .replace(/\+/g, "xMl3Jk")
      .replace(/\//gi, "Por21Ld")
      .replace(/=/g, "Ml32");
  };

  renderTable = () => {
    const lang = this.props.intl.locale;
    try {
      const { info } = this.props.orderdetail;
      const { orderdetail } = this.props;

      return orderdetail.items.map((item, index) => {
        // is mobile
        const title = lang === "mn" ? item.title : item.title_en;
        return (
          <div
            className="product-list d-flex py-2"
            style={{ borderBottom: "1px solid #E5E5E5" }}
          >
            <div className="img-container image-container default">
              <Link to={`${item.route}`}>
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(${process.env.IMAGE}${item.img})`,
                  }}
                />
              </Link>
            </div>


            <div className="p-info-container">
              <div>
                <p className="header">
                  {title.length < 22 ? title : `${title.substring(0, 22)}...`}
                </p>
              </div>
              <div className="d-flex">
                <div>
                  <strong>
                    <p className="price footer">
                      {item.price && item.price.toLocaleString()}₮
                    </p>
                  </strong>
                </div>
                <div>
                  <p className="qty footer">
                    {info.statusid === 1 ? `0` : `${item.qty}/${item.orderquantity}`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rate-container">
              <div>
                {
              item.status !== 0 ?
                <Link
                  to={`${item.route}/${this.encryptUrl(this.props.orderdetail.info.id)}`}
                  className="responsive-font10"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#EBA50A ",
                    fontSize: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                    textAlign: "center",
                    borderRadius: "5px",
                    margin: "0px",
                  }}
                >
                  <FormattedMessage id="orderDetail.info.leaveFeedback" />
                </Link>
                :
                " "
            }
              </div>
              <div>
                <strong>
                  <p className="footer mt-3">
                    {item.orderamount && item.orderamount.toLocaleString()}₮
                  </p>
                </strong>
              </div>
            </div>

            {/* <div className="rate-container">
              <div>
                {
              item.status !== 0 ?
                <Link
                  to={`${item.route}/${this.encryptUrl(this.props.orderdetail.info.id)}`}
                  className="responsive-font10"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#EBA50A ",
                    fontSize: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                    textAlign: "center",
                    borderRadius: "5px",
                    margin: "0px",
                  }}
                >
                  <FormattedMessage id="orderDetail.info.leaveFeedback" />
                </Link>
                :
                null
            }
              </div>
              <div>
                <strong>
                  <p className="footer mt-3">
                    {item.orderamount && item.orderamount.toLocaleString()}₮
                  </p>
                </strong>
              </div>
            </div> */}
          </div>
        );
      });
    } catch (error) {
      return console.log(error);
    }
  };
  renderDelivery = () => {
    try {
      const { orderdetail } = this.props;
      const lang = this.props.intl.locale;
      if (orderdetail.info !== null) {
        const { info } = this.props.orderdetail;
        return (
          <div className="cart-info filter-sticky" style={{ fontSize: "13px" }}>
            <div className="">
              <p className="title-delivery">
                <span>
                  <strong>
                    <FormattedMessage id="shared.sidebar.label.orderDetail" />
                  </strong>
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.ordDate" />:
                </span>
                <span>{moment(info.orddate).format("YYYY-MM-DD")}</span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.ordDelDate" />:
                </span>
                <span>{moment(info.deliverydate).format("YYYY-MM-DD")}</span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.orderStatus" />:
                </span>

                <p
                  style={{
                    backgroundColor: orderdetail.info.customerstatuscolor,
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    textAlign: "center",
                    borderRadius: "5px",
                    color: "white",
                    width: "150px",
                    fontSize: "10px",
                    margin: "0px",
                  }}
                >
                  {lang === "mn"
                    ? orderdetail.info.customerstatusname
                    : orderdetail.info.customerstatusname_en}
                </p>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.ePointCard" />:
                </span>
                <span>{info.epointcard}</span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.email" />:
                </span>
                <span>{orderdetail.info.email}</span>
              </p>

            </div>


            <div className="cart-info filter-sticky">
              <p className="title-delivery">
                <strong>
                  <FormattedMessage id="shared.sidebar.label.payment" />
                </strong>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.orderAmountOri" />:
                </span>
                <span>
                  {formatter.format(orderdetail.info.totalamount + orderdetail.info.totaldiscount)}₮
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.totalDiscount" />:
                </span>
                <span>
                  {
                    formatter.format(orderdetail.info.totaldiscount === 0 ? 0 : orderdetail.info.totaldiscount * -1)
                  }
                ₮
                </span>
              </p>

              <Divider />

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.orderAmount" />:
                </span>
                <span>
                  {info.statusid === 0 ? 0 : formatter.format(orderdetail.info.totalamount)}₮
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.paidByEpoint" />:
                </span>
                <span>
                  {
                    formatter.format(orderdetail.info.outpoint === 0 ? 0 : orderdetail.info.outpoint * -1)
                  }
                ₮
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.paidByCash" />:
                </span>
                <span>{info.statusid === 1 ? 0 : formatter.format(orderdetail.info.totalamount - orderdetail.info.outpoint)}₮
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.paidByCashAmount" />:
                </span>
                <span>
                  {info.statusid === 1 ? 0 : formatter.format(orderdetail.info.paidamt)}₮
                </span>
              </p>

              <Divider />

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.returnAmount" />:
                </span>
                <span>
                  {info.returnamount ? info.returnamount.toLocaleString() : 0}₮
                </span>
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.returnStatus" />
                  :
                </span>
                {info.returnstatus === "2" && (
                  <span
                    style={{
                      background: "#16A58A",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      textAlign: "center",
                      borderRadius: "5px",
                      color: "white",
                      width: "150px",
                      fontSize: "10px",
                      margin: "0px",
                    }}
                  >
                    <FormattedMessage id="shared.sidebar.label.transactionComplete" />
                  </span>
                )}
                {(info.returnamount !== null && info.returndate === null) ? (
                  // eslint-disable-next-line react/jsx-indent
                  <span
                    style={{
                      background: "#727272",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      textAlign: "center",
                      borderRadius: "5px",
                      color: "white",
                      width: "150px",
                      fontSize: "10px",
                      margin: "0px",
                    }}
                  >
                    <FormattedMessage id="shared.sidebar.label.transactionFailed" />
                  </span>
                ) : null
                }
              </p>

              <p className="flex-space count">
                <span>
                  <FormattedMessage id="shared.sidebar.label.returnDate" />
                  :
                </span>
                <span>
                  {info.returndate &&
                    moment(info.returndate).format("YYYY-MM-DD")}
                </span>
              </p>

            </div>


            <div>

              <p className="title-delivery">
                <strong>
                  <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
                </strong>
              </p>

              <div className="content">

                <p className="flex-this">
                  <i
                    className="fa fa-map-marker"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>{orderdetail.info.address}</span>
                </p>

                <p className="text flex-this">
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>{orderdetail.info.custname}</span>
                </p>

                <p className="text flex-this">
                  <i
                    className="fa fa-phone"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>{orderdetail.info.phone1}</span>,
                  <span style={{ marginLeft: "2px" }}>
                    {orderdetail.info.phone2}
                  </span>
                </p>

                <p className="flex-this">
                  <i
                    className="fa fa-truck"
                    aria-hidden="true"
                    style={{
                      color: "#feb415",
                      marginLeft: "-2px",
                      marginRight: "2px",
                    }}
                  />
                  <span>
                    <FormattedMessage id="shared.sidebar.label.deliveryPrice" />:
                  </span>
                  <span style={{ marginLeft: "4px" }}>
                    {info.deliveryamount && info.deliveryamount.toLocaleString()}₮
                  </span>
                </p>

                <p className="text flex-this">
                  <i
                    className="fa fa-calendar"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>
                    <FormattedMessage id="shared.sidebar.label.delieveredDate" />
                    :
                  </span>
                  <span style={{ marginLeft: "2px" }}>
                    {info.statusid === 6 &&
                      moment(info.deliverydate).format("YYYY-MM-DD")}
                  </span>
                </p>

                <p
                  className="text flex-this"
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMoneyCheck}
                    style={{ color: "#feb415" }}
                  />
                  <span style={{
                    marginLeft: "18px",
                  }}
                  >
                    <FormattedMessage id="shared.sidebar.label.pricedAmount" />:
                  </span>
                  <span style={{
                    marginLeft: "2px",
                  }}
                  >
                    {info.statusid === 6 ? info.pickedamount.toLocaleString() : 0}₮
                  </span>
                </p>

              </div>
            </div>


            <div style={{ width: "100% !important" }}>
              <Button
                className="btn btn-main"
                disabled={this.state.loading}
                variant="contained"
                onClick={this.handleClick}
                style={{
                  backgroundColor: "#FFB81C",
                  marginBottom: "10px",
                  marginLeft: "8%",
                  marginTop: "10px",
                }}
              >
                <span>Захиалгыг сагсанд нэмэх</span>
              </Button>
            </div>
          </div>
        );
      }
      return null;
    } catch (error) {
      return console.log(error);
    }
  };

  renderOrdNum = () => {
    try {
      const { orderdetail } = this.props;
      if (orderdetail.info !== null) {
        return (
          <span className="text-uppercase">
            <FormattedMessage id="orderDetail.title.orderNumber" /> #
            {orderdetail.info === undefined
              ? null
              : orderdetail.info.ordernumber}
          </span>
        );
      }
      return (
        <span className="text-uppercase">
          <FormattedMessage id="orderDetail.info.noOrders" />
        </span>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  handleClick = () => {
    const { intl } = this.props;
    this.setState({ loading: true });
    this.props
      .incrementOrderProducts({ orderid: this.props.orderdetail.info.id })
      .then((result) => {
        this.setState({ loading: false });
        const failedProducts = result.payload.data.fail;
        if (failedProducts.length > 0) {
          let names = failedProducts.map((prod) => prod.values[1]);
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: (
              <Notification
                type="warning"
                text={intl.formatMessage(
                  { id: "208" },
                  {
                    name: names.join(", "),
                    qty: result.payload.data.qty,
                  }
                )}
              />
            ),
          });
        }
      });
  };

  render() {
    const { orderdetail } = this.props;
    let content;
    if (
      this.props.location.state !== undefined &&
      this.props.location.state.isReturn
    ) {
      content = (
        <div className="empty-cart">
          <FontAwesomeIcon icon={["fas", "money-bill-wave"]} />
          {this.props.location.state.return.payload.data.message}
        </div>
      );
    }
    return (
      <div className="section orderdetail">
        <div className="top-container">
          <div className="container">
            <div className="cart-container after-order">
              <h1 className="title">{this.renderOrdNum()}</h1>
              <div className="row row10">
                <div
                  className="col-xl-8 padd0"
                  style={{ padding: "0px" }}
                >
                  <div
                    className="cart-table table-responsive text-right"
                    style={{ paddingLeft: "2%", paddingRight: "2%", }}
                  >
                    <Link to="/profile/delivery" className="btn btn-link">
                      <Avatar size="medium" shape="square" src={cliplist} />
                      <span>
                        <FormattedMessage id="orderDetail.button.showOrderList" />
                      </span>
                    </Link>
                    <div>
                      <p className="title-delivery">
                        <span>
                          <strong>
                            <FormattedMessage id="cart.table.productInfo" />
                          </strong>
                        </span>
                      </p>
                    </div>
                    {content}
                    {orderdetail.info === undefined ? null : this.renderTable()}
                  </div>
                </div>
                <div
                  className="col-xl-4 pad10"
                  style={{ paddingTop: "26px", paddingLeft: "2%", paddingRight: "2%", }}
                >
                  {orderdetail.info === undefined
                    ? null
                    : this.renderDelivery()}
                </div>
              </div>
            </div>
            <BackTop />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(List);
