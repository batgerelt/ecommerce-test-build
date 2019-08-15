import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
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
    const { intl } = this.props;
    if (value.length < 6) {
      callback(intl.formatMessage({ id: "shared.form.password.validation.weak" }));
    } else if (value.search(/[a-zA-Z]/) === -1) {
      callback(intl.formatMessage({ id: "shared.form.password.validation.weak" }));
    } else if (value.search(/[0-9]/) === -1) {
      callback(intl.formatMessage({ id: "shared.form.password.validation.weak" }));
    } else {
      callback();
    }
    if (value && this.state.confirmDirty) {
      this.props.form.validateFields(["confirm"], { force: true });
    }
  };

  renderPassword = () => {
    const { intl } = this.props;
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="row row10">
          <Col span={24}>
            <Form.Item style={{ marginBottom: '5px' }}>
              {getFieldDecorator("oldPassword", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.oldPassword.validation.required" }) }],
              })(<Input.Password placeholder={intl.formatMessage({ id: "shared.form.oldPassword.placeholder" })} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item hasFeedback style={{ marginBottom: '5px' }}>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: intl.formatMessage({ id: "shared.form.newPassword.validation.required" }) },
                  { validator: this.validateToNextPassword },
                  { min: 4, message: intl.formatMessage({ id: "shared.form.newPassword.validation.min" }) },
                ],
              })(<Input.Password placeholder={intl.formatMessage({ id: "shared.form.newPassword.placeholder" })} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item hasFeedback style={{ marginBottom: '5px' }}>
              {getFieldDecorator("confirm", {
                rules: [
                  { required: true, message: intl.formatMessage({ id: "shared.form.newPasswordAgain.validation.required" }) },
                  { validator: this.compareToFirstPassword },
                ],
              })(
                <Input.Password onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "shared.form.newPasswordAgain.placeholder" })} />,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item className="text-right" style={{ marginBottom: '5px' }}>
              <Button htmlType="submit" style={{ background: '#343a40' }} className="btn btn-dark" onClick={this.handleSubmit}>
                <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
              </Button>
            </Form.Item>
          </Col>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="user-menu-content">
        <p className="title">
          <span><FormattedMessage id="profile.changePassword.title" /></span>
        </p>
        <div className="user-profile-contain">
          {this.renderPassword()}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
