import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, message, Input, Select, Icon, Spin, Col, Button, Divider, notification } from "antd";
// import { Link } from "react-router-dom";

class Component extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
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
            notification.success({ message: intl.formatMessage({ id: "shared.form.info.password.savedSuccessfully" }), duration: 2 });
          } else {
            notification.warning({ message: intl.formatMessage({ id: res.payload.code }), duration: 3 });
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
          <Col span={24} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.oldPassword.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("oldPassword", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.oldPassword.validation.required" }) }],
              })(<Input.Password className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.oldPassword.placeholder" })} />)}
            </Form.Item>
          </Col>
          <Col span={24} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.newPassword.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: intl.formatMessage({ id: "shared.form.newPassword.validation.required" }) },
                  { validator: this.validateToNextPassword },
                ],
              })(<Input.Password className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.newPassword.placeholder" })} />)}
            </Form.Item>
          </Col>
          <Col span={24} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.newPasswordAgain.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("confirm", {
                rules: [
                  { required: true, message: intl.formatMessage({ id: "shared.form.newPasswordAgain.validation.required" }) },
                  { validator: this.compareToFirstPassword },
                ],
              })(
                <Input.Password className="profile-custom-input" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "shared.form.newPasswordAgain.placeholder" })} />,
              )}
            </Form.Item>
          </Col>

          <Col span={24} className="padd10" style={{ textAlign: "right" }}>
            <Col xs={12} sm={12} md={18} lg={18} xl={18} />
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Form.Item className="text">
                <Button className="btn btn-dark" onClick={this.handleSubmit} htmlType="submit" style={{ background: '#343a40', height: "40px", width: "100%" }}>
                  <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="user-menu-content" style={{ margin: "0px !important" }}>
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span><FormattedMessage id="profile.deliveryAddress.title" /></span>
        </p>
        <Divider />
        <div className="user-profile-container">
          {this.renderPassword()}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
