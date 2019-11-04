/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BackTop, Avatar } from "antd";
import store from "../../../src/scss/assets/images/demo/store.png";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  renderTable = () => {
    const lang = this.props.intl.locale;
    try {
      const { orderdetail } = this.props;
      return orderdetail.items.map((item, index) => (
        <tr key={index}>
          <td>
            <div className="flex-this">
              <div className="image-container default">
                <Link to={item.route}>
                  <span
                    className="image"
                    style={{ backgroundImage: `url(${process.env.IMAGE}${item.img})` }}
                  />
                </Link>
              </div>
              <div className="info-container">
                <strong>{lang === "mn" ? item.title : item.titl_en}</strong>
                <span>{lang === "mn" ? item.back : item.back_en}</span>
              </div>
            </div>
          </td>
          <td>
            <p className="price" style={{ float: "right" }}>
              {formatter.format(item.newprice > 0 ? item.newprice : item.price)}₮
            </p>
          </td>
          <td>
            <p className="price total" style={{ float: "right" }}>
              {item.orderquantity}
            </p>
          </td>
          <td>
            <p className="price total" style={{ float: "right" }}>
              <strong>{formatter.format(item.orderamount)}₮</strong>
            </p>
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
      console.log("orderdetail", orderdetail);
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
                  <span>{orderdetail.info.phone1}, {orderdetail.info.phone2}</span>
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
          <div className="container pad10">
            <div className="cart-container after-order">
              <h1 className="title">
                {this.renderOrdNum()}
              </h1>
              <div className="row row10">
                <div className="col-xl-8 pad10">
                  <div className="row">
                    <div className="col">
                      <Link
                        to="/profile/delivery"
                        className="btn btn-link pull-right"
                      >
                        <Avatar size="small" shape="square" src={store} />
                        <span style={{ fontSize: "14.4px" }}> <FormattedMessage id="orderDetail.button.showOrderList" /></span>
                      </Link>
                    </div>
                  </div>
                  <div className="cart-table table-responsive">
                    {content}
                    <table className="table table-borderless">
                      <thead className="thead-light">
                        <tr>
                          <th className="column-1"><FormattedMessage id="orderDetail.table.col.productName" /></th>
                          <th className="column-2">
                            <span style={{ float: "right" }}><FormattedMessage id="orderDetail.table.col.unitPrice" /></span>
                          </th>
                          <th className="column-3">
                            <span style={{ float: "right" }}><FormattedMessage id="orderDetail.table.col.quantity" /></span>
                          </th>
                          <th className="column-4">
                            <span style={{ float: "right" }}>
                              <p className="price total">
                                <FormattedMessage id="orderDetail.table.col.totalPrice" />
                              </p>
                            </span>
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
