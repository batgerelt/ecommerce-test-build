import React from "react";
import { Form, message, Input, Select, Icon, Spin, Col, Button } from "antd";
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
        this.props.resetPassword({ body: params }).then((res) => {
          if (res.payload.success) {
            message.success(res.payload.message);
            this.props.form.resetFields();
          }
        });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue("password")) {
      callback("Шинэ нууц үгээ зөв давтана уу");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    if (value && this.state.confirmDirty) {
      this.props.form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  renderPassword = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="row row10">
          <Col span={24}>
            <Form.Item hasFeedback style={{ marginBottom: '5px' }}>
              {getFieldDecorator("oldPassword", {
                rules: [{ required: true, message: "Хуучин нууц үг!" }, { validator: this.validateToNextPassword }],
              })(<Input.Password placeholder="Хуучин нууц үг" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item hasFeedback style={{ marginBottom: '5px' }}>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Шинэ нууц үг!" },
                  { validator: this.validateToNextPassword },
                  { min: 4, message: "Нууц үг хамгийн багадаа 4 оронтой байна." },
                ],
              })(<Input.Password placeholder="Шинэ нууц үг" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item hasFeedback style={{ marginBottom: '5px' }}>
              {getFieldDecorator("confirm", {
                rules: [
                  { required: true, message: "Шинэ нууц үгээ дахин давтах!" },
                  { validator: this.compareToFirstPassword },
                ],
              })(
                <Input.Password onBlur={this.handleConfirmBlur} placeholder="Шинэ нууц үгээ дахин давтах" />,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item className="text-right" style={{ marginBottom: '5px' }}>
              <Button htmlType="submit" style={{ background: '#343a40' }} className="btn btn-dark" onClick={this.handleSubmit}>
                <span className="text-uppercase">Хадгалах</span>
              </Button>
            </Form.Item>
          </Col>

          {/* <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
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
          </div> */}
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
