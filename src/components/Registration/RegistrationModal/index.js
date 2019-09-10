/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import LetterInput from "../../Input/LetterInput";
import LatinInput from "../../Input/LatinInput";
import NumberInput from "../../Input/NumberInput";

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
    const { intl } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line consistent-return
        this.props.signup({ body: values }).then((res) => {
          if (!res.payload.success) {
            return message.warning(intl.formatMessage({ id: res.payload.code }));
          }
          message.success(intl.formatMessage({ id: res.payload.code }), 5);
          this.handleSignup();
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
      const { intl } = this.props;
      callback(intl.formatMessage({ id: "shared.form.passwordAgain.validation.compare" }));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { intl } = this.props;
    if (value.length < 6) {
      callback(intl.formatMessage({ id: "shared.form.password.validation.weak" }));
    } else if (value.search(/[a-zA-ZА-Яа-яөүӨҮ]/) === -1) {
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

  onChangeLast = (value) => {
    this.props.form.setFieldsValue({ lastname: value });
  };

  onChangeFirst = (value) => {
    this.props.form.setFieldsValue({ firstname: value });
  };

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={intl.formatMessage({ id: "registerModal.title" })}
        visible={this.state.visible}
        onCancel={this.handleSignup}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("lastname", {
              rules: [
                { required: true, message: intl.formatMessage({ id: "shared.form.lastname.validation.required" }) },
              ],
            })(
              <LetterInput placeholder={intl.formatMessage({ id: "shared.form.lastname.placeholder" })} className="form-control" onChange={this.onChangeLast} />,
            )}
          </Form.Item>
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
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{
                required: true,
                type: "email",
                pattern: new RegExp("[A-Za-z]"),
                message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
              }],
            })(
              <LatinInput
                placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                className="form-control"
                autoComplete="off"
              />,
            )}
          </Form.Item>
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
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { validator: this.validateToNextPassword },
              ],
            })(
              <Input type="password" placeholder={intl.formatMessage({ id: "shared.form.password.placeholder" })} className="form-control" autoComplete="new-password" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("confirm", {
              rules: [
                { required: true, message: intl.formatMessage({ id: "shared.form.passwordAgain.validation.required" }) },
                { validator: this.compareToFirstPassword },
              ],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "shared.form.passwordAgain.placeholder" })} className="form-control" autoComplete="off" />,
            )}
          </Form.Item>

          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button type="primary" htmltype="submit" className="btn btn-block btn-login text-uppercase" onClick={this.handleSubmit}>
              <FormattedMessage id="shared.form.button.register" />
            </button>
          </Form.Item>

          <span className="divide-maker"><FormattedMessage id="shared.form.label.or" /></span>
          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button
              type="submit"
              className="btn btn-block btn-social btn-facebook"
            >
              <span><FormattedMessage id="shared.form.button.facebookRegister" /></span>
            </button>
          </Form.Item>

          <Form.Item style={{ width: '100%', marginBottom: '5px' }}>
            <button
              type="submit"
              className="btn btn-block btn-social btn-gmail"
            >
              <span><FormattedMessage id="shared.form.button.googleRegister" /></span>
            </button>
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default injectIntl(Form.create({ name: 'normal_registration' })(RegistrationModal));
