import React from "react";
import { Form, message, Input, Select, Table, Divider, Col, Button } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {
    dis: "",
    loc: null,
    selectLoading: false,
    distid: "",
    provid: "",
    chosenAddress: {},
    systemlocation: [],
    districtlocation: [],
    address: [],
  };

  componentWillMount() {
    const param = {
      provid: "11",
      distid: "01",
      commid: "01",
    };
    this.props.getSystemLocation().then((res) => {
      if (res.payload.success) {
        this.setState({ systemlocation: res.payload.data });
        this.props.getDistrictLocation({ id: param.provid }).then((res) => {
          if (res.payload.success) {
            this.setState({ districtlocation: res.payload.data });
            this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
              if (res.payload.success) {
                this.setState({ committelocation: res.payload.data, loc: res.payload.data[0].locid, address: param });
              }
            });
          }
        });
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const param = {
          custid: this.props.data[0].info.customerInfo.id,
          locid: this.state.loc === null ? values.commiteLocation : this.state.loc,
          address: values.homeaddress,
          name: values.name,
          phonE1: values.phone1,
          phonE2: values.phone2,
        };
        this.props.addAddress({ body: { ...param } }).then((res) => {
          if (res.payload.success) {
            message.success(res.payload.message);
            this.props.getUserInfo({ custid: this.state.id });
          }
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
    const param = {
      provid: e,
      distid: "01",
      commid: "01",
    };
    this.setState({ selectLoading: true });
    this.props.getDistrictLocation({ id: e }).then((res) => {
      if (res.payload.success) {
        console.log(res.payload.data);
        param.distid = res.payload.data[0].id;
        this.setState({ districtlocation: res.payload.data });
        this.props.getCommmitteLocation({ provid: e, distid: res.payload.data[0].id }).then((res) => {
          if (res.payload.success) {
            param.distid = res.payload.data[0].id;
            this.setState({
              committelocation: res.payload.data,
              loc: res.payload.data[0].locid,
              selectLoading: false,
              address: param,
            });
          }
        });
      }
    });
  }

  onchangesub = (e) => {
    const param = {
      provid: this.state.address.provid,
      distid: e,
      commid: "01",
    };
    this.setState({ selectLoading: true });
    this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
      if (res.payload.success) {
        console.log(res.payload);
        this.setState({
          committelocation: res.payload.data,
          loc: res.payload.data[0].locid,
          selectLoading: false,
          address: param,
        });
      }
    });
  }

  onchangesyscom = (e) => {
    this.setState({ loc: e });
  }

  onDelete = (e, item) => {
    this.props.deleteAddress({ id: item.id, custid: this.props.data[0].info.customerInfo.id }).then((res) => {
      if (res.payload.success) {
        this.props.getUserInfo({ custid: this.props.data[0].info.customerInfo.id }).then((response) => {
          console.log(response.payload.success);
        });
      }
    });
  }

  renderDeliveryAddress = () => {
    try {
      const { useraddress } = this.props;
      return useraddress.addrs.map((item, index) => (
        <tr key={index} style={{ width: "100%", padding: "70px" }}>
          <td style={{ width: "5%" }}>{item.name}</td>
          <td style={{ width: "5%" }}>{item.phone1}</td>
          <td style={{ width: "15%" }}>{item.provincenm}</td>
          <td style={{ width: "10%" }}>{item.districtnm}</td>
          <td style={{ width: "10%" }}>{item.address}</td>
          <td style={{ width: "5%" }} onClick={e => this.onDelete(e, item)}>
            <Link to="#">
              <i
                className="fa fa-times"
                aria-hidden="true"
                style={{ color: "black" }}
              />
            </Link>
          </td>
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  }
  renderAddress = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const {
        systemlocation,
        districtlocation,
        committelocation,
        selectLoading,
        address,
      } = this.state;
      return (
        <Form className="row row10" onSubmit={this.handleSubmit}>
          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Нэрээ заавал оруулна уу" }],
              })(<Input placeholder="Нэр" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone1", {
                rules: [{ required: true, message: "Утсаа заавал оруулна уу! " },
                { pattern: new RegExp("^[0-9]*$"), message: "Утсаа зөв оруулна уу! " },
                { len: 8, message: "Утасны дугаар 8 оронтой байх ёстой! " }],
              })(<Input placeholder="Утас 1" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone2", {
                rules: [{ pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу! " },
                { len: 8, message: "Утасны дугаар 8 оронтой байх ёстой! " }],
              })(<Input placeholder="Утас 2" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("mainLocation", {
                initialValue: address.length === 0 ? null : address.provid,
                rules: [{ required: true, message: "Хот/аймаг сонгоно уу!" }],
              })(
                <Select
                  showSearch
                  placeholder="Хот/аймаг *"
                  onChange={this.onchangesysloc}
                  disabled={selectLoading}
                  loading={selectLoading}
                >
                  {systemlocation.length === 0 ? null : this.renderLocation(systemlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("subLocation", {
                initialValue: address.length === 0 ? null : address.distid,
                rules: [{ required: true, message: "Сум/дүүрэг сонгоно уу!" }],
              })(
                <Select
                  showSearch
                  placeholder="Дүүрэг/Сум *"
                  onChange={this.onchangesub}
                  disabled={selectLoading}
                  loading={selectLoading}
                >
                  {districtlocation.length === 0 ? null : this.renderLocation(districtlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("commiteLocation", {
                initialValue: address.length === 0 ? null : address.commid,
                rules: [{ required: true, message: "Хороо сонгоно уу!" }],
              })(
                <Select
                  placeholder="Хороо *"
                  showSearch
                  optionFilterProp="children"
                  onChange={this.onchangesyscom}
                  disabled={selectLoading}
                  loading={selectLoading}
                >
                  {committelocation === undefined ? null : this.renderLocation(committelocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item style={{ width: '98.5%', marginBottom: '5px' }}>
              {getFieldDecorator("homeaddress", {
                rules: [{ required: true, message: "Гэрийн хаягаа заавал оруулна уу!" }],
              })(<Input placeholder="Гэрийн хаяг" />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item className="text-right" style={{ width: '98.5%', marginBottom: '5px' }}>
              <Button className="btn btn-dark" htmlType="submit" style={{ background: '#343a40' }}>
                <span className="text-uppercase">Хадгалах</span>
              </Button>
            </Form.Item>
          </Col>
          <Col span={24} className="delivery-address" style={{ width: '98.5%', marginBottom: '5px' }}>
            <p className="title">
              <span>Бүртгэлтэй хаягууд</span>
            </p>
            <table style={{ width: "100%" }} className="table bordered">
              <div
                className="frame frameMargin"
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  minHeight: "auto",
                }}
              >
                {/* {this.props.useraddress.addrs === undefined ? null : this.renderDeliveryAddress()} */}
              </div>
            </table>
          </Col>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    console.log(this.state.address);
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Хүргэлтийн хаяг</span>
          </p>
          <div className="user-profile-contain">
            {/* this.props.useraddress === undefined ? null :  */this.renderAddress()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
