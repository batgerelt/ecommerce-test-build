/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-danger */
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Checkbox, Modal, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Static as StaticModel } from "../../../../models";
import { SwalModals } from "../";

const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);
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
    totalPrice: 0,
    totalQty: 0,
    ePointData: [],
    organizationData: [],
    chosenDate: null,
    useEpoint: false,
    epointUsedPoint: 0,
  };

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }
  componentWillMount() {
    const { products } = this.props.props;
    const { userinfo } = this.props;
    this.setState({ totalPrice: this.getTotalPrice(products), totalQty: this.getTotalQty(products) });
  }
  setModal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  }

  handleGetValue = (value, zone) => {
    this.setState({ chosenInfo: value, chosenDate: zone });
  }

  setDeliveryType = (value) => {
    this.setState({ chosenType: value });
  }

  setIndividualData = (value) => {
    this.setState({ ePointData: value });
  }

  setUseEpoint = (value, cardInfo, usedPoint) => {
    this.setState({ useEpoint: value, ePointData: cardInfo, epointUsedPoint: usedPoint });
  }

  setOrganizationData = (value) => {
    this.setState({ organizationData: value });
  }

  getPrice = (product) => {
    let price = product.price;
    if (product.issalekg && product.kgproduct !== undefined) {
      price = product.kgproduct[0].salegramprice;
    }

    if (product.spercent && product.spercent !== 100 && !product.issalekg) {
      price = product.sprice;
    }

    return price;
  };

  getTotalQty = (products) => {
    let qty = 0;
    if (products.length !== 0) {
      products.map((item, i) => {
        qty += item.qty;
      });
    }
    return qty;
  }

  getTotalPrice = products => products.reduce(
    (acc, cur) => (acc + (this.getPrice(cur) * (cur.qty ? cur.qty : (cur.saleminqty || 1)))),
    0,
  );

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

  generateNoat = (total, deliver) => {
    const { useEpoint, epointUsedPoint } = this.state;
    let value = 0;
    if (deliver !== undefined) {
      // eslint-disable-next-line no-mixed-operators
      value = ((total + deliver - (useEpoint ? epointUsedPoint : 0)) / 110) * 10;
    } else {
      value = ((total - (useEpoint ? epointUsedPoint : 0)) / 110) * 10;
    }
    return value.toFixed(2);
  };

  handleSubmit = (e) => {
    const {
      userinfo, DeliveryInfo, PaymentTypePanel, products,
    } = this.props;
    const {
      organizationData, ePointData, chosenInfo, chosenDate, epointUsedPoint,
    } = this.state;
    if (userinfo !== undefined && userinfo !== null && userinfo.length !== 0) {
      this.props.changeLoading(true);
      // MySwal.showLoading();
      let tmp = {};
      tmp.custId = userinfo.info.id;
      tmp.deliveryTypeId = DeliveryInfo.state.chosenType.id;
      tmp.custName = chosenInfo.name;
      tmp.custAddressId = chosenInfo.id;
      tmp.phone1 = chosenInfo.phonE1;
      tmp.phone2 = chosenInfo.phonE2;
      tmp.paymentType = PaymentTypePanel.state.chosenPaymentType.id;
      tmp.addPoint = 0;
      tmp.deliveryDate = chosenDate;
      tmp.usedPoint = epointUsedPoint;
      tmp.items = products;
      tmp.locId = chosenInfo.locid;
      tmp.custAddress =
        `${chosenInfo.provincenm},
        ${chosenInfo.districtnm}, 
        ${chosenInfo.committeenm}, 
        ${chosenInfo.address}`;
      if (organizationData.length === 0) {
        tmp.taxRegno = "";
        tmp.taxName = "";
      } else {
        tmp.taxRegno = organizationData.regno;
        tmp.taxName = organizationData.name;
      }
      this.sendPayment(tmp);
    }
  }

  sendPayment = (tmp) => {
    const { PaymentTypePanel } = this.props;
    let data; let type;
    this.props.sendCheckoutOrder({ body: tmp }).then((res) => {
      this.props.changeLoading(false);
      // MySwal.close();
      if (res.payload.success) {
        if (PaymentTypePanel.state.chosenPaymentType.id === 2) {
          this.props.clearRemotely();
          type = "msgBank";
          data = this.props.bankInfo;
          this.openLastModal(type, data, res.payload.data);
        }

        if (PaymentTypePanel.state.chosenPaymentType.id === 3) {
          this.props.clearRemotely();
          type = "qpay";
          this.openLastModal(type, [], res.payload.data);
        }

        if (PaymentTypePanel.state.chosenPaymentType.id === 1) {
          let mapForm = document.createElement("form");
          mapForm.target = "_self";
          mapForm.method = "POST";
          mapForm.action = res.payload.data.url.url;

          let keyNumber = document.createElement("input");
          keyNumber.type = "hidden";
          keyNumber.name = "key_number";
          keyNumber.value = res.payload.data.url.key_number;

          let transNumber = document.createElement("input");
          transNumber.type = "hidden";
          transNumber.name = "trans_number";
          transNumber.value = res.payload.data.url.trans_number;

          let trans_amount = document.createElement("input");
          trans_amount.type = "hidden";
          trans_amount.name = "trans_amount";
          trans_amount.value = res.payload.data.url.trans_amount;

          let time = document.createElement("input");
          time.type = "hidden";
          time.name = "time";
          time.value = res.payload.data.url.time;

          let lang_ind = document.createElement("input");
          lang_ind.type = "hidden";
          lang_ind.name = "lang_ind";
          lang_ind.value = res.payload.data.url.lang_ind;

          mapForm.appendChild(keyNumber);
          mapForm.appendChild(transNumber);
          mapForm.appendChild(trans_amount);
          mapForm.appendChild(time);
          mapForm.appendChild(lang_ind);

          document.body.appendChild(mapForm);

          let map = window.open(res.payload.data.url.url, "_self", "");

          if (map) {
            mapForm.submit();
          } else {
            console.log('error');
          }
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products.length !== this.props.products.length) {
      this.setState({ totalPrice: this.getTotalPrice(this.props.products), totalQty: this.getTotalQty(this.props.products) });
    }
  }

  openLastModal = (type, data, ordData) => {
    MySwal.fire({
      html: (
        <SwalModals
          type={type}
          dataValue={data}
          ordData={ordData}
          readyBtn={this.handlePayment}
          onRef={ref => (this.SwalModals = ref)}
          {...this}
          {...this.props}
        />
      ),
      width: type === "qpay" ? "30em" : "40em",
      animation: true,
      button: false,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      allowOutsideClick: false,
      closeOnEsc: false,
    });
  };

  handlePayment = (e, item, ordData, type) => {
    e.preventDefault();
    MySwal.fire({
      html: (
        <SwalModals
          type={"paymentSuccess"}
          paymentType={type}
          chosenBankInfo={item}
          chosenInfo={this.state.chosenInfo}
          ordData={ordData}
          onRef={ref => (this.SwalModals = ref)}
          {...this}
          {...this.props}
        />
      ),
      width: "40em",
      button: false,
      animation: true,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      allowOutsideClick: false,
      closeOnEsc: false,
    });
  };

  render() {
    const {
      checkedAgreement, chosenInfo, chosenType, totalPrice, totalQty, epointUsedPoint, useEpoint,
    } = this.state;
    const { staticpage, state } = this.props;
    return (
      <div className="col-lg-4 pad10">
        <div className="block right-panel">
          {" "}
          <p className="title">
            <strong>
              {
                this.props.userinfo !== undefined && this.props.userinfo !== null && this.props.userinfo.length !== 0 ?
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
              <span>Бараа ({totalQty}):</span>
              <strong>{formatter.format(totalPrice)}₮</strong>
            </p>
            <p className="text flex-space">
              <span>Хүргэлтийн үнэ:</span>
              <strong>{`${formatter.format(this.checkError(chosenType.price))}₮`}</strong>
            </p>
            {
              useEpoint ?
                <p className="text flex-space">
                  <span>Имарт карт оноо:</span>
                  <strong style={{ color: "red" }}>{`-${formatter.format(epointUsedPoint)}`}₮</strong>
                </p> : ""
            }
            <hr />
            <p className="text flex-space">
              <span>Нийт дүн:</span>
              <strong>{formatter.format(totalPrice + (chosenType.price !== undefined ? chosenType.price : 0) - (useEpoint ? epointUsedPoint : 0))}₮</strong>
            </p>
            <p className="text flex-space">
              <span>НӨАТ:</span>
              <strong>{formatter.format(this.generateNoat(totalPrice, chosenType.price))}₮</strong>
            </p>
            <Checkbox onChange={this.handleAgreement}>
              {" "}
              <a>
                <span style={{ fontWeight: "bold" }}>Үйлчилгээний нөхцөл зөвшөөрөх</span>
              </a>
            </Checkbox>
            <button className="btn btn-main btn-block" onClick={this.handleSubmit} disabled={!(checkedAgreement && state.paymentType && state.deliveryType)}>
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
