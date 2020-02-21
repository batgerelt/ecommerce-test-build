import React from "react";
import withReactContent from "sweetalert2-react-content";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Button } from "antd";
import { store } from 'react-notifications-component';
import Swal from "sweetalert2";
import SwalModals from "./EpointModal";
import { intl } from '../../../../components/IntlGlobalProvider';
import NumberInput from "../../../../components/Input/NumberInput";
import { Notification } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);

class Component extends React.Component {
  state = {
    dis: "",
    loc: null,
    loader: false,
    cardno: null,
    visible: false,
    imgnm: null,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() { }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        return MySwal.fire({
          html: (
            <SwalModals
              type={"email"}
              onRef={ref => (this.SwalModals = ref)}
              param={values}
              connectEpoint={this.connectEpoint}
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
  }

  connectEpoint = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loader: true });
        this.props.emartCard({ cardno: values.cardno, pincode: values.password }).then((res) => {
          if (res.payload.success) {
            this.props.getEpoint();
            if (res.payload.data.imgnm !== null) {
              this.props.showModal(res.payload.data.imgnm);
            }
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
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
                duration: 3000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
            });
          }
          this.setState({ loader: false });
        });
      }
    });
  }

  cardNovalue = () => {
    this.setState({ cardno: 97611000 });
  }

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Form>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("cardno", {
                initialValue: this.state.cardno,
                rules: [
                  // { required: true, message: "Картын дугаараа оруулна уу" },
                  { required: true, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.required" }) },
                  { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.cardNumber.validation.pattern" }) },
                  { len: 14, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.min" }) },
                ],
              })(<NumberInput onClick={this.cardNovalue} className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })} autoComplete="new-password" maxLength={14} allowclear />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.cardPassword.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: intl.formatMessage({ id: "shared.form.password.validation.required" }) },
                ],
              })(<NumberInput
                className="profile-custom-input"
                placeholder={intl.formatMessage({ id: "shared.form.cardPassword.placeholder" })}
                maxLength={4}
                allowclear
                type="password"
                autoComplete="new-password"
              />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10" style={{ textAlign: "right" }}>
            <Col xs={12} sm={12} md={18} lg={18} xl={18} />
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Form.Item className="text">

                <Button className="btn btn-dark hover-effect" htmlType="submit" loading={this.state.loader} onClick={this.handleSubmit} style={{ background: '#343a40', height: "40px", width: "100%" }}>
                  <span className="text-uppercase"><FormattedMessage id="shared.form.button.connect" /></span>
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Form>
      </Col>
    );
  }
}

export default injectIntl(Form.create({ name: "UserProfile" })(Component));
