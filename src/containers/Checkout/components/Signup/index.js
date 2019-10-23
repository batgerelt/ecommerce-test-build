/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message, notification } from "antd";
import NumberInput from "../../../../components/Input/NumberInput";
import LetterInput from "../../../../components/Input/LetterInput";

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

  /* validateToNextPassword = (rule, value, callback) => {
    if (value && this.state.confirmDirty) {
      this.props.form.validateFields(["confirmpassword"], { force: true });
    }
    callback();
  }; */

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
      this.props.form.validateFields(["confirmpassword"], { force: true });
    }
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { intl } = this.props;
    if (value && value !== this.props.form.getFieldValue("password")) {
      callback(intl.formatMessage({ id: "shared.form.passwordAgain.validation.compare" }));
    } else {
      callback();
    }
  };

  onSubmitRegister = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password === values.confirmpassword) {
          this.props.signup({ body: { ...values } }).then((res) => {
            if (res.payload.success) {
              this.props.form.resetFields();
              this.props.LoginRegisterPanel.changeTab(1);
              notification.success({ message: intl.formatMessage({ id: "registration.confirmation.email" }), duration: 2 });
            } else {
              notification.warning({
                message: intl.formatMessage({ id: res.payload.code }),
                duration: 3,
              });
            }
          });
        } else {
          notification.warning({
            message: intl.formatMessage({ id: "shared.form.passwordAgain.validation.compare" }),
            duration: 3,
          });
        }
      }
    });
  };

  onChangeLast = (value) => {
    this.props.form.setFieldsValue({ lastname: value });
  };

  onChangeFirst = (value) => {
    this.props.form.setFieldsValue({ firstname: value });
  };


  renderRegisterForm = () => {
    try {
      const { intl } = this.props;
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
                    message: intl.formatMessage({ id: "shared.form.lastname.validation.required" }),
                  }],
                })(
                  <LetterInput placeholder={intl.formatMessage({ id: "shared.form.lastname.placeholder" })} className="form-control" onChange={this.onChangeLast} />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("firstname", {
                  rules: [{
                    required: true,
                    pattern: new RegExp("[A-Za-zА-Яа-я]"),
                    message: intl.formatMessage({ id: "shared.form.firstname.validation.required" }),
                  }],
                })(
                  <LetterInput placeholder={intl.formatMessage({ id: "shared.form.firstname.placeholder" })} className="form-control" onChange={this.onChangeFirst} />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("email", {
                  initialValue: "",
                  rules: [{
                    required: true,
                    type: "email",
                    pattern: new RegExp("[A-Za-z]"),
                    message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                  }],
                })(
                  <Input
                    allowClear
                    type="text"
                    placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                    autoComplete="off"
                    style={{ border: "none" }}
                    className="form-control"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("phone1", {
                  rules: [
                    { required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                    { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                    { min: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) },
                  ],
                })(
                  <NumberInput
                    placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })}
                    maxLength={8}
                    className="form-control"
                    autoComplete="off"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("password", {
                  initialValue: "",
                  rules: [
                    { required: true, message: intl.formatMessage({ id: "shared.form.password.validation.required" }) },
                    { validator: this.validateToNextPassword },
                  ],
                })(
                  <Input type="password" placeholder={intl.formatMessage({ id: "shared.form.password.placeholder" })} className="form-control" autoComplete="new-password" />,
                )}
              </Form.Item>
            </div>
            <div className="col-xl-6 pad10">
              <Form.Item>
                {getFieldDecorator("confirmpassword", {
                  initialValue: "",
                  rules: [
                    { required: true, message: intl.formatMessage({ id: "shared.form.passwordAgain.validation.required" }) },
                    { validator: this.compareToFirstPassword },
                  ],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "shared.form.passwordAgain.placeholder" })} className="form-control" autoComplete="off" />,
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
              <FormattedMessage id="shared.form.button.register" />
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

export default injectIntl(Form.create({ name: "checkoutregister" })(Signup));
