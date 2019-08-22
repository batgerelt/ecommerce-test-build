/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
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
              <strong>
                {formatter.format(item.newprice > 0 ? item.newprice : item.price)}₮
              </strong>
            </p>
          </td>
          <td>
            <p className="price total" style={{ float: "right" }}>
              <strong>{item.orderquantity}</strong>
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
      console.log(orderdetail);
      if (orderdetail.info !== null) {
        return (
          <div className="cart-info">
            <h5 className="title">
              <span>Захиалгын төлбөр</span>
            </h5>
            <div className="block">
              <ul className="list-unstyled">
                <li className="flex-this flex-space">
                  <span>Барааны үнэ:</span>
                  <strong className="big">{formatter.format(orderdetail.info.itemamount)}₮</strong>
                </li>
                <li className="flex-this flex-space">
                  <span><FormattedMessage id="shared.sidebar.label.deliveryCost" />:</span>
                  <strong className="big">{formatter.format(orderdetail.info.deliveryamount)}₮</strong>
                </li>
                <div className="line">
                  <li className="flex-this flex-space">
                    <span>Ипойнт оноогоор төлсөн:</span>
                    <strong className="big">{formatter.format(orderdetail.info.outpoint)}₮</strong>
                  </li>
                  <li className="flex-this flex-space">
                    <span>Бэлнээр төлсөн:</span>
                    <strong className="big">{formatter.format(orderdetail.info.totalamount - orderdetail.info.outpoint)}₮</strong>
                  </li>
                </div>
                <li className="text-right">
                  <strong>Захиалгын нийт дүн:</strong>
                  <strong className="big">{formatter.format(orderdetail.info.totalamount)}₮</strong>
                </li>
                {/* <li className="flex-this flex-space">
                  <span><FormattedMessage id="shared.sidebar.label.tax" />:</span>
                  <strong>{formatter.format(orderdetail.info.totalvatamount)}₮</strong>
                </li> */}
              </ul>
            </div>
            <h5 className="title flex-this flex-space">
              <span><FormattedMessage id="shared.sidebar.title.deliveryStatus" />:</span>
              <strong style={{ backgroundColor: orderdetail.info.customerstatuscolor }}>
                {lang === "mn" ? orderdetail.info.customerstatusname : orderdetail.info.customerstatusname_en}
              </strong>
            </h5>
            <div className="block">
              <div className="content">
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
                  <span>{orderdetail.info.phone1}, {orderdetail.info.phone2}</span>
                </p>
                <p className="text flex-this">
                  <i
                    className="fa fa-map-marker"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>{orderdetail.info.address}</span>
                </p>
                <p className="text flex-this">
                  <i
                    className="fa fa-calendar"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
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
                      <h5 className="title">
                        <span><FormattedMessage id="orderDetail.table.title" /></span>
                      </h5>
                    </div>
                    <div className="col">
                      <Link
                        to="/profile/delivery"
                        className="btn btn-link pull-right"
                        style={{ marginTop: "15px" }}
                      >
                        <Avatar size="small" shape="square" src={store} />
                        <span className="text-uppercase"> <FormattedMessage id="orderDetail.button.showOrderList" /></span>
                      </Link>
                    </div>
                  </div>
                  <div className="cart-table table-responsive">
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
                                <strong><FormattedMessage id="orderDetail.table.col.totalPrice" /></strong>
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
