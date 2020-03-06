import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Input, Select, Divider, Col, Button, Spin, Icon } from "antd";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import ButtonGoogle from "@material-ui/core/Button";
import LetterInput from "../../../../components/Input/LetterInput";
import NumberInput from "../../../../components/Input/NumberInput";
import { Loader, Notification } from "../../../../components";

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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.getLocation();
  }

  getLocation() {
    this.setState({ loader: true });
    const param = {
      provid: "11",
      distid: "01",
      commid: 3335,
    };
    this.props.getSystemLocationProfile().then((res) => {
      if (res.payload.success) {
        this.setState({ systemlocation: res.payload.data });
        this.props.getDistrictLocation({ id: param.provid }).then((res) => {
          if (res.payload.success) {
            this.setState({
              districtlocation: res.payload.data,
              address: param,
              loader: false,
            });
            /* this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
              console.log("55", res);
              if (res.payload.success) {
                this.setState({
                  committelocation: res.payload.data,
                  loc: res.payload.data[0].locid,
                  address: param,
                  loader: false,
                });
              }
            }); */
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
            this.props.getUserInfoProfile();
            this.props.form.resetFields();
            this.setState({ load: false });
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: false,
              },
              content: <Notification type="success" text={intl.formatMessage({ id: "shared.form.info.savedSuccessfully" })} />,
            });
          } else {
            store.addNotification({
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 3000,
                onScreen: false,
              },
              content: <Notification type="warning" text={intl.formatMessage({ id: "shared.form.info.cannotSave" })} />,
            });
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
      this.props.getUserInfoProfile().then((res) => {
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
        <tr key={index}>
          <td>
            {
              item.ismain === 1
                ? <strong>{item.name}</strong>
                : <p>{item.name}</p>
            }
          </td>
          <td>
            {
              item.ismain === 1
                ? <strong>{item.phone1}</strong>
                : <p>{item.phone1}</p>
            }
          </td>
          <td className="column-3">
            {
              item.ismain === 1
                ? (
                  <strong>
                    {item.provincenm}, {item.districtnm}, {item.committeenm}
                  </strong>
                )
                : (
                  <p>
                    {item.provincenm}, {item.districtnm}, {item.committeenm}
                  </p>
                )
            }
          </td>
          <td className="column-4">
            {
              item.ismain === 1
                ? <strong>{item.address}</strong>
                : <p>{item.address}</p>
            }
          </td>
          {
            item.ismain !== 1
              ? (
                <td onClick={e => this.onDelete(e, item)}>
                  <Link to="#" disabled={loader}>
                    <i
                      className="fa fa-times"
                      aria-hidden="true"
                    />
                  </Link>
                </td>
              )
              : <td />
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
        <div className="row row10">
          <Form onSubmit={this.handleSubmit}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.name.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.name.validation.required" }) }],
                })(<LetterInput className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.name.placeholder" })} onChange={this.onChangeName} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.phone1.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("phone1", {
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                  { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                  { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
                })(<NumberInput className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.city.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("mainLocation", {
                  initialValue: this.checkError(this.state.params.provid),
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
                })(
                  <Select
                    showSearch
                    placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })}
                    onChange={this.onMainLocation}
                    disabled
                    loading={loader}
                  >
                    {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.district.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("subLocation", {
                  /* initialValue: this.checkError(this.state.params.distid), */
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

            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("commiteLocation", {
                  /* initialValue: this.checkError(this.state.params.commid), */
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

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.address" })}</span>
              <Form.Item>
                {getFieldDecorator("homeaddress", {
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
                })(<Input className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10" style={{ textAlign: "right" }}>
              <Col xs={12} sm={12} md={18} lg={18} xl={18} />
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Form.Item className="text">
                  <ButtonGoogle className="btn btn-dark hover-effect" disabled={load} onClick={this.handleSubmit} style={{ background: '#343a40', height: "40px", width: "100%" }}>
                    <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
                  </ButtonGoogle>
                </Form.Item>
              </Col>
            </Col>

            <Col span={24} className="delivery-address">
              <p className="title">
                <span>
                  <FormattedMessage id="profile.deliveryAddress.table.title" />
                </span>
              </p>
              <Spin
                spinning={loader}
                indicator={<Loader />}
              >
                <div className="address-table table-responsive">
                  <table>
                    <thead className="thead-light" hidden>
                      <tr>
                        <th>
                          <FormattedMessage
                            id="shared.form.name.placeholder"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="shared.form.phone1.placeholder"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="shared.form.address1.placeholder"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="shared.form.address2.placeholder"
                          />
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.props.addrs === undefined
                          ? null
                          : this.renderDeliveryAddress(this.props.addrs)
                      }
                    </tbody>
                  </table>
                </div>
              </Spin>
            </Col>
          </Form>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div className="user-menu-content">
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span><FormattedMessage id="profile.deliveryAddress.title" /></span>
        </p>
        <Divider />
        <div className="user-profile-container" >
          {this.props.useraddress === undefined ? null : this.renderAddress()}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
