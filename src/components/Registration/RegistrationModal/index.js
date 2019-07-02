/* eslint-disable react/no-danger */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon } from "antd";
import { Link } from "react-router-dom";

class RegistrationModal extends React.Component {
  state = { visible: false };

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
            console.log(res.payload);
          } else {
            console.log(res.payload);
          }
        });
      }
    });
  };

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
          <Form.Item>
            {getFieldDecorator("firstname", {
              rules: [{ required: true }],
            })(
              <Input placeholder="Овог" className="form-control" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("lastname", {
              rules: [{ required: true }],
            })(
              <Input placeholder="Нэр" className="form-control" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{ required: true }],
            })(
              <Input placeholder="И мэйл хаяг" className="form-control" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("phonE1", {
              rules: [{ required: true }],
            })(
              <Input
                placeholder="Утасны дугаар"
                className="form-control"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("password", {
              rules: [{ required: true }],
            })(
              <Input.Password
                placeholder="Нууц үг"
                className="form-control"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("confirm", {
              rules: [{ required: true }],
            })(
              <Input.Password
                onBlur={this.handleConfirmBlur}
                placeholder="Нууц үгээ дахин давтах!"
                className="form-control"
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn btn-block btn-login text-uppercase" onClick={this.handleSubmit}>
              Бүртгүүлэх
            </Button>
          </Form.Item>

          <span className="divide-maker">Эсвэл</span>
          <button
            type="submit"
            className="btn btn-block btn-social btn-facebook"
          >
            <span>Facebook-р бүртгүүлэх</span>
          </button>
          <button
            type="submit"
            className="btn btn-block btn-social btn-gmail"
          >
            <span>Gmail-р бүртгүүлэх</span>
          </button>
          {/*  <button
              type="submit"
              className="btn btn-block btn-social btn-emart"
            >
              Имарт картаар бүртгүүлэх
            </button> */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'normal_registration' })(RegistrationModal);
