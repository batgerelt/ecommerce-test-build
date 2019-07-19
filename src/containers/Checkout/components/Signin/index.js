/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button } from "antd";

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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login({ body: { ...values } }).then((r) => {
          if (r.payload.success) {
            localStorage.setItem('auth', JSON.stringify(r.payload));
            this.props.getUserInfo({ id: r.payload.data[0].info.customerInfo.id }).then((res) => {
              if (res.payload.success) {
                if (res.payload.data.main !== null) {
                  this.props.getDistrictLocation({ id: res.payload.data.main.provinceid });
                  this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
                }
                this.props.callback("2");
              }
            });
            this.props.getSystemLocation({});
          }
          this.setState({ loading: false });
        });
      }
    });
  };


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
              <label style={{ float: "right" }}>
                <a>Нууц үгээ мартсан</a>
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
