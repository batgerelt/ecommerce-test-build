/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-multi-comp */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Input, Button, Checkbox, Icon, message, Col, notification } from "antd";
import { store } from 'react-notifications-component';
import { Link, Redirect } from "react-router-dom";
import LatinInput from "../../Input/LatinInput";
import { FacebookLogin, GoogleLogin } from "../";
import { Notification } from "../../";

class LoginModal extends React.Component {
  state = {
    visible: false,
    isVisibleReset: false,
    isRemember: false,
    direct: false,
    confirm: false,
    goCart: false,
    cartDirect: false,
    loading: false,
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleLoginModal = () => {
    this.setState({ visible: true });
  };

  closeLoginModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  handleRegistrationModal = () => {
    this.props.RegistrationModal.handleSignup();
    this.closeLoginModal();
  };

  handleForgetModal = () => {
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
    this.props.form.resetFields();
  }

  handleResetVisible = () => {
    this.setState({ visible: false });
    this.setState({ isVisibleReset: !this.state.isVisibleReset });
    this.props.form.resetFields();
  }

  goHome() {
    return this.state.confirm ? <Redirect to="/" /> : this.state.goCart ? <Redirect to="/cart" /> : null;
  }

  handleSubmitForget = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      // eslint-disable-next-line consistent-return
      this.props.reset({ mail: values.email1 }).then((res) => {
        if (!res.payload.success) {
          return store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
          });
        }
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification type="success" text={intl.formatMessage({ id: res.payload.code })} />,
        });
        this.props.form.resetFields();
        this.handleForgetModal();
      });
    });
  };

  loginSocial = (param) => {
    this.closeLoginModal();
    this.props.ouathLog({ body: { ...param } }).then(async (res) => {
      this.logData(res);
      if (res.payload.success) {
        this.setState({ confirm: this.state.direct });
        await this.props.getUserInfo();
        await this.props.getSystemLocation();
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    const { pathname } = this.props.location;
    let sku = pathname.slice(pathname.length - 13, pathname.length);
    let direct = false;
    if (this.props.match.url.slice(0, 8) === "/confirm") {
      direct = true;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        try {
          this.setState({ loading: true });
          this.props.login({ body: { ...values } }).then((result) => {
            // Amjilttai newtreh
            if (result.payload.success) {
              localStorage.setItem('emartmall_co', result.payload.data[0].info.customerInfo.firstname);
              localStorage.setItem('img', result.payload.data[0].info.customerInfo.imgnm);
              localStorage.setItem('auth', JSON.stringify(result.payload));
              localStorage.setItem('percent', result.payload.data[0].info.customerInfo.cstatus);
              if (pathname === `/productdetail/${sku}`) {
                this.props.getProductRate({ skucd: sku });
                this.props.addViewList({ skucd: sku });
              }
              this.props.getCustomer().then(async (res) => {
                if (res.payload.success) {
                  localStorage.removeItem(this.state.isRemember ? true : 'username');
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
                  this.props.increaseProductsByQtyRemotely({ iscart: 0, body: products }).then((res) => {
                    if (products !== undefined) {
                      this.props.getProducts().then((res) => {
                        let resCount = 0;
                        let prodCount = 0;
                        res.payload.data.map((item) => {
                          resCount += item.qty;
                        });
                        products.map((item) => {
                          prodCount += item.qty;
                        });
                        let k = res.payload.data.length - products.length;
                        if (resCount !== prodCount) {
                          this.setState({ goCart: true }, () => console.log("3"));
                        }
                      });
                    }
                    this.props.getUserInfo();
                    this.props.getSystemLocation();
                    this.setState(
                      { loading: false },
                      this.closeLoginModal(),
                      localStorage.setItem('emartmall_token', result.payload.data[0].info.access_token),
                      store.addNotification({
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                          duration: 3000,
                          onScreen: false,
                        },
                        content: <Notification type="success" text={intl.formatMessage({ id: "loginModal.info.success" })} />,
                      }),

                    );
                    if (res !== undefined) {
                      if (!res.payload.success) {
                        store.addNotification({
                          insert: "top",
                          container: "top-right",
                          animationIn: ["animated", "fadeIn"],
                          animationOut: ["animated", "fadeOut"],
                          dismiss: {
                            duration: 3000,
                            onScreen: false,
                          },
                          content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
                        });
                      }
                    }
                  });
                } else {
                  console.log(res.payload);
                }
              });
            }
            // newtreh oroldlogo amjiltgui
            if (result.payload.code) {
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: false,
                },
                content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
              });
              this.setState({ loading: false }, () => console.log("failed"));
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  // eslint-disable-next-line consistent-return
  logData = (result) => {
    const { intl } = this.props;
    const { pathname } = this.props.location;
    let sku = pathname.slice(pathname.length - 13, pathname.length);
    if (result.payload.success) {
      store.addNotification({
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
        content: <Notification type="success" text={intl.formatMessage({ id: "loginModal.info.success" })} />,
      });
    } else {
      if (result.payload.code) {
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
        });
      }
      return null;
    }
    // this.closeLoginModal();
    localStorage.setItem('img', result.payload.data[0].info.customerInfo.imgnm);
    localStorage.setItem('auth', JSON.stringify(result.payload));
    localStorage.setItem('percent', result.payload.data[0].info.customerInfo.cstatus);
    if (pathname === `/productdetail/${sku}`) {
      this.props.getProductRate({ skucd: sku });
      this.props.addViewList({ skucd: sku });
    }
    this.props.getCustomer().then(async (res) => {
      if (res.payload.success) {
        localStorage.removeItem(this.state.isRemember ? true : 'username');
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
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
            });
          }
        }
        this.props.form.resetFields();
        if (products !== undefined) {
          this.props.getProducts().then((res) => {
            let resCount = 0;
            let prodCount = 0;
            res.payload.data.map((item) => {
              resCount += item.qty;
            });
            products.map((item) => {
              prodCount += item.qty;
            });
            let k = res.payload.data.length - products.length;
            if (resCount !== prodCount) {
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
  }

  onRemember = (e) => {
    this.setState({ isRemember: !this.state.isRemember });
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
          onOk={this.handleLoginModal}
          onCancel={this.closeLoginModal}
          footer={null}
          centered
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('email', {
                initialValue: localStorage.getItem("username") === null ? null : localStorage.getItem("username"),
                rules: [
                  {
                    type: 'email',
                    message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                  },
                  {
                    required: true,
                    message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                  },
                ],
              })(
                <LatinInput
                  placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                  className="form-control"
                  autoComplete="off"
                  autoFocus
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({ id: "shared.form.password.validation.required" }),
                  },
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
                loading={this.state.loading}
              // disabled={this.state.loading}
              >{" "}
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
          <FacebookLogin {...this.props} {...this} />
          <GoogleLogin {...this.props} {...this} />
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
              {getFieldDecorator("email1", {
                rules: [
                  {
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

