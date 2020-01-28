/* eslint-disable object-shorthand */
/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BackTop, Avatar } from "antd";
import Button from '@material-ui/core/Button';
import { store } from 'react-notifications-component';
import CryptoJS from "crypto-js";
import { isMobile } from "react-device-detect";
import store1 from "../../../src/scss/assets/images/demo/store.png";
import { Notification } from "../../components";
import { EncryptKey } from "../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  state = { loading: false }

  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext.toString().replace(/\+/g, 'xMl3Jk').replace(/\//ig, 'Por21Ld').replace(/=/g, 'Ml32');
  }

  renderTable = () => {
    const lang = this.props.intl.locale;
    try {
      const { orderdetail } = this.props;
      return orderdetail.items.map((item, index) => (
        <tr key={index} className="responsive-font14">
          <td className="column-1 padding5to10">
            <div className="flex-this">
              <div className="image-container default">
                <Link to={`${item.route}`}>
                  <span
                    className="image"
                    style={{ backgroundImage: `url(${process.env.IMAGE}${item.img})` }}
                  />
                </Link>
              </div>
              <Link to={`${item.route}`} className="text-left info-container">
                <strong><p style={{ color: "rgba(0, 0, 0, 0.5)" }}>{lang === "mn" ? item.title : item.titl_en}</p></strong>
                <span>{lang === "mn" ? item.back : item.back_en}</span>
              </Link>
            </div>
          </td>
          {
            isMobile ?
              <td>
                <p>{formatter.format(item.newprice > 0 ? item.newprice : item.price)}₮</p>
                <p>{item.orderquantity}</p>
              </td> : null
          }
          {
            !isMobile ?
              <td>
                <p>{formatter.format(item.newprice > 0 ? item.newprice : item.price)}₮</p>
              </td>
              : null
          }
          {
            !isMobile ?
              <td>
                <p>{item.orderquantity}</p>
              </td>
              : null
          }
          <td>
            <p>{formatter.format(item.orderamount)}₮</p>
            {
              item.status !== 0 ?
                <Link
                  to={`${item.route}/${this.encryptUrl(this.props.orderdetail.info.id)}`}
                  className="responsive-font10"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#FFB81C",
                    padding: "2px",
                    borderRadius: "2px",
                  }}
                >
                  <FormattedMessage id="orderDetail.info.leaveFeedback" />
                </Link>
                :
                null
            }
          </td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  }
  renderDelivery = () => {
    try {
      const { orderdetail } = this.props;
      const lang = this.props.intl.locale;
      if (orderdetail.info !== null) {
        return (
          <div className="cart-info filter-sticky" style={{ fontSize: "13px" }}>
            <div className="block">
              <p className="title">
                <strong><FormattedMessage id="shared.sidebar.label.payment" /></strong>
              </p>
              <p className="flex-space count">
                <span><FormattedMessage id="shared.sidebar.label.productPrice" />:</span>
                <strong><span>{formatter.format(orderdetail.info.itemamount)}₮</span></strong>
              </p>
              <p className="flex-space count">
                <span><FormattedMessage id="shared.sidebar.label.deliveryCost" />:</span>
                <strong><span>{formatter.format(orderdetail.info.deliveryamount)}₮</span></strong>
              </p>
              <div className="line">
                <p className="flex-space count">
                  <span><FormattedMessage id="shared.sidebar.label.paidByEpoint" />:</span>
                  <strong><span>{formatter.format(orderdetail.info.outpoint)}₮</span></strong>
                </p>
                <p className="flex-space count">
                  <span><FormattedMessage id="shared.sidebar.label.paidByCash" />:</span>
                  <strong><span>{formatter.format(orderdetail.info.totalamount - orderdetail.info.outpoint)}₮</span></strong>
                </p>
              </div>
              <p className="flex-space count">
                <span><FormattedMessage id="shared.sidebar.label.orderTotal" />:</span>
                <strong className="big" style={{ fontSize: "20px" }}>{formatter.format(orderdetail.info.totalamount)}₮</strong>
              </p>
            </div>
            <div className="block">
              <p className="title">
                <strong><FormattedMessage id="shared.sidebar.title.deliveryInfo" /></strong>
              </p>
              <div className="content">
                <h5 className="title flex-this flex-space">
                  <span style={{ fontSize: "14px" }}><FormattedMessage id="shared.sidebar.title.deliveryStatus" />:</span>
                  <p style={{
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
                    {lang === "mn" ? orderdetail.info.customerstatusname : orderdetail.info.customerstatusname_en}
                  </p>
                </h5>
                <p className="text flex-this" style={{ marginTop: "-10px" }}>
                  <i className="fa fa-truck" style={{ color: "#feb415" }} />
                  <span>{lang === "mn" ? orderdetail.info.deliveryname : orderdetail.info.deliveryname_en}</span>
                </p>
                <p className="flex-this">
                  <i className="fa fa-user" aria-hidden="true" style={{ color: "#feb415" }} />
                  <span>{orderdetail.info.custname}</span>
                </p>
                <p className="text flex-this">
                  <i className="fa fa-phone" aria-hidden="true" style={{ color: "#feb415" }} />
                  <span>{orderdetail.info.phone1}</span>
                </p>
                <p className="text flex-this">
                  <i className="fa fa-envelope" aria-hidden="true" style={{ color: "#feb415" }} />
                  <span>{orderdetail.info.email}</span>
                </p>
                <p className="text flex-this">
                  <i className="fa fa-map-marker" aria-hidden="true" style={{ color: "#feb415" }} />
                  <span>{orderdetail.info.address}</span>
                </p>
                <p className="text flex-this">
                  <i className="fa fa-calendar" aria-hidden="true" style={{ color: "#feb415" }} />
                  <span>{orderdetail.info.deliverydate.slice(0, 10)}</span>
                </p>
              </div>
            </div>
            <div style={{ width: "100% !important" }}>
              <Button className="btn btn-main" disabled={this.state.loading} variant="contained" onClick={this.handleClick} style={{ backgroundColor: "#FFB81C", marginBottom: "10px", marginTop: "10px" }}>
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
  }

  renderOrdNum = () => {
    try {
      const { orderdetail } = this.props;
      if (orderdetail.info !== null) {
        return (
          <span className="text-uppercase">
            <FormattedMessage id="orderDetail.title.orderNumber" /> #{orderdetail.info === undefined ? null : orderdetail.info.ordernumber}
          </span>
        );
      }
      return (
        <span className="text-uppercase"><FormattedMessage id="orderDetail.info.noOrders" /></span>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  handleClick = () => {
    const { intl } = this.props;
    this.setState({ loading: true });
    this.props.incrementOrderProducts({ orderid: this.props.orderdetail.info.id }).then((result) => {
      this.setState({ loading: false });
      const failedProducts = result.payload.data.fail;
      if (failedProducts.length > 0) {
        let names = failedProducts.map(prod => prod.values[1]);
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification
            type="warning"
            text={intl.formatMessage(
              { id: "208" },
              {
                name: names.join(", "),
                qty: result.payload.data.qty,
              },
            )}
          />,
        });
      }
    });
  }

  render() {
    const { orderdetail } = this.props;
    let content;
    if (this.props.location.state !== undefined && this.props.location.state.isReturn) {
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
              <h1 className="title">
                {this.renderOrdNum()}
              </h1>
              <div className="row row10">
                <div className="col-xl-8 padd0" style={{ padding: "0px !important" }}>
                  <div className="cart-table table-responsive text-right">
                    <Link to="/profile/delivery" className="btn btn-link">
                      <Avatar size="small" shape="square" src={store1} />
                      <span><FormattedMessage id="orderDetail.button.showOrderList" /></span>
                    </Link>
                    {content}
                    <table className="table table-borderless font12-mobile">
                      <thead className="thead-light" >
                        <tr>
                          <th className="column-1"><span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.productName" /></span></th>
                          {
                            isMobile ?
                              <th className="text-right">
                                <span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.unitPrice" /></span><br />
                                <span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.quantity" /></span>
                              </th> : null
                          }
                          {
                            !isMobile ?
                              <th className="text-right">
                                <span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.unitPrice" /></span>
                              </th> : null
                          }
                          {
                            !isMobile ?
                              <th className="text-right">
                                <span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.quantity" /></span>
                              </th> : null
                          }
                          <th className="text-right">
                            <span style={{ fontWeight: "700" }}><FormattedMessage id="orderDetail.table.col.totalPrice" /></span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>{orderdetail.info === undefined ? null : this.renderTable()}</tbody>
                    </table>
                  </div>
                </div>
                <div className="col-xl-4 pad10">
                  {orderdetail.info === undefined ? null : this.renderDelivery()}
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
