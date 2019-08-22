import React from "react";
import withReactContent from "sweetalert2-react-content";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, message, Input, Spin, Col, Button } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SwalModals from "./EpointModal";
import { intl } from '../../../../components/IntlGlobalProvider';
import NumberInput from "../../../../components/Input/NumberInput";

const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);

class Component extends React.Component {
  state = { dis: "", loc: null, loader: false };
  componentWillMount() { }

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
            this.props.getCustomer();
            message.warning(intl.formatMessage({ id: "shared.form.info.connectedSuccessfully" }));
          } else {
            message.warning(intl.formatMessage({ id: "shared.form.info.cannotConnect" }));
          }
          this.setState({ loader: false });
        });
      }
    });
  }

  /*  */
  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Spin
          spinning={loader}
        >
          <Form>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
                {getFieldDecorator("cardno", {
                  rules: [
                    // { required: true, message: "Картын дугаараа оруулна уу" },
                    { required: true, message: intl.formatMessage({ id: "shared.form.cardNumber.validation.required" }) },
                    { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.cardno.validation.pattern" }) },
                    { len: 14, message: intl.formatMessage({ id: "shared.form.cardno.validation.min" }) },
                  ],
                })(<NumberInput placeholder={intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })} autoComplete="off" maxLength={14} allowClear />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: intl.formatMessage({ id: "shared.form.password.validation.required" }) },
                  ],
                })(<NumberInput
                  placeholder={intl.formatMessage({ id: "shared.form.cardPassword.placeholder" })}
                  maxLength={4}
                  allowClear
                  type="password"
                  size="large"
                  className="col-md-12"
                  autoComplete="off"
                />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item style={{ width: '98.5%', marginBottom: '5px' }}>
                <div className="text-right">
                  <Button className="btn btn-dark" htmlType="submit" onClick={this.handleSubmit} style={{ width: "108.28px", background: '#343a40' }} >
                    <span className="text-uppercase"><FormattedMessage id="shared.form.button.connect" /></span>
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Form>
        </Spin>
      </Col>
    );
  }
}

export default injectIntl(Form.create({ name: "UserProfile" })(Component));
