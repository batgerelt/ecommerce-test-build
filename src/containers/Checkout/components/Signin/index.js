/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button, message } from "antd";
import { Link } from "react-router-dom";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultActiveKey: 1,
    };
  }

  onSubmitLogin = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.login({ body: { ...values } }).then(async (r) => {
          if (r.payload.success) {
            const realImage = JSON.stringify(process.env.IMAGES + r.payload.data[0].info.customerInfo.imgnm);
            localStorage.setItem('img', realImage);
            localStorage.setItem('auth', JSON.stringify(r.payload));
            localStorage.setItem('percent', r.payload.data[0].info.customerInfo.cstatus);
            // eslint-disable-next-line consistent-return
            this.props.getUserInfo().then(async (res) => {
              if (res.payload.success) {
                if (res.payload.data.main !== null) {
                  this.props.getDistrictLocation({ id: res.payload.data.main.provinceid });
                  this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
                }
                let { products } = this.props;
                products = products.map(prod => ({
                  skucd: prod.cd,
                  qty: prod.qty,
                }));
                let result = await this.props.increaseProductsByQtyRemotely({
                  iscart: 0,
                  body: products,
                });
                if (!result.payload.success) {
                  return message.error(result.payload.message);
                }
                this.props.getProducts();
                this.props.history.push("/cart");
                // this.props.callback("2");
              }
            });
            this.props.getSystemLocation({});
          }
          this.setState({ loading: false });
        });
      }
    });
  };

  handleResetPassword = (e) => {
    e.preventDefault();
    this.props.LoginModal.handleResetVisible();
  }


  renderLoginForm = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.onSubmitLogin}>
          <div className="row row10">
            <div className="offset-md-3 col-md-6 pad10">
              <Form.Item style={{ marginBottom: "10px" }}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Имэйл уу ?",
                    },
                  ],
                })(
                  <Input
                    type="text"
                    placeholder="Имэйл*"
                    autoComplete="off"
                    className="form-control"
                  />,
                )}
              </Form.Item>
              <Form.Item hasFeedback style={{ marginBottom: "10px" }}>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Нууц үг оруулна уу ?",
                    },
                  ],
                })(
                  <Input.Password
                    placeholder="Нууц үг*"
                    autoComplete="off"
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
                Нэвтрэх
              </Button>
              <label className="checkout-hover" style={{ float: "right" }}>
                <Link
                  to=""
                  className="btn btn-link"
                  style={{ fontSize: "14px" }}
                  onClick={this.handleResetPassword}
                >
                  Нууц үгээ мартсан
                </Link>
              </label>
              <button
                type="submit"
                className="btn btn-social btn-facebook"
                style={{ width: "100%", marginTop: "10px" }}
              >
                <span>Facebook-р нэвтрэх</span>
              </button>
              <button
                type="submit"
                className="btn btn-social btn-gmail"
                style={{ width: "100%" }}
              >
                <span>Gmail-р нэвтрэх</span>
              </button>
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

export default Form.create({ name: "checkoutlogin" })(Signin);
