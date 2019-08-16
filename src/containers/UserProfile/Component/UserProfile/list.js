import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, message, Input, Select, Divider, Col, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Card from "./card";
import SwalModals from "./SwalModals";
import LetterInput from "../../../../components/Input/LetterInput";
import NumberInput from "../../../../components/Input/NumberInput";
import LatinInput from "../../../../components/Input/LatinInput";

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
    const { intl } = this.props;
    // eslint-disable-next-line consistent-return
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
            return MySwal.fire({
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
            // eslint-disable-next-line no-else-return
          } else {
            this.props.updateMain({ body: param }).then((res) => {
              if (res.payload.success) {
                this.getdata();
              }
            });
          }
        }
        message.warning(intl.formatMessage({ id: "shared.form.info.savedSuccessfully" }));
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
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item>
            <Input value={card.cardno} disabled style={{ backgroundColor: "rgb(235, 235, 228)", width: "98%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item>
            <Input value="0000" type="password" disabled style={{ backgroundColor: "rgb(235, 235, 228)", width: "98%" }} />
          </Form.Item>
        </Col>
      </Col>
    );
  }

  renderNoMain() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("mainLocation", {
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })}
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

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("subLocation", {
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

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item style={{ width: '96%' }}>
            {getFieldDecorator("commiteLocation", {
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
      </Col>
    );
  }

  renderMain() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    return (
      <Col span={24}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item style={{ width: '96%' }}>
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
          <Form.Item style={{ width: '96%' }}>
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
          <Form.Item style={{ width: '96%' }}>
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
      </Col>
    );
  }
  renderProfile = () => {
    try {
      const { intl } = this.props;
      const { getFieldDecorator } = this.props.form;
      const { userInfo } = this.props;
      return (
        <div className="row row10">
          <Form>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("lastname", {
                  initialValue: userInfo.info.lastname,
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.lastname.validation.required" }) }],
                })(<LetterInput placeholder={intl.formatMessage({ id: "shared.form.lastname.placeholder" })} onChange={value => (this.props.form.setFieldsValue({ lastname: value }))} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("firstname", {
                  initialValue: userInfo.info.firstname,
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.firstname.validation.required" }) }],
                })(<LetterInput placeholder={intl.formatMessage({ id: "shared.form.firstname.placeholder" })} onChange={value => (this.props.form.setFieldsValue({ firstname: value }))} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("email", {
                  initialValue: userInfo.info.email,
                  rules: [{ required: true, type: "email", message: intl.formatMessage({ id: "shared.form.email.validation.required" }) }],
                })(<LatinInput placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("phone1", {
                  initialValue: userInfo.info.phone1,
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp("^[0-9]*$"),
                      message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }),
                    },
                    {
                      min: 8,
                      message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }),
                    },
                  ],
                })(<NumberInput placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} maxLength={8} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }}>
                {getFieldDecorator("phone2", {
                  initialValue: userInfo.info.phone2,
                  rules: [
                    { pattern: new RegExp("^[0-9]*$"), min: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                    { min: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) },
                  ],
                })(<NumberInput placeholder={intl.formatMessage({ id: "shared.form.phone2.placeholder" })} maxLength={8} autoComplete="off" />)}
              </Form.Item>
            </Col>

            <Col xs={0} sm={0} md={8} lg={8} xl={8}>
              <Form.Item style={{ width: '96%' }} />
            </Col>

            {userInfo.main === null ? this.renderNoMain() : this.renderMain()}

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item style={{ width: '98.5%' }}>
                {getFieldDecorator("address", {
                  initialValue: userInfo.main === null ? null : userInfo.main.address,
                  rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
                })(<Input placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item className="text text-right" style={{ width: '98.5%' }}>
                <Button className="btn btn-dark" htmlType="submit" onClick={this.handleSubmit} style={{ background: '#343a40' }}>
                  <span className="text-uppercase"><FormattedMessage id="shared.form.button.save" /></span>
                </Button>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider />
            </Col>

          </Form>

          <Col span={24}>
            <p><FormattedMessage id="profile.userProfile.form.label.emart" /></p>
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
      <div className="user-menu-content" style={{ margin: "0px !important" }}>
        <p className="title">
          <span><FormattedMessage id="profile.userProfile.form.title" /></span>
        </p>
        <div className="user-profile-contain">
          {this.props.userInfo === undefined ? null : this.renderProfile()}
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));
