import React from "react";
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
    const it = item;
    return <span>{it.statusnm}</span>;
    /* style={{ padding: "5px 10px", backgroundColor: it.customerstatuscolor, color: "white", borderRadius: "15px" }} */
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
              style={{ color: "#feb415" }}
              to={"/order/"}
              className="d-none d-lg-block d-xl-block"
            >
              <span>Цааш үзэх</span>
            </Link>
            <Link style={{ color: "#feb415" }} to={"/order/"} className="d-lg-none d-xl-none" >
              <Avatar size="small" src={arrow} />
            </Link>
          </td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Үзсэн барааны түүх</span>
          </p>
          <div
            className="frame frameMargin"
            style={{
              width: "100%",
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            <table className="table-hover table-sm">
              <thead>
                <tr style={{ height: "70px" }}>
                  <th width="5%" style={{ textAlign: "center" }}>
                    Захиалга №
                  </th>
                  <th width="15%" style={{ textAlign: "center" }}>
                    Он сар өдөр
                  </th>
                  <th width="30%" style={{ textAlign: "center" }}>
                    Төлөв
                  </th>
                  <th width="10%" style={{ textAlign: "center" }}>
                    Үнийн дүн
                  </th>
                  <th width="10%" style={{ textAlign: "center" }}>
                    Дэлгэрэнгүй
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderDelivery()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
