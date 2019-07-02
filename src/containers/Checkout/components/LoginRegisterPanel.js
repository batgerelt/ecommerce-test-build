/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { connect } from "react-redux";
import { Input, Form, Button, message, Tabs } from "antd";

// eslint-disable-next-line prefer-destructuring
const TabPane = Tabs.TabPane;

class LoginRegisterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultActiveKey: 1,
    };
  }

  changeTab = (e) => {
    this.setState({ defaultActiveKey: e });
  };

  /* agreementApprove = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.register(values);
      }
    });

    MySwal.close();
  }; */

  /*  agreementCancel = e => {
    e.preventDefault();
    MySwal.close();
  }; */

  /* openAgreement = () => {
    MySwal.fire({
      html: (
        <SwalModals
          type={"agreement"}
          agreementApprove={this.agreementApprove}
          agreementCancel={this.agreementCancel}
        />
      ),
      width: "38em",
      animation: false,
      button: false,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      showCloseButton: true,
      allowOutsideClick: false,
      closeOnEsc: false
    });
  }; */

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Tabs
        onChange={this.changeTab}
        defaultActiveKey={"1"}
        activeKey={this.state.defaultActiveKey.toString()}
        className="checkout-reg-tab"
      >
        <TabPane
          tab={
            <div className="flex-this center">
              <img
                alt="icon"
                width="40px"
                height="40px"
                src={require("../../../scss/assets/images/demo/login.svg")}
              />
              <p className="text">
                <strong>{"Нэвтрэх"}</strong>
              </p>
            </div>
          }
          key={1}
        >
          <div className="content-container">
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
                  <Form.Item style={{ marginBottom: "10px" }}>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Нууц үг уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="password"
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
          </div>
        </TabPane>
        <TabPane
          tab={
            <div className="flex-this center">
              <img
                alt="icon"
                width="40px"
                height="40px"
                src={require("../../../scss/assets/images/demo/user.svg")}
              />
              <p className="text">
                <strong>{"Бүртгүүлэх"}</strong>
              </p>
            </div>
          }
          key={2}
        >
          <div className="content-container">
            <Form onSubmit={this.onSubmit}>
              <div className="row row10">
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("firstname", {
                      rules: [
                        {
                          required: true,
                          message: "Овог оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder="Овог*"
                        className="form-control"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("lastname", {
                      rules: [
                        {
                          required: true,
                          message: "Нэр оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder="Нэр*"
                        className="form-control"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          required: true,
                          message: "И мэйл оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder="И мэйл*"
                        className="form-control"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("phone", {
                      rules: [
                        {
                          required: true,
                          message: "Утас оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder="Утас*"
                        className="form-control"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Нууц үг оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="password"
                        placeholder="Нууц үг*"
                        className="form-control"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 pad10">
                  <Form.Item>
                    {getFieldDecorator("confirmpassword", {
                      rules: [
                        {
                          required: true,
                          message: "Нууц үг оруулна уу ?",
                        },
                      ],
                    })(
                      <Input
                        type="password"
                        placeholder="Нууц үг давт*"
                        className="form-control"
                      />,
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
                  Бүртгүүлэх
                </Button>
              </div>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create({ name: "checkoutregister" })(LoginRegisterPanel);
