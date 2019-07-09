import React from "react";
import { Form, message, Input, Select, Icon, Spin } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          email: this.props.data[0].info.customerInfo.email,
          oldPass: values.oldPassword,
          NewPass: values.password,
        };
        console.log(params);
        this.props.resetPassword({ body: params }).then((res) => {
          console.log(res);
          /* this.props.form.resetFields();
        console.log('this.props.form: ', this.props.form); */
        });
      }
    });
  }
  renderPassword = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form>
          <div className="row row10">
            <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item hasFeedback>
                  {getFieldDecorator("oldPassword", {
                    rules: [
                      {
                        required: true,
                        message: "Хуучин нууц үг!",
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password placeholder="Хуучин нууц үг" />)}
                </Form.Item>
              </div>
            </div>
            <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item hasFeedback>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Шинэ нууц үг!",
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                      {
                        min: 4,
                        message: "Нууц үг хамгийн багадаа 4 оронтой байна.",
                      },
                    ],
                  })(<Input.Password placeholder="Шинэ нууц үг" />)}
                </Form.Item>{" "}
              </div>
            </div>
            <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item hasFeedback>
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "Шинэ нууц үгээ дахин давтах!",
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      onBlur={this.handleConfirmBlur}
                      placeholder="Шинэ нууц үгээ дахин давтах"
                    />,
                  )}
                </Form.Item>{" "}
              </div>
            </div>
            <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <div className="text-right">
                  <button
                    className="btn btn-dark"
                    onClick={this.handleSubmit}
                  >
                    <span className="text-uppercase">Хадгалах</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Нууц үг солих</span>
          </p>
          <div className="user-profile-contain">
            {this.renderPassword()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
