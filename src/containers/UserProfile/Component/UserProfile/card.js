import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider, Col, Button } from "antd";
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
      <Col span={24}>
        <Form>
          <Col span={12}>
            <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
              {getFieldDecorator("cardno", {
              })(<Input placeholder="Картын дугаар" />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item style={{ width: '97%', marginBottom: '5px' }}>
              {getFieldDecorator("password", {
              })(<Input.Password placeholder="Нууц үг" />)}
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
      </Col>
    );
  }
}

export default Form.create({ name: "component" })(Component);
