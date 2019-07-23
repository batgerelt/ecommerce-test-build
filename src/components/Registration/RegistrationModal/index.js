/* eslint-disable react/no-danger */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon, message } from "antd";
import { Link } from "react-router-dom";

class RegistrationModal extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    isLoading: false,
    visible: false,
  };
  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleSignup = () => {
    this.setState({ visible: !this.state.visible });
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signup({ body: values }).then((res) => {
          if (res.payload.success) {
            this.handleSignup();
            message.success("Та мэйл хаягаараа баталгаажуулна уу!");
          }
        });
      }
    });
  };

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

  validateToNextPassword = (rule, value, callback) => {
    if (value === "1") {
      console.log(value);

      callback("Нэрнүүд");
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="Бүртгүүлэх"
        visible={this.state.visible}
        onCancel={this.handleSignup}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item hasFeedback>
            {getFieldDecorator("firstname", {
              rules: [
                { pattern: new RegExp("[A-Za-z]"), message: "no no no" },
                { validator: this.validateToNextPassword },
              ],
            })(
              <Input placeholder="Овог" maxLength={50} type="text" className="form-control" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("lastname", {
              rules: [{
                required: true,
                pattern: new RegExp("^[A-Za-z]*$"),
                message: "Нэрээ оруулна уу",
              }],
            })(
              <Input placeholder="Нэр" maxLength={50} type="text" className="form-control" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{
                required: true,
                type: "email",
                message: "Имэйлээ хаягаа оруулна уу",
              }],
            })(
              <Input placeholder="И мэйл хаяг" className="form-control" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("phonE1", {
              rules: [
                { required: true, min: 8, message: " " },
                { pattern: new RegExp("^[0-9]*$"), message: "Утасны дугаар зөв оруулна уу" },
              ],
            })(
              <Input
                placeholder="Утасны дугаар"
                maxLength={8}
                className="form-control"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
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
          <Form.Item hasFeedback>
            {getFieldDecorator("confirm", {
              rules: [
                { required: true, message: "Нууц үгээ дахин оруулна уу" },
                { validator: this.compareToFirstPassword },
              ],
            })(
              <Input.Password onBlur={this.handleConfirmBlur} placeholder="Нууц үгээ дахин давтах!" className="form-control" autoComplete="off" />,
            )}
          </Form.Item>

          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button type="primary" htmltype="submit" className="btn btn-block btn-login text-uppercase" onClick={this.handleSubmit}>
              Бүртгүүлэх
            </button>
          </Form.Item>

          <span className="divide-maker">Эсвэл</span>
          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button
              type="submit"
              className="btn btn-block btn-social btn-facebook"
            >
              <span>Facebook-р бүртгүүлэх</span>
            </button>
          </Form.Item>

          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button
              type="submit"
              className="btn btn-block btn-social btn-gmail"
            >
              <span>Gmail-р бүртгүүлэх</span>
            </button>
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'normal_registration' })(RegistrationModal);
