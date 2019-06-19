import React from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";

import { FacebookLogin, GoogleLogin } from "../";
import style from "./styles.less";

// import  from "./FacebookLogin";
// import GoogleLogin from "./GoogleLogin";
// import actions, {
//   setUser,
//   showLoginModal,
//   hideLoginModal,
// } from "../actions/login";
// import { showRegisterModal } from "../actions/register";
// import { updateCart } from "../actions/cart";
// import withCart from "./HOC/withCart";
// import storage from "../utils/storage";
// import api from "../api";
// import { toast } from "react-toastify";
// import Login from "./Login";

class LoginModal extends React.Component {
    state = { visible: false };

    componentWillUnmount() { this.props.onRef(null); }
    componentDidMount() { this.props.onRef(this); }

    /* Login modal нээх болон хаах функц */
    handleLoginModal = () => {
      this.setState({ visible: !this.state.visible });
    }

    /** Login Modal-ийн form зурах фунц */
    renderLoginForm = () => {
      try {
        const { getFieldDecorator } = this.props.form;

        return (
          <Form onSubmit={this.handleSubmit} >
            <div className="form-group">
              <label htmlFor="email" className="sr-only">
            Имэйл
              </label>
              {getFieldDecorator("email", {
            rule: [
              {
                required: true,
                message: "Имэйл хаяг оруулна уу",
              },
            ],
            /* initialValue: "tulgaa@datacare.mn" */
          })(
            <input
              autoComplete="off"
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="И-мэйл"
            />,
          )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="sr-only">
            Нууц үг
              </label>
              {getFieldDecorator("password", {
            rule: [
              {
                required: true,
                message: "Нууц үг оруулна уу",
              },
            ],
            /* initialValue: "123123" */
          })(
            <input
              type="password"
              autoComplete="off"
              className="form-control"
              id="password"
              aria-describedby="passwordHelp"
              placeholder="Нууц үг"
            />,
          )}
            </div>
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
                      className={style.link}
                      onClick={this.props.handleReset}
                    >
                      Нууц үгээ мартсан
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="primary"
              className="btn btn-block btn-login text-uppercase"
              htmlType="submit"
            >
              Нэвтрэх
            </Button>
          </Form>
        );
      } catch (error) {
        return console.log(error);
      }
    }

    render() {
      return (
        <div>
          <Modal
            title="Нэвтрэх"
            visible={this.state.visible}
            onOk={this.handleLoginModal}
            onCancel={this.handleLoginModal}
            maskClosable={false}
            footer={[]}
          >
            {this.renderLoginForm()}

            <span className="divide-maker">Эсвэл</span>

            <FacebookLogin />
            <GoogleLogin />

            <div className="text-center">
              <Link
                to=""
                className={style.link}
                onClick={this.showRegisterModal}
              >
                Та шинээр бүртгүүлэх бол ЭНД ДАРЖ бүртгүүлнэ үү
              </Link>
            </div>
          </Modal>
          <Modal
            title="Нууц үг сэргээх"
            visible={this.state.isVisibleReset}
            onCancel={this.handleCancelReset}
            footer={[]}
          >
            <form onSubmit={this.handleSubmit}>
              <div>
                <Input
                  placeholder="И-мэйл хаягаа оруулна уу"
                  onChange={this.onChangeMail}
                />
              </div>
              <a
                className="btn btn-dark"
                style={{ width: "100%", marginTop: "20px" }}
                onClick={this.handleSubmit}
              >
                <span className="text-uppercase">Цааш</span>
              </a>
            </form>
          </Modal>
        </div>
      );
    }
}

const mapStateToProps = state => ({
  isVisible: state.auth.isLoginModalVisible,
  cart: state.cart,
});

export default Form.create({ name: 'LoginModal' })(LoginModal);
