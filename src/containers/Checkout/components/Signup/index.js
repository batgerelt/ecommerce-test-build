/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button, message } from "antd";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onSubmitRegister = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password === values.confirmpassword) {
          this.props.signup({ body: { ...values } }).then((res) => {
            if (res.payload.success) {
              message.success(res.payload.message);
            } else {
              message.error(res.payload.message);
            }
          });
        } else {
          message.error("Нууц үг таарсангүй");
        }
      }
    });
  };

  renderRegisterForm = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.onSubmitRegister}>
          <div className="row row10">
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("firstname", {
                  rules: [{ required: true, message: "Овог оруулна уу ?" }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Овог*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("lastname", {
                  rules: [{ required: true, message: "Нэр оруулна уу ?" }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Нэр*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [{ required: true, message: "И мэйл оруулна уу ?" }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="И мэйл*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("phonE1", {
                  rules: [{ required: true, message: "Утас оруулна уу ?" }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Утас*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item hasFeedback>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "Нууц үг оруулна уу ?" }],
                })(
                  <Input.Password
                    allowClear
                    placeholder="Нууц үг*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item hasFeedback>
                {getFieldDecorator("confirmpassword", {
                  rules: [{ required: true, message: "Нууц үг оруулна уу ?" }],
                })(
                  <Input.Password
                    allowClear
                    placeholder="Нууц үг давт*"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row row10">
            <Button
              className="btn btn-login text-uppercase"
              loading={this.state.loading}
              size={"large"}
              htmlType="submit"
              style={{ padding: "5px 50px", marginLeft: "17em" }}
            >
              Бүртгүүлэх
            </Button>
          </div>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderRegisterForm();
  }
}

export default Form.create({ name: "checkoutregister" })(Signup);
