import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { dis: "", loc: null };
  componentWillMount() { }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.props);
        this.props.emartCard({ custid: this.props.data[0].info.customerInfo.id, cardno: values.cardno, pincode: values.password }).then((res) => {
          console.log(res);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <div className="row row10">
          <div className="col-xl-6" style={{ marginBottom: "-9px" }}>
            <div className="form-group">
              <Form.Item>
                {getFieldDecorator("cardno", {
                  rules: [
                    {
                      required: true,
                      message: "Картын дугаар оруулна уу! ",
                    },
                  ],
                })(<Input placeholder="Картын дугаар" />)}
              </Form.Item>
            </div>{" "}
          </div>

          <div className="col-xl-6" style={{ marginBottom: "-9px" }}>
            <div className="form-group">
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Нууц үгээ оруулна уу! ",
                    },
                  ],
                })(<Input.Password placeholder="Нууц үг" />)}
              </Form.Item>
            </div>{" "}
          </div>

          <div className="col-xl-12">
            <div className="text-right">
              <button
                className="btn btn-dark marginBottom"
                style={{ width: "108.28px" }}
                onClick={this.handleSubmit}
              >
                <span className="text-uppercase">Холбох</span>
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create({ name: "component" })(Component);
