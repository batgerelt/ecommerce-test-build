/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button, message } from "antd";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmDirty: false,
    };
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    if (value && this.state.confirmDirty) {
      this.props.form.validateFields(["confirmpassword"], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue("password")) {
      callback("Шинэ нууц үгээ зөв давтана уу");
    } else {
      callback();
    }
  };

  onSubmitRegister = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password === values.confirmpassword) {
          this.props.signup({ body: { ...values } }).then((res) => {
            if (res.payload.success) {
              this.props.LoginRegisterPanel.changeTab(1);
              message.success("Та имэйл хаягаа шалгаж баталгаажуулалт хийнэ үү");
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
                {getFieldDecorator("lastname", {
                  rules: [{
                    required: true,
                    pattern: new RegExp("[A-Za-zА-Яа-я]"),
                    message: "Нэрээ оруулна уу",
                  }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Овог*"
                    className="form-control"
                    autoComplete="off"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("firstname", {
                  rules: [{
                    required: true,
                    pattern: new RegExp("[A-Za-zА-Яа-я]"),
                    message: "Нэрээ оруулна уу",
                  }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Нэр*"
                    className="form-control"
                    autoComplete="off"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [{
                    required: true,
                    type: "email",
                    pattern: new RegExp("[A-Za-z]"),
                    message: "Имэйл хаягаа оруулна уу",
                  }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="И мэйл*"
                    autoComplete="off"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("phonE1", {
                  rules: [
                    { required: true, message: "Утасны дугаар оруулна уу" },
                    { pattern: new RegExp("^[0-9]*$"), message: "Утасны дугаар зөв оруулна уу" },
                    { min: 8, message: "Утасны дугаар 8 оронтой байна" },
                  ],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder="Утас*"
                    autoComplete="off"
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Нууц үгээ заавал оруулна уу" },
                    { validator: this.validateToNextPassword },
                    { min: 4, message: "Нууц үг хамгийн багадаа 4 оронтой байна." },
                  ],
                })(
                  <Input.Password placeholder="Нууц үг" className="form-control" autoComplete="off" />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("confirmpassword", {
                  rules: [
                    { required: true, message: "Нууц үгээ дахин оруулна уу" },
                    { validator: this.compareToFirstPassword },
                  ],
                })(
                  <Input.Password onBlur={this.handleConfirmBlur} placeholder="Нууц үгээ дахин давтах!" className="form-control" autoComplete="off" />,
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
