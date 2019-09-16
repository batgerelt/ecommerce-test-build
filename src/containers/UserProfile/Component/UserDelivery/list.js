import React from "react";
import { FormattedMessage } from 'react-intl';
import { Divider, Rate, Avatar } from "antd";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";
import { EncryptKey } from "../../../../utils/Consts";
import arrow from "../../../../../src/scss/assets/images/demo/arrow.png";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  renderDate = (dateString) => {
    console.log(dateString);
    const dateParts = dateString.split("T")[0].split("-");
    return <span>{`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`}</span>;
  };
  renderType = (item) => {
    try {
      const { lang } = this.props;
      const prod = item;
      return (
        <p
          style={{
            backgroundColor: item.customerstatuscolor,
            paddingTop: "5px",
            paddingBottom: "5px",
            textAlign: "center",
            borderRadius: "5px",
            color: "white",
            width: "150px",
            margin: "0px !important",
            fontSize: "10px",
          }}
        >
          {lang === "mn" ? prod.statusnm : prod.statusnm_en}
        </p>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext.toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
  }

  renderDelivery = () => {
    try {
      const { delivery } = this.props;
      return delivery.map((item, index) => (
        <tr key={index} className="order-table-responsive">
          <td style={{ color: "blue", textAlign: "left", verticalAlign: "inherit !important" }}>
            <Link to={`/order/${this.encryptUrl(item.id)}`}>
              <span>#{item.ordernumber}</span>
            </Link>
          </td>
          <td style={{ textAlign: "left", verticalAlign: "inherit !important" }}>{this.renderDate(item.orderdate)}</td>
          <th />
          <td style={{ textAlign: "right", verticalAlign: "inherit !important" }}>{formatter.format(item.totalamount)}₮</td>
          <td style={{ width: "150px", verticalAlign: "inherit !important" }}>{this.renderType(item)}</td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  };

  renderTable() {
    return (
      <div className="cart-table table-responsive" >
        <table className="table" style={{ fontSize: "12px" }}>
          <thead className="thead-light" >
            <tr>
              <th
                style={{
                  fontWeight: "100", textAlign: "left", width: "100px", verticalAlign: "inherit !important",
                }}
              >
                <FormattedMessage id="profile.orderHistory.table.orderNo" />
              </th>
              <th style={{ fontWeight: "100", width: "100px", verticalAlign: "inherit !important" }}><FormattedMessage id="profile.orderHistory.table.date" /></th>
              <th />
              <th
                style={{
                  fontWeight: "100", textAlign: "right", width: "100px", verticAlalign: "inherit !important",
                }}
              >
                <FormattedMessage id="profile.orderHistory.table.price" />
              </th>
              <th style={{ fontWeight: "100", width: "150px", verticalAlign: "inherit !important" }}><FormattedMessage id="profile.orderHistory.table.status" /></th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>{this.renderDelivery()}</tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className="user-menu-content">
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span style={{ textTransform: "uppercase" }}><FormattedMessage id="profile.orderHistory.title" /></span>
        </p>
        <div
          className=""
          style={{
            width: "99%",
            maxHeight: "600px",
            overflow: "auto",
            textAlign: "center",
            margin: "auto",
          }}
        >
          {this.props.delivery !== null ? this.renderTable() : null}
        </div>
      </div>
    );
  }
}

export default Component;
