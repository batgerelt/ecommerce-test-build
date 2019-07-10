import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider, Col, Button } from "antd";
import { Link } from "react-router-dom";
import Card from "./card";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { dis: "", loc: null };
  componentWillMount() { }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const param = {
          id: this.props.userInfo.info.id,
          username: this.props.userInfo.info.username,
          firstname: values.firstname,
          imgnm: this.props.userInfo.info.imgnm,
          lastname: values.lastname,
          email: values.email,
          phonE1: values.phone1,
          phonE2: values.phone2,
          locid: this.state.loc === null ? values.commiteLocation : this.state.loc,
          address: values.address,
          adrsid: this.props.useraddress.main.id,
        };
        this.props.updateMain({ body: param }).then((res) => {
          message.success(res.payload.message);
        });
      }
    });
  }

  renderLocation = (location) => {
    try {
      const loc = location;
      return loc.map((item, index) => (
        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
      ));
    } catch (error) {
      return console.log(error);
    }
  }

  renderCommit = (location) => {
    try {
      const loc = location;
      return loc.map((item, index) => (
        <Select.Option key={index} value={item.locid}>{item.name}</Select.Option>
      ));
    } catch (error) {
      return console.log(error);
    }
  }

  onchangesysloc = (e) => {
    this.props.getDistrictLocation({ id: e });
    this.props.getCommmitteLocation({ provid: e, distid: this.props.districtlocation[0].id });
    this.setState({ dis: e });
    this.setState({ loc: this.props.committelocation[0].id });
  }

  onchangesub = (e) => {
    this.props.getCommmitteLocation({ provid: this.state.dis === "" ? "11" : this.state.dis, distid: e });
    this.setState({ loc: this.props.committelocation[0].locid });
  }

  onchangesyscom = (e) => {
    this.setState({ loc: e });
  }

  renderCard = () => {
    try {
      const { userInfo } = this.props;
      return (
        <Col span={24}>
          <Form.item>
            <Input value={userInfo.card.cardno} disabled style={{ backgroundColor: "rgb(235, 235, 228)" }} />
          </Form.item>

          <Form.item>
            <Input type="password" placeholder="*****" disabled style={{ backgroundColor: "rgb(235, 235, 228)" }} />
          </Form.item>
        </Col>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderProfile = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { useraddress } = this.props;
      const { userInfo } = this.props;
      return (
        <Form className="row row10">
          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("lastname", {
                initialValue: userInfo.info.lastname,
                rules: [{ required: true, message: "Овгоо заавал оруулна уу!" }],
              })(<Input placeholder="Овог" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("firstname", {
                initialValue: userInfo.info.firstname,
                rules: [{ required: true, message: "Нэрээ заавал оруулна уу!" }],
              })(<Input placeholder="Нэр" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("email", {
                initialValue: userInfo.info.email,
                rules: [{ required: true, type: "email", message: "Зөв имэйл оруулна уу!" }],
              })(<Input placeholder="Имэйл" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone1", {
                initialValue: userInfo.info.phone1,
                rules: [{
                  required: true, pattern: new RegExp("^[0-9]*$"), len: 8, message: "Утасны дугаар 8 оронтой байх ёстой!",
                }],
              })(<Input placeholder="Утас 1" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone2", {
                initialValue: userInfo.info.phone2,
                rules: [{ pattern: new RegExp("^[0-9]*$"), len: 8, message: "Утасны дугаар 8 оронтой байх ёстой!" }],
              })(<Input placeholder="Утас 2" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }} />
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("mainLocation", {
                initialValue: useraddress.main.provinceid,
                rules: [{ required: true, message: "Хот/аймаг сонгоно уу!" }],
              })(
                <Select showSearch placeholder="Хот/аймаг *" optionFilterProp="children" onChange={this.onchangesysloc}>
                  {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("subLocation", {
                initialValue: useraddress.main.districtid,
                rules: [{ required: true, message: "Дүүрэг/Сум сонгоно уу!" }],
              })(
                <Select showSearch placeholder="Дүүрэг/Сум *" optionFilterProp="children" onChange={this.onchangesub}>
                  {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("commiteLocation", {
                initialValue: useraddress.main.locid,
                rules: [{ required: true, message: "Хороо сонгоно уу!" }],
              })(
                <Select showSearch placeholder="Хороо *" optionFilterProp="children" onChange={this.onchangesyscom}>
                  {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item style={{ width: '98.5%', marginBottom: '5px' }}>
              {getFieldDecorator("address", {
                initialValue: useraddress.main.address,
                rules: [{ required: true, message: "Гэрийн хаягаа заавал оруулна уу!" }],
              })(<Input placeholder="Гэрийн хаяг" />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item className="text text-right" style={{ width: '98.5%', marginBottom: '5px' }}>
              <Button className="btn btn-dark" htmlType="submit" onClick={this.handleSubmit} style={{ background: '#343a40' }}>
                <span className="text-uppercase">Хадгалах</span>
              </Button>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider />
          </Col>

          <Col span={24}>
            <p>Имарт карт</p>
          </Col>

          {this.props.userInfo.card === undefined ? null : this.renderCard()}
          {this.props.userInfo.card === undefined ? <Card {...this.props} /> : null}
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Профайл</span>
          </p>
          <div className="user-profile-contain">
            {this.props.userInfo === undefined ? null : this.renderProfile()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
