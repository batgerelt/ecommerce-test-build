/* eslint-disable no-lonely-if */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import { store } from 'react-notifications-component';
import { Notification } from "../../../../components";
import LatinInput from "../../../../components/Input/LatinInput";
import { GoogleLogin } from "../../../../components/Login/";
import FacebookLogin from "./facebook";
import { AdditionQuestion } from "../../../Cart/components";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultActiveKey: 1,
      shouldRedirect: false,
    };
  }

  closeLoginModal = () => { }

  onSubmitLogin = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.login({ body: { ...values } }).then(async (r) => {
          this.setState({ loading: true });

          // амжилттай нэвтэрсэн үед
          if (r.payload.success) {
            if (r.payload.data[0].info.customerInfo.imgnm !== null) {
              let realImage = "";
              let realImage1 = r.payload.data[0].info.customerInfo.imgnm;
              if (realImage1.slice(0, 5) === "https") {
                realImage = r.payload.data[0].info.customerInfo.imgnm;
              } else {
                realImage = JSON.stringify(process.env.IMAGES + r.payload.data[0].info.customerInfo.imgnm);
              }
              localStorage.setItem('img', realImage);
            } else {
              localStorage.setItem('img', null);
            }
            localStorage.setItem('emartmall_co', r.payload.data[0].info.customerInfo.firstname);
            localStorage.setItem('auth', JSON.stringify(r.payload));
            localStorage.setItem('percent', (Number(r.payload.data[0].info.customerInfo.cstatus) + 1) * 25);
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
            // eslint-disable-next-line consistent-return
            this.props.getUserInfo().then(async (res) => {
              localStorage.setItem('emartmall_token', r.payload.data[0].info.access_token);
              if (res.payload.success) {
                if (res.payload.data.main !== null) {
                  this.props.getDistrictLocation({ id: res.payload.data.main.provinceid }).then(() => {
                    localStorage.setItem('emartmall_token', r.payload.data[0].info.access_token);
                  });
                  this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
                }
                this.props.getSystemLocation();
                let confirmResult = await this.props.confirmCartRemotely();
                if (!confirmResult.payload.success) {
                  if (confirmResult.payload.data.length > 0) {
                    let reasons = [];
                    confirmResult.payload.data.forEach(msg => (
                      reasons.push(intl.formatMessage(
                        { id: msg.code },
                        {
                          name: msg.values[1],
                          qty: msg.values[2],
                        },
                      ))
                    ));

                    if (reasons.length > 0) {
                      store.addNotification({
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                          duration: 3000,
                          onScreen: false,
                        },
                        content: <Notification
                          type="warning"
                          text={intl.formatMessagintl.formatMessage(
                            { id: confirmResult.payload.code },
                            {
                              names: reasons.join(", "),
                            },
                          )}
                        />,
                      });
                    }
                    return this.props.history.push("/cart");
                  }
                }

                let { products } = this.props;
                products = products.map(prod => ({
                  skucd: prod.skucd,
                  qty: prod.qty,
                }));

                let result = await this.props.increaseProductsByQtyRemotely({
                  iscart: 0,
                  body: products,
                });

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
                    content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
                  });
                }

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
                    this.props.history.push("/cart");
                  } else {
                    this.props.callback("2");
                  }
                });
              } else {
                console.log(res.payload);
              }

              // Админ талаас онцгой санал авах барааны мэдээллийг авах хүсэлт
              this.props.getCheckGift().then((res) => {
                res.payload.data.length !== 0 ? this.props.history.push("/cart") : null;
              });
            }).catch((err) => {
              console.log('err: ', err);
            });
          } else {
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage({ id: r.payload.code })} />,
            });
          }
          this.setState({ loading: false });
        }).catch(err => console.log(err));
      } else {
        console.log(err);
      }
    });
  };

  handleResetPassword = (e) => {
    e.preventDefault();
    this.props.LoginModal.handleResetVisible();
  }


  renderLoginForm = () => {
    try {
      const { intl } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <div className="offset-md-3 col-md-6">
          <Form onSubmit={this.onSubmitLogin} className="modal-footer-block">
            <AdditionQuestion {...this.props} redirectUrl={false} />
            <div>
              <Form.Item style={{ marginBottom: "10px" }}>
                {getFieldDecorator('email', {
                  initialValue: "",
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
                  />,
                )}
              </Form.Item>
              <Form.Item style={{ marginBottom: "10px" }}>
                {getFieldDecorator("password", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({ id: "shared.form.password.validation.required" }),
                    },
                  ],
                })(
                  <Input
                    placeholder={intl.formatMessage({ id: "shared.form.password.placeholder" })}
                    autoComplete="new-password"
                    type="password"
                    className="form-control"
                  />,
                )}
              </Form.Item>
              <Button
                className="btn btn-login text-uppercase"
                loading={this.state.loading}
                disabled={this.state.loading}
                size={"large"}
                htmlType="submit"
                onClick={this.onSubmitLogin}
              >
                <FormattedMessage id="shared.form.button.login" />
              </Button>
              <label className="checkout-hover" style={{ float: "right" }}>
                <Link
                  to="#"
                  className="btn btn-link upper-first forgot-password"
                  onClick={this.handleResetPassword}
                >
                  <FormattedMessage id="shared.form.label.forgotPassword" />
                </Link>
              </label>
            </div>
          </Form>
          <div style={{ marginTop: "10px" }}>
            <FacebookLogin {...this.props} {...this} />
            <GoogleLogin {...this.props} {...this} />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to="/cart" />;
    }

    return this.renderLoginForm();
  }
}

export default injectIntl(Form.create({ name: "checkoutlogin" })(Signin));
