import React from "react";
import { connect } from "react-redux";
import { Checkbox, Modal, Button } from "antd";

const formatter = new Intl.NumberFormat("en-US");

class DeliveryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAgreement: false,
      modal2Visible: false,
      agreementData: [],
    };
  }

  render() {
    const { checkedAgreement } = this.state;
    let addrs;
    return (
      <div className="col-lg-4 pad10">
        <div className="block right-panel">
          {" "}
          <p className="title">
            <strong />
          </p>
          <hr />
          <div className="content">
            <p className="title">
              <strong>Хүргэлтийн мэдээлэл</strong>
            </p>
            <p className="text flex-space">
              <span>Хүргэлтийн төрөл</span>
              <strong />
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-user"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span />
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-phone"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span />
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-map-marker"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span />
            </p>
          </div>
          <hr />
          <div className="content">
            <p className="title">
              <strong>Төлөх дүн</strong>
            </p>
            <p className="text flex-space">
              <span>Бараа ():</span>
              <strong>₮</strong>
            </p>
            <p className="text flex-space">
              <span>Хүргэлтийн үнэ:</span>
              <strong>₮</strong>
            </p>
            <p className="text flex-space">
              <span>Имарт карт оноо:</span>
              <strong style={{ color: "red" }}>{"-"}₮</strong>
            </p>
            <hr />
            <p className="text flex-space">
              <span>Нийт дүн:</span>
              <strong>₮</strong>
            </p>
            <p className="text flex-space">
              <span>НӨАТ:</span>
              <strong>₮</strong>
            </p>
            <Checkbox>
              {" "}
              <a>
                <span style={{ fontWeight: "bold" }}>Үйлчилгээний нөхцөл</span>
              </a>
            </Checkbox>
            <button className="btn btn-main btn-block">
              <span className="text-uppercase">Тооцоо хийх</span>
            </button>
          </div>
        </div>

        <Modal
          centered
          width="1000px"
          visible={this.state.modal2Visible}
          wrapClassName="vertical-center-modal"
          footer={false}
          onCancel={e => this.setModal2Visible(false)}
          /*  footer={
            [
                <button
            style={}
              key="submit"
              className="btn btn-main btn-block"
              onClick={() => this.setModal2Visible(false)}
            >
              Зөвшөөрөх
            </button>
            ]
          } */
        >
          <div className="frame" id="scroll-tst">
            <div className="scroll">
              {/* <div
                dangerouslySetInnerHTML={{
                  __html: this.state.agreementData.description
                }}
              /> */}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default DeliveryInfo;
