import React from "react";
import { Form, message, Input, Select, Table, Divider, Tag } from "antd";

import { Link } from "react-router-dom";

const { Option } = Select.Option;
const { Column, ColumnGroup } = Table;
const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {
    dis: "",
    loc: null,
    id: this.props.data[0].info.customerInfo.id,
  };

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

  onDelete = (e, item) => {
    this.props.deleteAddress({ id: item.id, custid: this.props.data[0].info.customerInfo.id }).then((res) => {
      if (res.payload.success) {
        console.log(res.payload.success);
        this.props.getUserInfo({ custid: this.props.data[0].info.customerInfo.id }).then((response) => {
          console.log(response);
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
      const { address } = this.props;
      return (
        <Form>
          <div className="row row10">
            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Нэрээ заавал оруулна уу",
                      },
                    ],
                  })(<Input placeholder="Нэр" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("phone1", {
                    rules: [
                      {
                        required: true,
                        message: "Утсаа заавал оруулна уу! ",
                      },
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        message: "Утсаа зөв оруулна уу! ",
                      },
                      {
                        len: 8,
                        message: "Утасны дугаар 8 оронтой байх ёстой! ",
                      },
                    ],
                  })(<Input placeholder="Утас 1" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("phone2", {
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        message: "Утас зөв оруулна уу! ",
                      },
                      {
                        len: 8,
                        message: "Утасны дугаар 8 оронтой байх ёстой! ",
                      },
                    ],
                  })(<Input placeholder="Утас 2" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("mainLocation", {
                    initialValue: this.props.systemlocation === undefined ? null : this.props.systemlocation[16].id,
                    rules: [{ required: true, message: "Хот/аймаг сонгоно уу!" }],
                  })(
                    <Select
                      placeholder="Хот/аймаг *"
                      showSearch
                      optionFilterProp="children"
                      className="col-md-12"
                      onChange={this.onchangesysloc}
                    >
                      {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
                    </Select>,
                  )}
                </Form.Item>
              </div>{" "}
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("subLocation", {
                    initialValue: this.props.districtlocation === undefined ? null : this.props.districtlocation[0].id,
                    rules: [
                      {
                        required: true,
                        message: "Дүүрэг/Сум сонгоно уу!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Дүүрэг/Сум *"
                      onChange={this.onchangesub}
                    >
                      {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("commiteLocation", {
                    initialValue: this.props.committelocation === undefined ? null : this.props.committelocation[0].locid,
                    rules: [
                      { required: true, message: "Хороо сонгоно уу!" },
                    ],
                  })(
                    <Select
                      placeholder="Хороо *"
                      showSearch
                      optionFilterProp="children"
                      onChange={this.onchangesyscom}
                    >
                      {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
                    </Select>,
                  )}
                </Form.Item>
              </div>{" "}
            </div>

            <div className="col-xl-12">
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("homeaddress", {
                    rules: [
                      {
                        required: true,
                        message: "Гэрийн хаягаа заавал оруулна уу!",
                      },
                    ],
                  })(<Input placeholder="Гэрийн хаяг" />)}
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button className="btn btn-dark" onClick={this.handleSubmit}>
              <span className="text-uppercase">Хадгалах</span>
            </button>
          </div>

          <div className="delivery-address">
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
                {this.props.useraddress.addrs === undefined ? null : this.renderDeliveryAddress()}
              </div>
            </table>
          </div>
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
            <span>Хүргэлтийн хаяг</span>
          </p>
          <div className="user-profile-contain">
            {this.props.useraddress === undefined ? null : this.renderAddress()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
