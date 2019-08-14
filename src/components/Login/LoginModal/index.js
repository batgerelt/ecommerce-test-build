/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col } from "antd";
import { Link, Redirect } from "react-router-dom";

import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = {
    visible: false,
    isVisibleReset: false,
    isRemember: localStorage.getItem("auth") === null ? 1 : 0,
    direct: false,
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  handleLoginModal = () => {
    this.props.form.resetFields();
    this.setState({ visible: !this.state.visible });
  };

  handleRegistrationModal = () => {
    this.handleLoginModal();
    this.props.RegistrationModal.handleSignup();
  };

  handleResetVisible = () => {
    this.setState({ visible: false });
    this.props.ForgetModal.handleForgetModal();
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props);
    const { intl } = this.props;

    // eslint-disable-next-line consistent-return
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          let result = await this.props.login({ body: { ...values } });
          if (result.payload.success) {
            message.warning(intl.formatMessage({ id: "loginModal.info.success" }));
          } else {
            if (result.payload.code) {
              message.warning(intl.formatMessage({ id: result.payload.code }));
            }
            return null;
          }
          this.setState({ direct: true });
          localStorage.setItem('img', result.payload.data[0].info.customerInfo.imgnm);
          localStorage.setItem('auth', JSON.stringify(result.payload));
          localStorage.setItem('username', this.state.isRemember ? values.email : null);
          localStorage.setItem('percent', result.payload.data[0].info.customerInfo.cstatus);
          localStorage.setItem('next', JSON.stringify(result.payload.data[0].info.customerInfo));
          this.props.getCustomer().then((res) => {
            if (res.payload.success) {
              localStorage.setItem('next', JSON.stringify(res.payload.data.info));
            }
          });
          localStorage.removeItem(this.state.isRemember ? null : 'username');
          this.handleLoginModal();
          this.props.form.resetFields();
          let products = [];
          if (this.props.cart === undefined) {
            products = this.props.products;
          } else {
            products = this.props.cart.products;
          }
          products = products.map(prod => ({
            skucd: prod.cd,
            qty: prod.qty,
          }));

          result = await this.props.increaseProductsByQtyRemotely({
            body: products,
          });
          if (!result.payload.success) {
            message.warning(intl.formatMessage({ id: result.payload.code }));
          }

          this.props.getProducts();
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  onRemember = (e) => {
    this.setState({ isRemember: e.target.checked });
  };

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isRemember } = this.state;
    return (
      <Modal
        title={intl.formatMessage({ id: "loginModal.title" })}
        visible={this.state.visible}
        onCancel={this.handleLoginModal}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("email", {
              initialValue:
                localStorage.getItem("username") === null
                  ? ""
                  : localStorage.getItem("username"),
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                  type: "email",
                },
              ],
            })(
              <Input
                allowClear
                className="form-control"
                placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                size="large"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.password.validation.required" }) }],
            })(
              <Input.Password
                allowClear
                className="form-control"
                placeholder={intl.formatMessage({ id: "shared.form.password.placeholder" })}
                type="password"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn-block btn-login text-uppercase"
            >
              <FormattedMessage id="shared.form.button.login" />
            </Button>
          </Form.Item>
          <Form.Item>
            <Col span={12}>
              <Checkbox
                className="btn"
                onChange={this.onRemember}
                checked={isRemember}
              >
                <FormattedMessage id="shared.form.label.rememberMe" />
              </Checkbox>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Link
                to=""
                className="btn btn-link"
                style={{ fontSize: "14px" }}
                onClick={this.handleResetVisible}
              >
                <FormattedMessage id="shared.form.label.forgotPassword" />
              </Link>
            </Col>
          </Form.Item>
        </Form>

        <FacebookLogin />
        <GoogleLogin />

        <div className="text-center">
          <p>
            <FormattedMessage
              id="loginModal.linkToRegistration"
              defaultMessage="Та шинээр бүртгүүлэх бол {link} бүртгүүлнэ үү"
              values={{
                link: (
                  <Link
                    to="#"
                    className="btn btn-link"
                    onClick={this.handleRegistrationModal}
                  >
                    <strong>
                      <FormattedMessage
                        id="loginModal.linkToRegistration.link"
                        defaultMessage="ЭНД ДАРЖ"
                      />
                    </strong>
                  </Link>
                ),
              }}
            />
          </p>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(Form.create({ name: "normal_login" })(LoginModal));
