/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col, notification } from "antd";
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
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // eslint-disable-next-line consistent-return
        this.props.reset({ mail: values.email }).then((res) => {
          if (!res.payload.success) {
            return notification.warning({ message: intl.formatMessage({ id: res.payload.code }) });
          }
          notification.success({ message: intl.formatMessage({ id: res.payload.code }), duration: 2 });
          this.props.form.resetFields();
          this.handleForgetModal();
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
    const { intl } = this.props;
    return (
      <Modal
        title={intl.formatMessage({ id: "forgottenPasswordModal.title" })}
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
                  message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                  type: "email",
                },
              ],
            })(
              <Input
                allowClear
                className="form-control"
                placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
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
              <FormattedMessage id="shared.form.button.next" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default injectIntl(Form.create({ name: "normal_forget" })(ForgetModal));
