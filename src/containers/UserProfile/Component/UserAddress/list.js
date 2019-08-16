import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, message, Input, Select, Table, Divider, Col, Button, Spin, Icon } from "antd";
import { Link } from "react-router-dom";
import LetterInput from "../../../../components/Input/LetterInput";
import NumberInput from "../../../../components/Input/NumberInput";
import LatinInput from "../../../../components/Input/LatinInput";
import { Loader } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {
    dis: "",
    loc: 3335,
    selectLoading: false,
    distid: "",
    provid: "",
    chosenAddress: {},
    systemlocation: [],
    districtlocation: [],
    address: [],
    loader: true,
    load: false,
    params: {
      provid: "11",
      distid: "01",
      commid: 3335,
    },
  };

  componentWillMount() {
    this.getLocation();
  }

  getLocation() {
    this.setState({ loader: true });
    const param = {
      provid: "11",
      distid: "01",
      commid: 3335,
    };
    this.props.getSystemLocation().then((res) => {
      if (res.payload.success) {
        this.setState({ systemlocation: res.payload.data });
        this.props.getDistrictLocation({ id: param.provid }).then((res) => {
          if (res.payload.success) {
            this.setState({ districtlocation: res.payload.data });
            this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
              if (res.payload.success) {
                this.setState({
                  committelocation: res.payload.data,
                  loc: res.payload.data[0].locid,
                  address: param,
                  loader: false,
                });
              }
            });
          }
        });
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ load: true });
        const param = {
          custid: this.props.data[0].info.customerInfo.id,
          locid: this.state.params.commid,
          address: values.homeaddress,
          name: values.name,
          phonE1: values.phone1,
          phonE2: values.phone2,
        };
        this.props.addAddress({ body: { ...param } }).then((res) => {
          if (res.payload.success) {
            this.props.getUserInfo();
            this.props.form.resetFields();
            this.setState({ load: false });
            message.warning(intl.formatMessage({ id: "shared.form.info.savedSuccessfully" }));
          } else {
            message.warning(intl.formatMessage({ id: "shared.form.info.cannotSave" }));
          }
        });
      }
    });
  }

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

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
    const param = {
      provid: this.state.params.provid,
      distid: this.state.params.distid,
      commid: e,
    };
    this.setState({ params: param });
  }

  onDelete = (e, item) => {
    this.setState({ loader: true });
    this.props.deleteAddress({ id: item.id }).then((res) => {
      this.props.getUserInfo().then((res) => {
        if (res.payload.success) {
          this.setState({ loader: false });
        }
      });
    });
  }

  renderDeliveryAddress = (addrs) => {
    const { loader } = this.state;
    try {
      const address = addrs;
      return address.map((item, index) => (
        <tr key={index} style={{ width: "100%", padding: "70px" }}>
          <td style={{ width: "5%" }}>{item.ismain === 1 ? <strong>{item.name}</strong> : <p>{item.name}</p>}</td>
          <td
            style={{
              width: "15%", overflowWrap: "break-word", wordWrap: "break-word",
            }}
          >
            {item.ismain === 1 ? <strong>{item.phone1}, {item.phone2}</strong> : <p>{item.phone1}, {item.phone2}</p>}
          </td>
          <td style={{ width: "15%" }}>{item.ismain === 1 ? <strong>{item.provincenm}</strong> : <p>{item.provincenm}</p>}</td>
          <td style={{ width: "10%" }}>{item.ismain === 1 ? <strong>{item.districtnm}</strong> : <p>{item.districtnm}</p>}</td>
          <td style={{ width: "10%" }}>{item.ismain === 1 ? <strong>{item.committeenm}</strong> : <p>{item.committeenm}</p>}</td>
          <td
            style={{
              width: "15%", overflowWrap: "break-word", wordWrap: "break-word", wordBreak: "break-all",
            }}
          >
            {item.ismain === 1 ? <strong>{item.address}</strong> : <p>{item.address}</p>}
          </td>
          {item.ismain !== 1 ?
            <td style={{ width: "5%" }} onClick={e => this.onDelete(e, item)}>
              <Link to="#" disabled={loader}>
                <i
                  className="fa fa-times"
                  aria-hidden="true"
                  style={{ color: "black" }}
                />
              </Link>
            </td>
            :
            <td style={{ width: "5%" }} />
          }
        </tr>
      ));
    } catch (error) {
      return console.log(error);
    }
  }
  onChangeName = (value) => {
    this.props.form.setFieldsValue({ name: value });
  };
  renderAddress = () => {
    try {
      const { intl } = this.props;
      const { getFieldDecorator } = this.props.form;
      const {
        loader,
        params,
        load,
      } = this.state;
      return (
        <Form className="row row10" onSubmit={this.handleSubmit}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.name.validation.required" }) }],
              })(<LetterInput placeholder={intl.formatMessage({ id: "shared.form.name.placeholder" })} onChange={this.onChangeName} />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone1", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
              })(<NumberInput placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} autoComplete="off" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("phone2", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
              })(<NumberInput placeholder={intl.formatMessage({ id: "shared.form.phone2.placeholder" })} autoComplete="off" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("mainLocation", {
                initialValue: this.checkError(this.state.params.provid),
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
              })(
                <Select
                  showSearch
                  placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })}
                  onChange={this.onMainLocation}
                  disabled={loader}
                  loading={loader}
                >
                  {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("subLocation", {
                initialValue: this.checkError(this.state.params.distid),
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
              })(
                <Select
                  showSearch
                  placeholder={intl.formatMessage({ id: "shared.form.district.placeholder" })}
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

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item style={{ width: '96%', marginBottom: '5px' }}>
              {getFieldDecorator("commiteLocation", {
                initialValue: this.checkError(this.state.params.commid),
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
              })(
                <Select
                  showSearch
                  placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}
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

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item style={{ width: '98.5%', marginBottom: '5px' }}>
              {getFieldDecorator("homeaddress", {
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
              })(<Input placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} autoComplete="off" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item className="text-right" style={{ width: '98.5%', marginBottom: '5px' }}>
              <Button className="btn btn-dark" disabled={load} htmlType="submit" style={{ background: '#343a40' }}>
                <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
              </Button>
            </Form.Item>
          </Col>
          <Col span={24} className="delivery-address" style={{ width: '98.5%', marginBottom: '5px' }}>
            <p className="title">
              <span><FormattedMessage id="profile.deliveryAddress.table.title" /></span>
            </p>
            <Spin
              spinning={loader}
              indicator={<Loader />}
            >
              <div className="cart-table table-responsive">
                <table className="table table-borderless">
                  <thead className="thead-light" hidden>
                    <tr>
                      <th className="column-1"><FormattedMessage id="shared.form.name.placeholder" /></th>
                      <th className="column-2"><FormattedMessage id="shared.form.phone1.placeholder" /></th>
                      <th className="column-3"><FormattedMessage id="shared.form.city.placeholder" /></th>
                      <th className="column-3"><FormattedMessage id="shared.form.district.placeholder" /></th>
                      <th className="column-3"><FormattedMessage id="shared.form.address.placeholder" /></th>
                      <th className="column-3"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.addrs === undefined ? null : this.renderDeliveryAddress(this.props.addrs)}
                  </tbody>
                </table>
              </div>
            </Spin>
          </Col>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div className="user-menu-content">
        <p className="title">
          <span><FormattedMessage id="profile.deliveryAddress.title" /></span>
        </p>
        <div className="user-profile-contain">
          {this.props.useraddress === undefined ? null : this.renderAddress()}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
