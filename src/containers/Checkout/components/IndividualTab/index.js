/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message, notification, Col } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { store } from 'react-notifications-component';
import { Notification } from "../../../../components";
import NumberInput from "../../../../components/Input/NumberInput";
import SwalModals from "../../../../containers/UserProfile/Component/UserProfile/EpointModal";

const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);
class IndividualTab extends React.Component {
  state = {
    loading: false,
    useEpoint: false,
    epointUsedPoint: 0,
    showPasswordWarning: false,
    cardno: null,
  };

  errorMsg = (code) => {
    // MySwal.hideLoading();
    MySwal.close();
    MySwal.fire({
      type: "error",
      text: this.props.intl.formatMessage({ id: code }),
      animation: true,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  cardNovalue = () => {
    this.setState({ cardno: 97611000 });
  }

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
    const { intl } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        let cardno = values.cardno;
        let pincode = values.pincode;
        this.props.connectEpointCard({ cardno, pincode }).then((res) => {
          if (res.payload.success) {
            this.props.changeCardInfo(res.payload.data);
            setFieldsValue({ cardPoint: res.payload.data.point });
            if (res.payload.data.imgnm !== null) {
              this.props.showModal(res.payload.data.imgnm);
            }
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification type="success" text={intl.formatMessage({ id: "shared.form.info.connectedSuccessfully" })} />,
            });
          } else {
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
            });
          }
          this.setState({ loading: false });
        });
      }
    });
  }

  handleUsePoint = async (e) => {
    e.preventDefault();
    const { intl, mainState } = this.props;
    const { value: password } = await Swal.fire({
      title: intl.formatMessage({ id: "shared.form.password.placeholder" }),
      html: `<div style="background-color: rgba(254, 180, 21, 0.2); padding: 10px 5px 0px 5px; display: flex;">
      <i
        class="fa fa-info"
        aria-hidden="true"
        style="color: #feb415; font-size: 1rem; width: 24px; padding-left: 5px;"
      ></i>
        <p style="font-size: 13px;">${intl.formatMessage({ id: "shared.form.cardPassword.warningmessage" })}</p>
      </div>`,
      input: "password",
      width: "20rem",
      confirmButtonText: "Ашиглах",
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
      let cardno = mainState.cardInfo.cardno;
      this.props.checkEpointPin({ cardno, pincode: password }).then((res) => {
        if (res.payload.success) {
          let chosenType = mainState.chosenDelivery;
          let totalPrice = mainState.totalPrice;
          let point = mainState.cardInfo.point;
          let usedPoint = 0;
          if (point > 0) {
            let deliveryPrice = chosenType.price;
            let tmp = mainState.cardInfo;
            if ((deliveryPrice + totalPrice) / 2 > tmp.point) {
              tmp.point = (parseFloat(tmp.point) - parseInt(point)).toFixed(2);
              usedPoint = parseInt(point);
              this.props.changeCardInfo(tmp);
              this.props.changeEpointUsedPoint(usedPoint);
            } else {
              tmp.point = (parseFloat(point) - parseFloat((deliveryPrice + totalPrice) / 2)).toFixed(2);
              usedPoint = parseInt((deliveryPrice + totalPrice) / 2);
              this.props.changeCardInfo(tmp);
              this.props.changeEpointUsedPoint(usedPoint);
            }
            this.setState({ useEpoint: true });
            this.props.setUseEpoint(true, usedPoint);
          }
        } else {
          this.errorMsg(res.payload.code);
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
      const { intl, mainState } = this.props;
      const { getFieldDecorator } = this.props.form;
      const { useEpoint } = this.state;
      return (
        <Form onSubmit={this.onSubmit} style={{ padding: "10px 0px" }}>
          {
            mainState.cardInfo === null ?
              <div>
                <div className="row row10 checkoutFormContainer">
                  <Col span={24}>
                    <div className="form-group">
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                        <span className="top-text">{intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })}</span>
                        <Form.Item>
                          {getFieldDecorator("cardno", {
                            initialValue: this.state.cardno,
                            rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.required" }) },
                            { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.cardno.validation.pattern" }) },
                            { len: 14, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.min" }) }],
                          })(
                            <NumberInput
                              placeholder={intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })}
                              maxLength={14}
                              allowClear
                              size="large"
                              className="col-md-12"
                              autoComplete="new-password"
                              onClick={this.cardNovalue}
                            />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                        <span className="top-text">{intl.formatMessage({ id: "shared.form.cardPassword.placeholder" })}</span>
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
                              autoComplete="new-password"
                            />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                        <div className="text d-flex delivery-info-message" style={{ padding: "8px 15px 8px 15px" }}>
                          <i
                            className="fa fa-info"
                            aria-hidden="true"
                            style={{
                              width: '24px',
                              fontSize: '1.2rem',
                              color: '#feb415',
                              textAlign: "left",
                              display: "block",
                            }}
                          />
                          <p className="text flex-this" style={{ fontSize: "13px" }}>{intl.formatMessage({ id: "shared.form.cardPassword.warningmessage" })}</p>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                        <button style={{ margin: '0px', width: '100%', fontSize: '0.8rem' }} type="submit" disabled={this.checkCardValue()} className="btn btn-dark"><FormattedMessage id="shared.form.button.connect" /></button>
                      </Col>
                    </div>
                  </Col>
                </div>
              </div> :
              <div>
                <Col span={24} style={{ display: 'flex', marginBottom: '10px' }}>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    {getFieldDecorator("cardPoint", {
                      initialValue: formatter.format(mainState.cardInfo.status === 1 ? mainState.cardInfo.point : 0),
                      rules: [{ required: false, message: intl.formatMessage({ id: "shared.form.epoint.validation.required" }) }],
                    })(
                      <Input size="large" autoComplete="false" disabled type="text" placeholder={intl.formatMessage({ id: "shared.form.epoint.placeholder" })} style={{ marginBottom: 0, paddingLeft: '10px' }} className="col-md-12" />,
                    )}
                    {
                      mainState.cardInfo.status === 0 ?
                        <label style={{
                          marginLeft: "1rem", fontSize: "0.7rem", marginTop: "0.2rem",
                        }}
                        >
                          {intl.formatMessage({ id: mainState.cardInfo.code })}
                        </label>
                        : ""
                    }
                  </Col>
                  <Col xs={7} sm={7} md={7} lg={7} xl={7} style={{ marginLeft: '12px' }}>
                    <button className="second-btn btn btn-dark" style={{ marginTop: '6px', marginBottom: '0px' }} disabled={!!(useEpoint || mainState.cardInfo.status === 0)} onClick={this.handleUsePoint}>
                      <FormattedMessage id="shared.form.button.use" />
                    </button>
                  </Col>
                </Col>
              </div>
          }
        </Form >
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
