/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NumberInput from "../../../../components/Input/NumberInput";
import SwalModals from "../../../../containers/UserProfile/Component/UserProfile/EpointModal";

const formatter = new Intl.NumberFormat("en-US");
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        return MySwal.fire({
          html: (
            <SwalModals
              type={"email"}
              onRef={ref => (this.SwalModals = ref)}
              param={values}
              connectEpoint={this.connectEpoint}
              intl={this.props.intl}
            />
          ),
          type: "warning",
          width: "30rem",
          animation: true,
          button: false,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          focusConfirm: false,
          allowOutsideClick: false,
          closeOnEsc: false,
        });
      }
      return null;
    });
  };

  connectEpoint = () => {
    const { setFieldsValue } = this.props.form;
    const { DeliveryInfo, intl } = this.props;
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
            message.warning(intl.formatMessage({ id: "shared.form.info.connectedSuccessfully" }));
          } else {
            message.warning(intl.formatMessage({ id: res.payload.code }));
          }
          this.setState({ loading: false });
        });
      }
    });
  }

  handleUsePoint = async (e) => {
    e.preventDefault();
    const { intl } = this.props;
    const { cardInfo } = this.state;
    const { value: password } = await Swal.fire({
      title: intl.formatMessage({ id: "shared.form.password.placeholder" }),
      input: "password",
      width: "20rem",
      confirmButtonText: "Ok",
      confirmButtonColor: "#feb415",
      cancelButtonText: intl.formatMessage({ id: "shared.form.button.cancel" }),
      inputPlaceholder: intl.formatMessage({ id: "shared.form.cardPassword.placeholder" }),
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

  checkCardValue = (e) => {
    let value = this.props.form.getFieldsValue(["cardno", "pincode"]);
    if (value.cardno === undefined || value.cardno === "" || value.pincode === undefined || value.pincode === "") {
      return true;
    }
    return false;
  }


  renderForm = () => {
    try {
      const { intl } = this.props;
      const { getFieldDecorator } = this.props.form;
      const { loading, cardInfo, useEpoint } = this.state;
      return (
        <Form onSubmit={this.onSubmit}>
          {
            cardInfo === null ?
              <div>
                <p className="title">
                  <strong><FormattedMessage id="shared.form.label.card.connect" /></strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item>
                        {getFieldDecorator("cardno", {
                          initialValue: "",
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.required" }) },
                          { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.cardno.validation.pattern" }) },
                          { len: 14, message: intl.formatMessage({ id: "shared.form.cardno.validation.min" }) }],
                        })(
                          <NumberInput
                            placeholder={intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })}
                            maxLength={14}
                            allowClear
                            size="large"
                            className="col-md-12"
                            autoComplete="off"
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator("pincode", {
                          initialValue: "",
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.cardPassword.validation.required" }) }],
                        })(
                          <NumberInput
                            placeholder={intl.formatMessage({ id: "shared.form.cardPassword.placeholder" })}
                            maxLength={4}
                            allowClear
                            type="password"
                            size="large"
                            className="col-md-12"
                            autoComplete="off"
                          />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Button htmlType="submit" loading={loading} disabled={this.checkCardValue()} className="btn btn-main"><FormattedMessage id="shared.form.button.connect" /></Button>
              </div> :
              <div>
                <p className="title">
                  {/* <strong>Ипойнт онооны үлдэгдэл</strong> */}
                  <strong><FormattedMessage id="shared.form.epoint.title" /></strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item style={{ marginBottom: 0 }}>
                        {getFieldDecorator("cardPoint", {
                          initialValue: formatter.format(cardInfo.point),
                          rules: [{ required: false, message: intl.formatMessage({ id: "shared.form.epoint.validation.required" }) }],
                        })(
                          <Input size="large" autoComplete="off" disabled type="text" placeholder={intl.formatMessage({ id: "shared.form.epoint.placeholder" })} style={{ marginBottom: 0 }} className="col-md-12" />,
                        )}
                      </Form.Item>
                      {/*  <label>
                        Таны карт идэвхгүй болсон байна. Хэрэглэгчийн үйлчилгээний
                        төвд хандаж картаа шинэчилүүлнэ үү.
                      </label> */}
                    </div>
                  </div>
                </div>
                <button className="btn btn-main" disabled={useEpoint} onClick={this.handleUsePoint}>
                  <FormattedMessage id="shared.form.button.use" />
                </button>
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

export default injectIntl(Form.create({ name: "individual" })(IndividualTab));
