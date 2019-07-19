/* eslint-disable react/no-multi-comp */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon, message } from "antd";
import { Link } from "react-router-dom";

import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = {
    visible: false,
    isVisibleReset: false,
    isRemember: localStorage.getItem('auth') === null ? 1 : 0,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleLoginModal = () => {
    this.props.form.resetFields();
    this.setState({ visible: !this.state.visible });
  }

  handleRegistrationModal = () => {
    this.handleLoginModal();
    this.props.RegistrationModal.handleSignup();
  }

  handleResetVisible = () => {
    this.handleLoginModal();
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-return
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          let result = await this.props.login({ body: { ...values } });
          if (!result.payload.success) {
            return message.error('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!');
          }
          localStorage.setItem('img', result.payload.data[0].info.customerInfo.imgnm);
          localStorage.setItem('auth', JSON.stringify(result.payload));
          localStorage.setItem('username', this.state.isRemember ? values.email : null);
          localStorage.removeItem(this.state.isRemember ? null : 'username');
          this.handleLoginModal();
          this.props.form.resetFields();

          let { products } = this.props.cart;
          products = products.map(prod => ({
            skucd: prod.cd,
            qty: prod.qty,
          }));

          result = await this.props.increaseProductsByQtyRemotely({
            iscart: 0,
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

  handleCancelReset = () => {
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
  };

  handleSubmitReset = () => {
    this.props.reset({ mail: this.state.mail }).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        this.handleCancelReset();
      }
    });
  }

  changemail = (e) => {
    this.setState({ mail: e.target.value });
  }

  floorNewspaperRemember = (e) => {
    this.setState({ isRemember: e.target.checked });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { isRemember } = this.state;
    return (
      <div>
        <Modal
          title="Нэвтрэх"
          visible={this.state.visible}
          onCancel={this.handleLoginModal}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('email', {
                initialValue: localStorage.getItem('username'),
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
              <Button type="primary" htmlType="submit" className="btn btn-block btn-login text-uppercase">Нэвтрэх</Button>
            </Form.Item>
            <div className="form-group">
              <div className="row row10">
                <div className="col-xl-6 pad10">
                  <div className="custom-control custom-checkbox">
                    <Checkbox className="custom-control-inpu" onChange={this.floorNewspaperRemember} checked={isRemember} >Сануулах</Checkbox>
                  </div>
                </div>
                <div className="col-xl-6 pad10">
                  <div className="text-right">
                    <Link
                      to=""
                      className="btn btn-link"
                      onClick={this.handleResetVisible}
                    >Нууц үгээ мартсан
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
              to="#"
              className="btn btn-link"
              onClick={this.handleRegistrationModal}
            >Та шинээр бүртгүүлэх бол ЭНД ДАРЖ бүртгүүлнэ үү
            </Link>
          </div>
        </Modal>

        <Modal
          title="Нууц үг сэргээх"
          visible={this.state.isVisibleReset}
          onCancel={this.handleCancelReset}
          footer={null}
        >
          <form onSubmit={this.handleSubmitReset}>
            <div>
              <Input
                placeholder="И-мэйл хаягаа оруулна уу"
                onChange={this.changemail}
                type="mail"
              />
            </div>
            <a
              className="btn btn-dark"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={this.handleSubmitReset}
            >
              <span className="text-uppercase">Цааш</span>
            </a>
          </form>
        </Modal>
      </div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(LoginModal);
