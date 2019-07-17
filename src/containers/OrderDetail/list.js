/* eslint-disable react/no-danger */
import React from "react";
import { Link } from "react-router-dom";
import { Slider } from "../../components";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  renderTable = () => {
    try {
      const { orderdetail } = this.props;
      return orderdetail.items.map((item, index) => (
        <tr key={index}>
          <td>
            <div className="flex-this">
              <div className="image-container default">
                <a href={item.route}>
                  <span
                    className="image"
                    style={{ backgroundImage: `url(${process.env.IMAGE}${item.img})` }}
                  />
                </a>
              </div>
              <div className="info-container">
                <strong>{item.name}</strong>
                <span>{item.backtxt}</span>
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
      if (orderdetail.info !== null) {
        return (
          <div className="cart-info">
            <h5 className="title">
              <span>Захиалгын дүн</span>
            </h5>
            <div className="block">
              <ul className="list-unstyled">
                <li className="flex-this flex-space">
                  <span>Нийт барааны үнэ</span>
                  <strong className="big">{formatter.format(orderdetail.info.itemamount)}₮</strong>
                </li>
                <li className="flex-this flex-space">
                  <span>Энгийн хүргэлт</span>
                  <strong className="big">{formatter.format(orderdetail.info.deliveryamount)}₮</strong>
                </li>
                <li className="line text-right">
                  <strong>Захиалгын дүн</strong>
                  <strong className="big">{formatter.format(orderdetail.info.totalamount)}₮</strong>
                </li>
                <li className="flex-this flex-space">
                  <span>НӨАТ</span>
                  <strong>{formatter.format(orderdetail.info.totalvatamount)}₮</strong>
                </li>
              </ul>
            </div>
            <h5 className="title flex-this flex-space">
              <span>Захиалгын төлөв</span>
              <strong style={{ backgroundColor: orderdetail.info.customerstatuscolor }}>
                {orderdetail.info.customerstatusname}
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
                  <span>{this.props.data[0].info.customerInfo.firstname} {this.props.data[0].info.customerInfo.lastname}</span>
                </p>
                <p className="text flex-this">
                  <i
                    className="fa fa-phone"
                    aria-hidden="true"
                    style={{ color: "#feb415" }}
                  />
                  <span>{this.props.data[0].info.customerInfo.phonE1}, {this.props.data[0].info.customerInfo.phoneE2}</span>
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
                  <span>{orderdetail.info.orddate.slice(0, 10)}</span>
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
          <span className="text-uppercase">Захиалга #{orderdetail.info === undefined ? null : orderdetail.info.ordernumber}</span>
        );
      }
      return (
        <span className="text-uppercase">Захиалга хоосон байна.</span>
      );
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    console.log(this.props);
    const { orderdetail } = this.props;
    return (
      <div className="section">
        <div className="top-container">
          <div className="container pad10">
            <div className="cart-container after-order">
              <h1 className="title">
                {this.renderOrdNum()}
              </h1>
              <div className="row row10">
                <div className="col-xl-8 pad10">
                  <h5 className="title">
                    <span>Захиалсан бараанууд</span>
                  </h5>
                  <div className="cart-table table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-light">
                        <tr>
                          <th className="column-1">Бүтээгдэхүүний нэр</th>
                          <th className="column-2">
                            <span style={{ float: "right" }}>Нэгжийн үнэ</span>
                          </th>
                          <th className="column-3">
                            <span style={{ float: "right" }}>Тоо ширхэг</span>
                          </th>
                          <th className="column-4">
                            <span style={{ float: "right" }}>
                              <p className="price total">
                                <strong>Нийт үнэ</strong>
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
          </div>
        </div>
      </div>
    );
  }
}

export default List;
