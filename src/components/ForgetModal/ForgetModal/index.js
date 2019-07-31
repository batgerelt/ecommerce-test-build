/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col } from "antd";
import { Link } from "react-router-dom";

class ForgetModal extends React.Component {
  state = {
    visible: false,
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.reset({ mail: values.email }).then((res) => {
          if (res.payload.success) {
            this.handleForgetModal();
          }
        });
      }
    });
  };

  handleForgetModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    return (
      <Modal
        title="Нууц үг сэргээх"
        visible={visible}
        onCancel={this.handleForgetModal}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                {
                  required: true,
                  message: "Имэйл хаяг оруулна уу",
                  type: "email",
                },
              ],
            })(
              <Input
                allowClear
                className="form-control"
                placeholder="Имэйл"
                size="large"
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn-block btn-login text-uppercase"
            >
              Цааш
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "normal_forget" })(ForgetModal);
