/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message } from "antd";
import { Link } from "react-router-dom";
import { FacebookLogin, GoogleLogin } from "../../../../components/Login/";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultActiveKey: 1,
    };
  }

  loginSocial = (param) => {
    this.props.ouathLog({ body: { ...param } }).then(async (res) => {
      console.log("result", res);
      this.loggedData(res);
      if (res.payload.success) {
        this.setState({ confirm: this.state.direct });
        await this.props.getUserInfo();
        await this.props.getSystemLocation();
      }
    });
  }

  // eslint-disable-next-line consistent-return
  loggedData = (r) => {
    const { intl } = this.props;
    if (r.payload.success) {
      message.success(intl.formatMessage({ id: "loginModal.info.success" }));
    } else {
      if (r.payload.code) {
        message.warning(intl.formatMessage({ id: r.payload.code }));
      }
      return null;
    }
    localStorage.setItem('img', r.payload.data[0].info.customerInfo.imgnm);
    localStorage.setItem('auth', JSON.stringify(r.payload));
    localStorage.setItem('percent', r.payload.data[0].info.customerInfo.cstatus);
    localStorage.setItem('next', JSON.stringify(r.payload.data[0].info.customerInfo));
    // eslint-disable-next-line consistent-return
    this.props.getUserInfo().then(async (res) => {
      if (res.payload.success) {
        if (res.payload.data.main !== null) {
          this.props.getDistrictLocation({ id: res.payload.data.main.provinceid });
          this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
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
          message.warning(intl.formatMessage({ id: result.payload.code }));
        }
        this.props.getProducts().then((res) => {
          let k = res.payload.data.length - products.length;
          if (res.payload.data.length !== 0 && k !== 0) {
            this.props.history.push("/cart");
          } else {
            this.props.callback("2");
          }
        });
      } else {
        console.log(res.payload);
      }
    }).catch((err) => {
      console.log('err: ', err);
      // message.warning(intl.formatMessage({ id: result.payload.code }));
    });
    this.props.getSystemLocation({});
  }

  onSubmitLogin = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result = await this.props.login({ body: { ...values } });
        this.loggedData(result);
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
        <Form onSubmit={this.onSubmitLogin}>
          <div className="row row10">
            <div className="offset-md-3 col-md-6 pad10">
              <Form.Item style={{ marginBottom: "10px" }}>
                {getFieldDecorator("email", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                      type: "email",
                    },
                  ],
                })(
                  <Input
                    type="text"
                    placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                    autoComplete="off"
                    className="form-control"
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
                size={"large"}
                htmlType="submit"
              >
                <FormattedMessage id="shared.form.button.login" />
              </Button>
              <label className="checkout-hover" style={{ float: "right" }}>
                <Link
                  to=""
                  className="btn btn-link upper-first forgot-password"
                  onClick={this.handleResetPassword}
                >
                  <FormattedMessage id="shared.form.label.forgotPassword" />
                </Link>
              </label>
              <div style={{ marginTop: "10px" }}>
                <FacebookLogin {...this.prosps} {...this} />
                <GoogleLogin {...this.props} {...this} />
              </div>
            </div>
          </div>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderLoginForm();
  }
}

export default injectIntl(Form.create({ name: "checkoutlogin" })(Signin));
