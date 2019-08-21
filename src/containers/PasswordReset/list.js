import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Divider, Rate, message, Form, Input } from "antd";
import { Redirect, Link } from 'react-router-dom';

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { home: false };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.changePassword({
          key: this.props.match.params.key,
          password: values.password,
        }).then((res) => {
          console.log('res: ', res);
          this.setState({ home: true });
        });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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

  compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue("password")) {
      callback("Нууц үгээ зөв давтана уу");
    } else {
      callback();
    }
  };

  renderPass = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { changePass, intl } = this.props;
      return (
        <div className="col-md-12">
          <center>
            <div className="content">
              <div className="text-center">
                {/* <img src={process.env.IMAGE + staticInfo.logopath} width="150px" /> */}
                <h4 className="title">
                  <span className="text-uppercase"><FormattedMessage id="restorePassword.title" /></span>
                </h4>
                <p><FormattedMessage id="restorePassword.subtitle" /></p>
              </div>
            </div>
            <div className="col-xl-2">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item hasFeedback style={{ textAlign: "left" }}>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: intl.formatMessage({ id: "shared.form.newPassword.validation.required" }) },
                      { validator: this.validateToNextPassword },
                    ],
                  })(<Input.Password placeholder={intl.formatMessage({ id: "shared.form.newPassword.placeholder" })} />)}
                </Form.Item>
                <Form.Item hasFeedback style={{ textAlign: "left" }}>
                  {getFieldDecorator("confirm", {
                    rules: [
                      { required: true, message: intl.formatMessage({ id: "shared.form.newPasswordAgain.validation.required" }) },
                      { validator: this.compareToFirstPassword },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "shared.form.newPasswordAgain.placeholder" })} />)}
                </Form.Item>
              </Form>
              <div>
                <button
                  className="btn btn-dark"
                  style={{ width: "100%" }}
                  onClick={this.handleSubmit}
                >
                  <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
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
        {<Redirect to="/" />}
      </div>
    );
  }
  checkResponse = () => {
    try {
      const { checkKeys } = this.props;
      return (
        <div>
          {checkKeys.success ? this.renderPass() : this.unsuccessPass()}
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
          {this.props.checkKeys.length === 0 ? null : this.checkResponse()}
          {this.state.home ? <Redirect to="/" /> : null}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
