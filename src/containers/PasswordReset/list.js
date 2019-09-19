import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Divider, Rate, message, Form, Input, Row, Col, Button } from "antd";
import { Redirect, withRouter } from 'react-router-dom';

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { home: false };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { intl, history } = this.props;
        this.props.changePassword({
          key: this.props.match.params.key,
          password: values.password,
        }).then((res) => {
          if (!res.payload.success) {
            return message.warning(intl.formatMessage({ id: res.payload.code }));
          }
          message.success(intl.formatMessage({ id: res.payload.code }));
          return history.push('/');
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
        <Row span={24}>
          <Col xs={0} sm={0} md={0} lg={9} xl={9} />
          <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: "center" }}>
            <div className="content">
              <Form onSubmit={this.handleSubmit} className="login-form" style={{ marginTop: "100px", marginBottom: "100px" }}>
                <div className="text-center">
                  <h4 className="title" style={{ fontSize: "20px", color: "#000000" }}>
                    <span className="text-uppercase"><FormattedMessage id="restorePassword.title" /></span>
                  </h4>
                  <p><FormattedMessage id="restorePassword.subtitle" /></p>
                </div>
                <Form.Item hasFeedback style={{ textAlign: "left" }}>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: "shared.form.newPassword.validation.required",
                        }),
                      },
                      { validator: this.validateToNextPassword },
                    ],
                  })(
                    <Input.Password
                      className="form-control"
                      autoComplete="new-password"
                      placeholder={intl.formatMessage({
                        id: "shared.form.newPassword.placeholder",
                      })}
                    />,
                  )}
                </Form.Item>
                <Form.Item hasFeedback style={{ textAlign: "left" }}>
                  {getFieldDecorator("confirm", {
                    rules: [
                      { required: true, message: intl.formatMessage({ id: "shared.form.newPasswordAgain.validation.required" }) },
                      { validator: this.compareToFirstPassword },
                    ],
                  })(
                    <Input.Password
                      onBlur={this.handleConfirmBlur}
                      className="form-control"
                      placeholder={intl.formatMessage({
                        id: "shared.form.newPasswordAgain.placeholder",
                      })}
                    />,
                  )}
                </Form.Item>
                <Button
                  type="submit"
                  className="btn btn-reverse"
                  style={{ width: "100%", backgroundColor: "#FFB81C" }}
                >
                  <span className="text-uppercase" style={{ color: "#000000" }}>
                    <FormattedMessage id="shared.form.button.save" />
                  </span>
                </Button>
              </Form>
            </div>
          </Col>
          <Col xs={0} sm={0} md={0} lg={9} xl={9} />
        </Row>

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
      <div className="user-menu-content">
        <div className="section" style={{ textAlign: "center" }}>
          {this.props.checkKeys.length === 0 ? null : this.checkResponse()}
          {this.state.home ? <Redirect to="/" /> : null}
        </div>
      </div>
    );
  }
}

export default withRouter(injectIntl(Form.create({ name: "component" })(Component)));
