/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col } from "antd";
import { Link, Redirect } from "react-router-dom";
import LatinInput from "../../Input/LatinInput";
import { FacebookLogin, GoogleLogin } from "../";

class LoginModal extends React.Component {
  state = {
    visible: false,
    isVisibleReset: false,
    isRemember: false,
    direct: false,
    confirm: false,
    goCart: false,
    cartDirect: false,
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  handleLoginModal = () => {
    this.props.form.resetFields();
    this.setState({ visible: !this.state.visible });
  };

  handleRegistrationModal = () => {
    this.handleLoginModal();
    this.props.RegistrationModal.handleSignup();
  };

  handleForgetModal = () => {
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
  }

  handleResetVisible = () => {
    console.log(this.props);
    console.log("handleResetVisible");
    this.setState({ visible: false });
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
    /* this.props.ForgetModal.handleForgetModal(); */
  }

  goHome() {
    return this.state.confirm ? <Redirect to="/" /> : this.state.goCart ? <Redirect to="/cart" /> : null;
  }

  handleSubmitForget = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // eslint-disable-next-line consistent-return
        this.props.reset({ mail: values.email }).then((res) => {
          if (!res.payload.success) {
            return message.warning(intl.formatMessage({ id: res.payload.code }));
          }

          message.success(intl.formatMessage({ id: res.payload.code }));
          this.props.form.resetFields();
          this.handleForgetModal();
        });
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.match.url.slice(0, 8) === "/confirm") {
      this.setState({ direct: true });
    }
    const { intl } = this.props;
    // eslint-disable-next-line consistent-return
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          let result = await this.props.login({ body: { ...values } });
          if (result.payload.success) {
            message.success(intl.formatMessage({ id: "loginModal.info.success" }));
          } else {
            if (result.payload.code) {
              message.warning(intl.formatMessage({ id: result.payload.code }));
            }
            return null;
          }
          localStorage.setItem('img', result.payload.data[0].info.customerInfo.imgnm);
          localStorage.setItem('auth', JSON.stringify(result.payload));
          localStorage.setItem('username', this.state.isRemember ? values.email : null);
          localStorage.setItem('percent', result.payload.data[0].info.customerInfo.cstatus);
          localStorage.setItem('next', JSON.stringify(result.payload.data[0].info.customerInfo));
          this.props.getCustomer().then(async (res) => {
            if (res.payload.success) {
              localStorage.setItem('next', JSON.stringify(res.payload.data.info));
              localStorage.removeItem(this.state.isRemember ? null : 'username');
              let products = [];
              if (this.props.cart === undefined) {
                products = this.props.products;
              } else {
                products = this.props.cart.products;
              }
              if (products !== undefined) {
                products = products.map(prod => ({
                  skucd: prod.skucd,
                  qty: prod.qty,
                }));
              }

              let result = await this.props.increaseProductsByQtyRemotely({
                iscart: 0,
                body: products,
              });

              if (result !== undefined) {
                if (!result.payload.success) {
                  message.warning(intl.formatMessage({ id: result.payload.code }));
                }
              }

              if (products !== undefined) {
                this.props.getProducts().then((res) => {
                  let k = res.payload.data.length - products.length;
                  if (res.payload.data.length !== 0 && k !== 0) {
                    this.setState({ goCart: true });
                    this.props.form.resetFields();
                  } else {
                    this.props.form.resetFields();
                  }
                });
              }
            } else {
              console.log(res.payload);
            }
          });
        } catch (e) {
          console.log(e);
        }
        this.setState({ confirm: this.state.direct });
        this.handleLoginModal();
      }
    });
  };

  onRemember = (e) => {
    this.setState({ isRemember: e.target.checked });
  };

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isRemember } = this.state;
    return (
      <div>
        <Modal
          title={intl.formatMessage({ id: "loginModal.title" })}
          visible={this.state.visible}
          onCancel={this.handleLoginModal}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("email", {
                initialValue: localStorage.getItem('username') === null ? null : localStorage.getItem('username'),
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
              {getFieldDecorator("password", {
                rules: [
                  { validator: this.validateToNextPassword },
                ],
              })(
                <Input type="password" placeholder={intl.formatMessage({ id: "shared.form.password.placeholder" })} className="form-control" autoComplete="new-password" />,
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="btn btn-block btn-login text-uppercase"
              >
                <FormattedMessage id="shared.form.button.login" />
              </Button>
            </Form.Item>
            <Form.Item>
              <Col span={12}>
                <Checkbox
                  className="btn color-new-grey"
                  onChange={this.onRemember}
                  checked={isRemember}
                >
                  <FormattedMessage id="shared.form.label.rememberMe" />
                </Checkbox>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Link
                  to=""
                  className="btn btn-link color-new-grey"
                  style={{ fontSize: "14px" }}
                  onClick={this.handleResetVisible}
                >
                  <FormattedMessage id="shared.form.label.forgotPassword" />
                </Link>
              </Col>
            </Form.Item>
          </Form>

          <FacebookLogin {...this.props} />
          <GoogleLogin {...this.props} />

          {this.props.RegistrationModal ?
            <div className="text-center">
              <p className="color-new-grey upper-first">
                <FormattedMessage
                  id="loginModal.linkToRegistration"
                  defaultMessage="Та шинээр бүртгүүлэх бол {link} бүртгүүлнэ үү"
                  values={{
                    link: (
                      <Link
                        to="#"
                        className="btn btn-link"
                        onClick={this.handleRegistrationModal}
                      >
                        <strong>
                          <FormattedMessage
                            id="loginModal.linkToRegistration.link"
                            defaultMessage="ЭНД ДАРЖ"
                          />
                        </strong>
                      </Link>
                    ),
                  }}
                />
              </p>
            </div> : null
          }
          {this.goHome()}
        </Modal>
        <Modal
          title={intl.formatMessage({ id: "forgottenPasswordModal.title" })}
          visible={this.state.isVisibleReset}
          onCancel={this.handleForgetModal}
          footer={null}
        >
          <Form onSubmit={this.handleSubmitForget} className="login-form">
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
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "normal_login" })(LoginModal));
