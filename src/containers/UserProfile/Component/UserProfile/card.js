import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider, Col, Button } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { dis: "", loc: null, loader: false };
  componentWillMount() { }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loader: true });
        this.props.emartCard({ cardno: values.cardno, pincode: values.password }).then((res) => {
          if (res.payload.success) {
            message.success(res.payload.message);
            this.props.getCustomer();
          }
          this.setState({ loader: false });
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Spin
          spinning={loader}
          tip="Түр хүлээнэ үү"
        >
          <Form>
            <Col span={12}>
              <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
                {getFieldDecorator("cardno", {
                  rules: [
                    { required: true, message: "Картын дугаараа оруулна уу" },
                  ],
                })(<Input placeholder="Картын дугаар" autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Нууц үгээ оруулна уу" },
                  ],
                })(<Input.Password placeholder="Нууц үг" autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item style={{ width: '98.5%', marginBottom: '5px' }}>
                <div className="text-right">
                  <Button className="btn btn-dark" style={{ width: "108.28px", background: '#343a40' }} onClick={this.handleSubmit}>
                    <span className="text-uppercase">Холбох</span>
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Form>
        </Spin>
      </Col>
    );
  }
}

export default Form.create({ name: "UserProfile" })(Component);
