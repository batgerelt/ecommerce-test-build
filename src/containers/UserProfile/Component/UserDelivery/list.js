import React from "react";
import { FormattedMessage } from 'react-intl';
import { Divider, Rate, Avatar } from "antd";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { EncryptKey } from "../../../../utils/Consts";
import arrow from "../../../../../src/scss/assets/images/demo/arrow.png";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  renderDate = (dateString) => {
    const dateParts = dateString.split("T")[0].split("-");
    return <span className="date">{`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`}</span>;
  };
  renderType = (item) => {
    try {
      const { lang } = this.props;
      const prod = item;
      return (
        <p className="status" style={{ backgroundColor: item.customerstatuscolor }}>
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
          <td>
            <Link to={`/order/${this.encryptUrl(item.id)}`}>
              <span>#{item.ordernumber}</span>
            </Link>
            {
              isMobile
                ? (
                  <React.Fragment>
                    <br />
                    {this.renderDate(item.orderdate)}
                  </React.Fragment>
                )
                : ""
            }
          </td>
          {
            !isMobile
              ? (
                <td>
                  {this.renderDate(item.orderdate)}
                </td>
              )
              : ""
          }
          <td>{formatter.format(item.totalamount)}₮</td>
          <td>{this.renderType(item)}</td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  };

  renderTable() {
    return (
      <div>
        <table className="table order-history">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="profile.orderHistory.table.orderNo" />
                {
                  isMobile
                    ? (
                      <React.Fragment>
                        <br />
                        <FormattedMessage id="profile.orderHistory.table.date" />
                      </React.Fragment>
                    )
                    : ""
                }
              </th>
              {
                !isMobile
                  ? (
                    <th>
                      <FormattedMessage id="profile.orderHistory.table.date" />
                    </th>
                  )
                  : ""
              }
              <th>
                <FormattedMessage id="profile.orderHistory.table.price" />
              </th>
              <th>
                <FormattedMessage id="profile.orderHistory.table.status" />
              </th>
            </tr>
          </thead>
          <tbody>{this.renderDelivery()}</tbody>
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
