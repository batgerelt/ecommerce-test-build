/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
class IndividualTab extends React.Component {
  state = {
    loading: false,
    cardInfo: null,
    useEpoint: false,
    epointUsedPoint: 0,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() {
    this.props.onRef(this);
    const { userinfo } = this.props;
    const { setFieldsValue } = this.props.form;
    if (userinfo.card !== undefined) {
      // setFieldsValue({ cardPoint: userinfo.card.point });
      this.setState({ cardInfo: userinfo.card });
    }
  }

  errorMsg = (txt) => {
    MySwal.hideLoading();
    MySwal.fire({
      type: "error",
      text: txt,
      animation: true,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { setFieldsValue } = this.props.form;
    const { DeliveryInfo } = this.props;
    const { info } = this.props.userinfo;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        let cardno = values.cardno;
        let pincode = values.pincode;
        this.props.connectEpointCard({ cardno, pincode }).then((res) => {
          if (res.payload.success) {
            this.setState({ cardInfo: res.payload.data });
            DeliveryInfo.setIndividualData(res.payload.data);
            setFieldsValue({ cardPoint: res.payload.data.point });
          }
          this.setState({ loading: false });
        });
      }
    });
  };

  handleUsePoint = async (e) => {
    const { cardInfo } = this.state;
    const { value: password } = await Swal.fire({
      title: "Нууц үг",
      input: "password",
      width: "20rem",
      confirmButtonText: "Ok",
      confirmButtonColor: "#feb415",
      cancelButtonText: "Болих",
      inputPlaceholder: "Картын нууц үгээ оруулна уу ?",
      showCancelButton: true,
      inputAttributes: {
        maxlength: 4,
        autocapitalize: "off",
        autocorrect: "off",
      },
    });
    if (password) {
      let cardno = cardInfo.cardno;
      this.props.checkEpointPin({ cardno, pincode: password }).then((res) => {
        if (res.payload.success) {
          const { DeliveryInfo } = this.props;
          let chosenType = DeliveryInfo.state.chosenType;
          let totalPrice = DeliveryInfo.state.totalPrice;
          let point = cardInfo.point;
          let usedPoint = 0;
          if (point > 0) {
            let deliveryPrice = chosenType.price;
            let tmp = cardInfo;
            if ((deliveryPrice + totalPrice) / 2 > tmp.point) {
              tmp.point = (parseFloat(tmp.point) - parseInt(point)).toFixed(2);
              usedPoint = parseInt(point);
              this.setState({ epointUsedPoint: usedPoint, cardInfo: tmp });
            } else {
              tmp.point = (parseFloat(point) - parseFloat((deliveryPrice + totalPrice) / 2)).toFixed(2);
              usedPoint = parseInt((deliveryPrice + totalPrice) / 2);
              this.setState({ epointUsedPoint: usedPoint, cardInfo: tmp });
            }
            this.setState({ useEpoint: true });
            DeliveryInfo.setUseEpoint(true, cardInfo, usedPoint);
          }
        } else {
          this.errorMsg(res.payload.message);
        }
      });
    }
  }


  renderForm = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { loading, cardInfo, useEpoint } = this.state;
      return (
        <Form onSubmit={this.onSubmit}>
          {
            cardInfo === null ?
              <div>
                <p className="title">
                  <strong>Имарт картаа холбох</strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item>
                        {getFieldDecorator("cardno", {
                          rules: [{ required: true, message: "Картын дугаар оруулна уу ?" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Картын дугаар зөв оруулна уу ?" },
                          { len: 14, message: "14 оронтой байх ёстой !." }],
                        })(
                          <Input autoComplete="off" allowClear size="large" type="text" placeholder="Картын дугаар*" className="col-md-12" />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator("pincode", {
                          rules: [{ required: true, message: "Нууц үг оруулна уу ?" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Нууц үг зөв оруулна уу ?" },
                          { len: 4, message: "4 оронтой байх ёстой !." }],
                        })(
                          <Input autoComplete="off" allowClear size="large" type="password" placeholder="Нууц үг*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Button htmlType="submit" loading={loading} className="btn btn-main solid">Холбох</Button>
              </div> :
              <div>
                <p className="title">
                  <strong>Оноо</strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item style={{ marginBottom: 0 }}>
                        {getFieldDecorator("cardPoint", {
                          initialValue: cardInfo.point,
                          rules: [{ required: false, message: "Картын оноо оруулна уу ?" }],
                        })(
                          <Input size="large" autoComplete="off" disabled type="text" placeholder="Картын оноо*" style={{ marginBottom: 0 }} className="col-md-12" />,
                        )}
                      </Form.Item>
                      {/*  <label>
                        Таны карт идэвхгүй болсон байна. Хэрэглэгчийн үйлчилгээний
                        төвд хандаж картаа шинэчилүүлнэ үү.
                      </label> */}
                    </div>
                  </div>
                </div>
                <Button className="btn btn-main solid" disabled={useEpoint} onClick={this.handleUsePoint}>
                  <span className="text-uppercase">Ашиглах</span>
                </Button>
              </div>
          }
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderForm();
  }
}

export default Form.create({ name: "individual" })(IndividualTab);
