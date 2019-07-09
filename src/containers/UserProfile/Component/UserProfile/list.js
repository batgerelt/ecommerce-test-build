import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider } from "antd";
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
        <div className="row row10">
          <div className="col-xl-6" style={{ marginBottom: "-9px" }}>
            <Input
              value={userInfo.card.cardno}
              disabled
              style={{ backgroundColor: "rgb(235, 235, 228)" }}
            />
          </div>

          <div className="col-xl-6" style={{ marginBottom: "-9px" }}>
            <Input
              type="password"
              placeholder="*****"
              disabled
              style={{ backgroundColor: "rgb(235, 235, 228)" }}
            />
          </div>
        </div>
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
        <Form>
          <div className="row row10">
            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("lastname", {
                    initialValue: userInfo.info.lastname,
                    rules: [{ required: true, message: "Овгоо заавал оруулна уу! " }],
                  })(<Input placeholder="Овог" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("firstname", {
                    initialValue: userInfo.info.firstname,
                    rules: [{ required: true, message: "Нэрээ заавал оруулна уу! " }],
                  })(<Input placeholder="Нэр" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("email", {
                    initialValue: userInfo.info.email,
                    rules: [
                      {
                        required: true,
                        type: "email",
                        message: "Зөв имэйл оруулна уу! ",
                      },
                    ],
                  })(<Input placeholder="Имэйл" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("phone1", {
                    initialValue: userInfo.info.phone1,
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp("^[0-9]*$"),
                        len: 8,
                        message: "Утсаа заавал оруулна уу! ",
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
                    initialValue: userInfo.info.phone2,
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        len: 8,
                        message: "Утасны дугаар 8 оронтой байх ёстой! ",
                      },
                    ],
                  })(<Input placeholder="Утас 2" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }} />

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("mainLocation", {
                    initialValue: useraddress.main.provinceid,
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
                    initialValue: useraddress.main.districtid,
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
                    initialValue: useraddress.main.locid,
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

            <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("address", {
                    initialValue: useraddress.main.address,
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

          <div className="col-xl-12">
            <div className="form-group text text-right" style={{ marginRight: "-10px" }}>
              <button
                className="btn btn-dark"
                onClick={this.handleSubmit}
              >
                <span className="text-uppercase">Хадгалах</span>
              </button>
            </div>
          </div>
          <Divider />
          <div className="row row10">
            <div className="col-md-12">
              <p>Имарт карт</p>
            </div>
          </div>
          {this.props.userInfo.card === null ? null : this.renderCard()}
          {this.props.userInfo.card === null ? <Card /> : null}
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
