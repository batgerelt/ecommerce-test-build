/* eslint-disable react/no-multi-comp */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon, message } from "antd";
import { Link } from "react-router-dom";


import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = { visible: false, isVisibleReset: false };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  }

  handleLoginModal = () => {
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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await this.props.login({ body: { ...values } }).then((res) => {
            localStorage.setItem('auth', JSON.stringify(res.payload.data[0].info));
          });

          let products = this.props.cart.products.map(prod => ({
            skucd: prod.cd,
            qty: prod.qty,
          }));

          const custId = this.props.auth.data[0].info.customerInfo.id;

          await this.props.saveAllToDb({
            custid: custId,
            iscart: 0,
            body: products,
          });

          products = await this.props.getProducts(custId);

          products.payload.data.forEach((savedProd) => {
            this.props.replaceReduxStoreBy(savedProd);
          });
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


  render() {
    const { getFieldDecorator } = this.props.form;
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
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="rememberMe"
                    />
                    <label className="custom-control-label" htmlFor="rememberMe">Сануулах</label>
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
