/* eslint-disable react/no-multi-comp */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon } from "antd";
import { Link } from "react-router-dom";


import { FacebookLogin, GoogleLogin } from "../";
import style from "./styles.less";

class LoginModal extends React.Component {
  state = { visible: false };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleLoginModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleLogin = () => {
    this.props.form.getFieldValue('email');
    console.log('this.props.form.getFieldValue();: ', this.props.form.getFieldValue('email'));
  }

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
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="И-мэйл"
              size="large"
              className="form-control"
            />,
          )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Нууц үг оруулна уу!' }],
          })(
            <Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Нууц үг"
              size="large"
              className="form-control"
            />,
          )}
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
          <Form.Item>
            <Button
              type="primary"
              className="btn btn-block btn-login text-uppercase"
            >
            Нэвтрэх
            </Button>
          </Form.Item>
        </Form>

        <FacebookLogin />
        <GoogleLogin />

        <div className="text-center">
          <Link
            to=""
            className="btn btn-link"
            onClick={this.showRegisterModal}
          >
              Та шинээр бүртгүүлэх бол ЭНД ДАРЖ бүртгүүлнэ үү
          </Link>
        </div>
      </Modal>
    );
  }
}

export default Form.create({ name: 'normal_login' })(LoginModal);


// class Content extends React.Component {
//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   };
//   render() {
//     const { getFieldDecorator } = this.props.form;

//     return (
//       <Form onSubmit={this.handleSubmit} >
//         <Form.Item>
//           {getFieldDecorator("email", {
//               rule: [
//                 { type: 'email', message: 'The input is not valid E-mail!' },
//                 { required: true, message: "Имэйл хаяг оруулна уу" },
//               ],
//               })(
//                 <Input allowClear placeholder="Имэйл" size="large" />,
//               )}
//         </Form.Item>

//         <Form.Item>
//           {getFieldDecorator("password", {
//                   rule: [{ required: true, message: "Нууц үг оруулна уу" }],
//                 })(
//                   <Input.Password allowClear placeholder="Нууц үг" size="large" />,
//                 )}
//         </Form.Item>

//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             className="btn btn-block btn-login text-uppercase"
//           >
//               Нэвтрэх
//           </Button>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const LoginForm = Form.create({ name: 'LoginModal' })(Content);
