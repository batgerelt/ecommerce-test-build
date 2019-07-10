import React from "react";
import { Divider, Rate, message, Form, Input } from "antd";
import { Redirect, Link } from 'react-router-dom';

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  renderPass = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { changePass } = this.props;
      return (
        <div className="col-md-12">
          <center>
            <div className="content">
              <div className="text-center">
                {/* <img src={process.env.IMAGE + staticInfo.logopath} width="150px" /> */}
                <h4 className="title">
                  <span className="text-uppercase">НУУЦ ҮГ СЭРГЭЭХ</span>
                </h4>
                <p>Та нууц үгээ оруулна уу!</p>
              </div>
            </div>
            <div className="col-xl-2">
              <Form onSubmit={this.handleSubmit} className="login-form">
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
                    ],
                  })(<Input.Password placeholder="Шинэ нууц үг" />)}
                </Form.Item>
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
                  })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="Шинэ нууц үгээ дахин давтах" />)}
                </Form.Item>
              </Form>
              <div>
                <button
                  className="btn btn-dark"
                  style={{ width: "100%" }}
                  onClick={this.handleSubmit}
                >
                  <span className="text-uppercase">Хадгалах</span>
                </button>
              </div>
            </div>
          </center>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
  unsuccessPass() {
    return (
      <div>
        {message.error(this.props.changePass.data)}
        {<Redirect to="/" />}
      </div>

    );
  }
  checkResponse = () => {
    try {
      const { changePass } = this.props;
      console.log(changePass.success);
      return (
        <div>
          {changePass.success ? this.renderPass() : this.unsuccessPass()}
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div className="top-container">
        <div className="section">
          {this.props.changePass === undefined ? null : this.checkResponse()}
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
