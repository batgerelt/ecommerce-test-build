/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { injectIntl } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col } from "antd";
import { Link } from "react-router-dom";

import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = {
    visible: false,
    isVisibleReset: false,
    isRemember: localStorage.getItem("auth") === null ? 1 : 0,
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

    const { intl } = this.props;

    // eslint-disable-next-line consistent-return
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          let result = await this.props.login({ body: { ...values } });
          if (!result.payload.success) {
            if (result.payload.code) {
              return message.error(intl.formatMessage({ id: result.payload.code }));
            }
            return null;
          }
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
            return message.error(result.payload.message);
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
    const { getFieldDecorator } = this.props.form;
    const { isRemember } = this.state;
    return (
      <Modal
        title="Нэвтрэх"
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
                  message: "Имэйл хаяг оруулна уу",
                  type: "email",
                },
              ],
            })(
              <Input
                allowClear
                className="form-control"
                placeholder="Имэйл"
                size="large"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Нууц үг оруулна уу" }],
            })(
              <Input.Password
                allowClear
                className="form-control"
                placeholder="Нууц үг"
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
              Нэвтрэх
            </Button>
          </Form.Item>
          <Form.Item>
            <Col span={12}>
              <Checkbox
                className="btn"
                onChange={this.onRemember}
                checked={isRemember}
              >
                Сануулах
              </Checkbox>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Link
                to=""
                className="btn btn-link"
                style={{ fontSize: "14px" }}
                onClick={this.handleResetVisible}
              >
                Нууц үгээ мартсан{" "}
              </Link>
            </Col>
          </Form.Item>
        </Form>

        <FacebookLogin />
        <GoogleLogin />

        <div className="text-center">
          <p>
            Та шинээр бүртгүүлэх бол{" "}
            <Link
              to="#"
              className="btn btn-link"
              onClick={this.handleRegistrationModal}
            >
              <strong>ЭНД ДАРЖ</strong>
            </Link>{" "}
            бүртгүүлнэ үү
          </p>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(Form.create({ name: "normal_login" })(LoginModal));
