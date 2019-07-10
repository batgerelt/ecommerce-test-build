/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-danger */
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Checkbox, Modal, Button } from "antd";
import { Static as StaticModel } from "../../../../models";

const formatter = new Intl.NumberFormat("en-US");

const mapStateToProps = state => ({
  ...state.staticcontent,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...StaticModel,
    },
    dispatch,
  ),
});

class DeliveryInfo extends React.Component {
  state = {
    checkedAgreement: false,
    modal2Visible: false,
    agreementData: [],
    chosenInfo: {},
    chosenType: {},
  };

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  setModal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  }

  handleGetValue = (value) => {
    this.setState({ chosenInfo: value });
  }

  setDeliveryType = (value) => {
    this.setState({ chosenType: value });
  }

  handleScroll = () => {
    let calcBottom =
      document.getElementById("scroll-tst").scrollHeight -
      document.getElementById("scroll-tst").scrollTop;
    let clientHeight = document.getElementById("scroll-tst").clientHeight;
    if (calcBottom === clientHeight) {
      this.timer = setTimeout(() => this.setModal2Visible(false), 200);
      document
        .getElementById("scroll-tst")
        .removeEventListener("scroll", this.handleScroll);
    }
  };

  handleAgreement = (e) => {
    this.setState({ checkedAgreement: e.target.checked });
    if (e.target.checked) {
      this.getAgreementData();
    }
  };

  getAgreementData = () => {
    this.props.getStaticPage({ id: 42 }).then((res) => {
      if (res.payload.success) {
        this.setModal2Visible(true);
        document.getElementById("scroll-tst").scrollTop = 0;
        document.getElementById("scroll-tst").addEventListener("scroll", this.handleScroll);
      }
    });
  }

  handleChange = () => {
    this.props.DeliveryPanel.handleGetValue();
  }

  render() {
    const { checkedAgreement, chosenInfo, chosenType } = this.state;
    const { staticpage } = this.props;
    // console.log(this.props.userinfo.info, "infoprops");
    return (
      <div className="col-lg-4 pad10">
        <div className="block right-panel">
          {" "}
          <p className="title">
            <strong>
              {
                this.props.userinfo !== undefined && this.props.userinfo !== null ?
                  `${this.props.userinfo.info.lastname} ${this.props.userinfo.info.firstname}`
                  : ""
              }
            </strong>
          </p>
          <hr />
          <div className="content">
            <p className="title">
              <strong>Хүргэлтийн мэдээлэл</strong>
            </p>
            <p className="text flex-space">
              <span>Хүргэлтийн төрөл</span>
              <strong>
                {`${this.checkError(chosenType.typenm)}`}
              </strong>
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-user"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span>
                {this.checkError(chosenInfo.name)}
              </span>
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-phone"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span>
                {`${this.checkError(chosenInfo.phonE1)} ${this.checkError(chosenInfo.phonE2)}`}
              </span>
            </p>
            <p className="text flex-this">
              <i
                className="fa fa-map-marker"
                aria-hidden="true"
                style={{ color: "#feb415" }}
              />
              <span>
                {`${this.checkError(chosenInfo.provincenm)} ${this.checkError(chosenInfo.districtnm)} ${this.checkError(chosenInfo.committeenm)} ${this.checkError(chosenInfo.address)}`}
              </span>
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
              <strong>{`${formatter.format(this.checkError(chosenType.price))}₮`}</strong>
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
            <Checkbox onChange={this.handleAgreement}>
              {" "}
              <a>
                <span style={{ fontWeight: "bold" }}>Үйлчилгээний нөхцөл</span>
              </a>
            </Checkbox>
            <button className="btn btn-main btn-block" onClick={this.handleChange}>
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
              <div
                dangerouslySetInnerHTML={{
                  __html: staticpage.description,
                }}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryInfo);
