/* eslint-disable react/no-multi-comp */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon } from "antd";
import { Link } from "react-router-dom";


import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = { visible: false };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleLoginModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleRegistrationModal = () => {
    this.handleLoginModal();
    this.props.RegistrationModal.handleSignup();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values: ', values);
        this.props.login({ body: { ...values } }).then((res) => {
          console.log('res: ', res);
          localStorage.setItem('auth', JSON.stringify(res.payload.data[0].info));
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="Нэвтрэх"
        visible={this.state.visible}
        onCancel={this.handleLoginModal}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Имэйл хаяг оруулна уу!' }],
            })(
              <Input
                allowClear
                className="form-control"
                placeholder="Имэйл"
                size="large"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Нууц үг оруулна уу!' }],
            })(
              <Input.Password
                allowClear
                className="form-control"
                placeholder="Нууц үг"
                size="large"
                type="password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn btn-block btn-login text-uppercase">
              Log in
            </Button>
          </Form.Item>
          <div className="form-group">
            <div className="row row10">
              <div className="col-xl-6 pad10">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="rememberMe"
                  />
                  <label className="custom-control-label" htmlFor="rememberMe">
                    Сануулах
                  </label>
                </div>
              </div>
              <div className="col-xl-6 pad10">
                <div className="text-right">
                  <Link
                    to=""
                    className="btn btn-link"
                    onClick={this.props.handleReset}
                  >
                    Нууц үгээ мартсан
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Form>

        <FacebookLogin />
        <GoogleLogin />

        <div className="text-center">
          <Link
            to=""
            className="btn btn-link"
            onClick={this.handleRegistrationModal}
          >
            Та шинээр бүртгүүлэх бол ЭНД ДАРЖ бүртгүүлнэ үү
          </Link>
        </div>
      </Modal>
    );
  }
}

export default Form.create({ name: 'normal_login' })(LoginModal);
