import React from "react";
import { FormattedMessage } from 'react-intl';
import { Divider, Rate, Avatar } from "antd";
import { Link } from "react-router-dom";
import arrow from "../../../../../src/scss/assets/images/demo/arrow.png";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  renderDate = (dateString) => {
    const dateParts = dateString.split("T")[0].split("-");
    return <span>{`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`}</span>;
  };
  renderType = (item) => {
    try {
      const prod = item;
      return (
        <span
          style={{
            backgroundColor: item.customerstatuscolor,
            padding: "5px 10px",
            color: "white",
            borderRadius: "15px",
          }}
        >
          {prod.statusnm}
        </span>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  renderDelivery = () => {
    try {
      const { delivery } = this.props;
      return delivery.map((item, index) => (
        <tr key={index} style={{ height: "70px" }}>
          <td style={{ textAlign: "center", paddingLeft: "10px" }}> #{item.ordernumber}</td>
          <td style={{ textAlign: "center" }}><span className="success">{this.renderDate(item.orderdate)}</span></td>
          <td style={{ textAlign: "center" }}>{this.renderType(item)}</td>
          <td style={{ textAlign: "center" }}>{formatter.format(item.totalamount)}₮</td>
          <td style={{ textAlign: "center", paddingRight: "5px" }}>
            <Link
              to={`/order/${item.id}`}
              style={{ color: "#feb415" }}
              className="d-none d-lg-block d-xl-block"
            >
              <span><FormattedMessage id="profile.orderHistory.table.showMore" /></span>
            </Link>
            <Link to={`/order/${item.id}`} style={{ color: "#feb415" }} className="d-lg-none d-xl-none" >
              <Avatar size="small" src={arrow} />
            </Link>
          </td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  };

  renderTable() {
    return (
      <table className="table-hover table-sm">
        <thead>
          <tr style={{ height: "70px" }}>
            <th width="5%" style={{ textAlign: "center" }}><FormattedMessage id="profile.orderHistory.table.orderNo" /></th>
            <th width="15%" style={{ textAlign: "center" }}><FormattedMessage id="profile.orderHistory.table.date" /></th>
            <th width="30%" style={{ textAlign: "center" }}><FormattedMessage id="profile.orderHistory.table.status" /></th>
            <th width="10%" style={{ textAlign: "center" }}><FormattedMessage id="profile.orderHistory.table.price" /></th>
            <th width="10%" style={{ textAlign: "center" }}><FormattedMessage id="profile.orderHistory.table.link" /></th>
          </tr>
        </thead>
        <tbody>{this.renderDelivery()}</tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span><FormattedMessage id="profile.orderHistory.title" /></span>
          </p>
          <div
            className="frame frameMargin"
            style={{
              width: "100%",
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            {this.props.delivery.length !== 0 ? this.renderTable() : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
