/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import CryptoJS from "crypto-js";
import { EncryptKey } from "../../../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");
class GolomtMerchant extends React.Component {
  encryptUrl = (id) => {
    let ciphertext = CryptoJS.AES.encrypt(id.toString(), EncryptKey);
    return ciphertext.toString().replace(/\+/g, 'xMl3Jk').replace(/\//ig, 'Por21Ld').replace(/=/g, 'Ml32');
  }

  render() {
    const { golomtMerchant, state } = this.props;
    if (golomtMerchant.success || state.qpayReturn) {
      return (
        <div className="section">
          <div className="container pad10 py-5">
            <div className="success-message-container">
              <div className="container pad10">
                <div className="row row10">
                  <div className="offset-md-3 col-md-6 pad10">
                    <div className="content">
                      <div className="text-center">
                        <img alt="image" src={require("../../../../scss/assets/images/demo/4.png")} width="80px" />
                        <h4 className="title">
                          <span className="text-uppercase">
                            Таны захиалга амжилттай баталгаажлаа
                          </span>
                        </h4>
                      </div>
                      <div className="message">
                        <h5 className="title flex-this flex-space">
                          <span className="text-uppercase">
                            Захиалга <strong>{state.qpayReturn ? state.return.info.ordernumber : golomtMerchant.data.order.ordernumber}</strong>
                          </span>
                        </h5>
                        <ul className="list-unstyled class">
                          <li className="flex-this flex-space">
                            <span>Худалдаж авсан барааны тоо:</span>
                            <strong className="big">
                              {state.qpayReturn ? state.return.info.totalquantity : golomtMerchant.data.order.orderquantity}
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>Мөнгөн дүн:</span>
                            <strong className="big">
                              {formatter.format(state.qpayReturn ? state.return.info.totalamount : golomtMerchant.data.order.totalamount)}₮
                            </strong>
                          </li>
                          <li className="flex-this flex-space">
                            <span>Төлбөрийн төрөл:</span>
                            <strong className="big">
                              {state.qpayReturn ? "Qpay" : "Төлбөрийн карт"}
                            </strong>
                          </li>
                        </ul>
                      </div>
                      <div className="user-detail">
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
                          <span> {state.qpayReturn ? state.return.info.custname : golomtMerchant.data.delivery.custname}</span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-phone "
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>
                            {state.qpayReturn ? `${state.return.info.phone1}` : `${golomtMerchant.data.delivery.phonE1}`}
                          </span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-map-marker "
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>{state.qpayReturn ? state.return.info.address : golomtMerchant.data.delivery !== 3 ? golomtMerchant.data.delivery.address : "Улаанбаатар хот, Хан-Уул дүүрэг , 1-р хороо, Хан-Уул салбар"}</span>
                        </p>
                        <p className="text flex-this">
                          <i
                            className="fa fa-calendar"
                            aria-hidden="true"
                            style={{ color: "#feb415" }}
                          />
                          <span>{state.qpayReturn ? state.return.info.orddate : golomtMerchant.data.delivery.insymd.slice(0, 10)}</span>
                        </p>
                      </div>
                      <div className="bottom-text text-center">
                        <p>
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
                          onClick={() => this.props.history.push("/")}
                        >
                          <span className="text-uppercase">
                            Нүүр хуудасруу буцах
                          </span>
                        </a>
                      </div>
                      <div className="btn-container text-center">
                        <a
                          className="btn btn-dark"
                          onClick={() =>
                            this.props.history.push(`/order/${this.encryptUrl(state.qpayReturn ? state.return.info.id : golomtMerchant.data.order.id)}`)
                          }
                        >
                          <span className="text-uppercase">Захиалга харах</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return "";
    /* return (
      <div className="section section-gray">
        <div className="container pad10">
          <div className="success-message-container" style={{ padding: "100px 0" }}>
            <div className="container pad10">
              <div className="row row10">
                <div className="offset-md-3 col-md-6 pad10">
                  <div className="content">
                    <div className="text-center">
                      <img
                        alt="image"
                        src={require("../../../../scss/assets/images/demo/lock.png")}
                        width="80px"
                      />
                      <h4 className="title">
                        <span className="text-uppercase">
                          Таны захиалга амжилтгүй
                        </span>
                      </h4>
                    </div>
                    <div className="bottom-text text-center">
                      <p>{golomtMerchant.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ); */
  }
}

export default GolomtMerchant;
