import React from "react";
import { Form, message, Input, Select, Divider, Col, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Card from "./card";
import SwalModals from "./SwalModals";

const MySwal = withReactContent(Swal);

class Component extends React.Component {
  state = {
    dis: "",
    loc: null,
    loader: false,
    params: [],
  };

  componentWillMount() {
    this.getdata();
  }

  getdata() {
    this.setState({ loader: true });
    const param = {
      provid: "",
      distid: "",
      commid: "",
    };
    this.props.getCustomer().then((res) => {
      if (res.payload.success) {
        localStorage.setItem('next', JSON.stringify(res.payload.data.info));
        if (res.payload.data.main) {
          param.provid = res.payload.data.main.provinceid;
          param.distid = res.payload.data.main.districtid;
          param.commid = res.payload.data.main.locid;
        }
        this.setState({ params: param });
        this.props.getSystemLocation().then((res) => {
          if (res.payload.success) {
            this.props.getDistrictLocation({ id: param.provid }).then((res) => {
              if (res.payload.success) {
                this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid });
              }
            });
          }
        });
      }
    });
    this.setState({ loader: false });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.userInfo.main === null) {
          const param = {
            custid: this.props.data[0].info.customerInfo.id,
            locid: this.state.loc === null ? values.commiteLocation : this.state.loc,
            address: values.address,
            name: values.lastname,
            phonE1: values.phone1,
            phonE2: values.phone2,
          };
          this.props.addAddress({ body: { ...param } }).then((res) => {
            if (res.payload.success) {
              message.success(res.payload.message);
              this.getdata();
            }
          });
        } else {
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
            adrsid: this.props.userInfo.main === undefined ? null : this.props.userInfo.main.id,
          };
          if (this.props.userInfo.info.email !== param.email) {
            MySwal.fire({
              html: (
                <SwalModals
                  type={"email"}
                  onRef={ref => (this.SwalModals = ref)}
                  param={param}
                  {...this}
                  {...this.props}
                />
              ),
              type: "warning",
              animation: true,
              button: false,
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              focusConfirm: false,
              allowOutsideClick: false,
              closeOnEsc: false,
            });
          } else {
            this.props.updateMain({ body: param }).then((res) => {
              if (res.payload.success) {
                message.success(res.payload.message);
                this.getdata();
              }
            });
          }
        }
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

  onMainLocation = (e) => {
    const param = {
      provid: e,
      distid: this.state.params.distid,
      commid: this.state.params.commid,
    };
    this.setState({ loader: true });
    this.props.getDistrictLocation({ id: param.provid }).then((res) => {
      if (res.payload.success) {
        param.distid = res.payload.data[0].id;
        this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
          if (res.payload.success) {
            param.commid = res.payload.data[0].locid;
            this.setState({ params: param });
            this.setState({ loader: false });
          }
        });
      }
    });
  }

  onSubLocation = (e) => {
    const param = {
      provid: this.state.params.provid,
      distid: e,
      commid: this.state.params.commid,
    };
    this.setState({ loader: true });
    this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
      if (res.payload.success) {
        param.commid = res.payload.data[0].locid;
        this.setState({ params: param });
        this.setState({ loader: false });
      }
    });
  }

  onchangesyscom = (e) => {
    this.setState({ loc: e });
  }

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

  renderCard(card) {
    return (
      <Col span={24}>
        <Col span={12}>
          <Form.Item>
            <Input value={card.cardno} disabled style={{ backgroundColor: "rgb(235, 235, 228)", width: "98%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            <Input value="0000" type="password" disabled style={{ backgroundColor: "rgb(235, 235, 228)", width: "98%" }} />
          </Form.Item>
        </Col>
      </Col>
    );
  }

  renderNoMain() {
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("mainLocation", {
              rules: [{ required: true, message: "Хот/аймаг сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Хот/аймаг *"
                optionFilterProp="children"
                onChange={this.onMainLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("subLocation", {
              rules: [{ required: true, message: "Дүүрэг/Сум сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Дүүрэг/Сум *"
                optionFilterProp="children"
                onChange={this.onSubLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("commiteLocation", {
              rules: [{ required: true, message: "Хороо сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Хороо *"
                optionFilterProp="children"
                onChange={this.onchangesyscom}
                disabled={loader}
                loading={loader}
              >
                {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Col>
    );
  }

  renderMain() {
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("mainLocation", {
              initialValue: this.checkError(this.state.params.provid),
              rules: [{ required: true, message: "Хот/аймаг сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Хот/аймаг *"
                onChange={this.onMainLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("subLocation", {
              initialValue: this.checkError(this.state.params.distid),
              rules: [{ required: true, message: "Дүүрэг/Сум сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Дүүрэг/Сум *"
                optionFilterProp="children"
                onChange={this.onSubLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("commiteLocation", {
              initialValue: this.checkError(this.state.params.commid),
              rules: [{ required: true, message: "Хороо сонгоно уу" }],
            })(
              <Select
                showSearch
                placeholder="Хороо *"
                optionFilterProp="children"
                onChange={this.onchangesyscom}
                disabled={loader}
                loading={loader}
              >
                {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Col>
    );
  }

  renderProfile = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { userInfo } = this.props;
      return (
        <div className="row row10">
          <Form>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("lastname", {
                  initialValue: userInfo.info.lastname,
                  rules: [{ required: true, message: "Овогоо оруулна уу" }],
                })(<Input placeholder="Овог" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("firstname", {
                  initialValue: userInfo.info.firstname,
                  rules: [{ required: true, message: "Нэрээ оруулна уу" }],
                })(<Input placeholder="Нэр" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("email", {
                  initialValue: userInfo.info.email,
                  rules: [{ required: true, type: "email", message: "Зөв имэйл оруулна уу" }],
                })(<Input placeholder="Имэйл" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("phone1", {
                  initialValue: userInfo.info.phone1,
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp("^[0-9]*$"),
                      message: "Утасны дугаар 8 оронтой байх ёстой",
                    },
                    {
                      min: 8,
                      message: "Утасны дугаар 8 оронтой байна",
                    },
                  ],
                })(<Input placeholder="Утас 1" maxLength={8} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("phone2", {
                  initialValue: userInfo.info.phone2,
                  rules: [
                    { pattern: new RegExp("^[0-9]*$"), min: 8, message: "Утасны дугаар 8 оронтой байх ёстой" },
                    { min: 8, message: "Утасны дугаар 8 оронтой байна" },
                  ],
                })(<Input placeholder="Утас 2" maxLength={8} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item style={{ width: '96%' }} />
            </Col>

            {userInfo.main === null ? this.renderNoMain() : this.renderMain()}

            <Col span={24}>
              <Form.Item style={{ width: '98.5%' }}>
                {getFieldDecorator("address", {
                  initialValue: userInfo.main === null ? null : userInfo.main.address,
                  rules: [{ required: true, message: "Гэрийн хаягаа оруулна уу" }],
                })(<Input placeholder="Гэрийн хаяг" />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item className="text text-right" style={{ width: '98.5%' }}>
                <Button className="btn btn-dark" htmlType="submit" onClick={this.handleSubmit} style={{ background: '#343a40' }}>
                  <span className="text-uppercase">Хадгалах</span>
                </Button>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider />
            </Col>

          </Form>

          <Col span={24}>
            <p>Имарт карт</p>
          </Col>

          {userInfo.card === undefined ? <Card emartCard={this.props.emartCard} getCustomer={this.props.getCustomer} /> : this.renderCard(userInfo.card)}
        </div>
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
