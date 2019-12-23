/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-extra-semi */
/* eslint-disable use-isnan */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable eol-last */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/newline-after-import */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Form, Select, DatePicker, message, Radio, notification, Col, Button } from "antd";
import { store } from 'react-notifications-component';
import moment from "moment";
import { Notification } from "../../../../components";
import LetterInput from "../../../../components/Input/LetterInput";
const Option = Select.Option;
const RadioGroup = Radio.Group;

class DeliveryPanel extends React.Component {
  state = {
    defaultActiveKey: 3,
    districtLocation: [],
    committeLocation: [],
    selectLoading: false,
    noAddress: false,
    inzone: 0,
    zoneSetting: null,
    dateLoading: false,
    requiredField: true,
  };

  componentWillMount() {
    try {
      const { main, info } = this.props.userinfo;
      const { deliveryTypes } = this.props;
      let found = deliveryTypes.find(item => item.isenable === 1);
      this.setState({ defaultActiveKey: found.id });
      this.props.changeDeliveryTab(found);
      this.props.setDeliveryPanelForm(this.props.form);
      if (main !== null) {
        this.props.changeChosenAddress(main);
        this.setState({ inzone: main.inzone });
        this.getZoneSetting(main);
        this.getDistrict(main.provinceid, false);
        this.getCommitte(main.provinceid, main.districtid, false);
      } else {
        this.props.changeAddressType("new");
        this.setState({ noAddress: true });
        this.getDistrictAndCommitte(0);
      }
    } catch (error) {
      return console.log(error);
    }
  }

  getDistrict = (id, type) => {
    this.setState({ selectLoading: true });
    this.props.getDistrictLocation({ id }).then((res) => {
      if (res.payload.success) {
        this.setState({ districtLocation: res.payload.data });
        if (type) {
          const { chosenAddress } = this.props.mainState;
          chosenAddress.districtid = res.payload.data[0].id;
          chosenAddress.districtnm = res.payload.data[0].name;
          this.getCommitte(id, res.payload.data[0].id, true);
          this.props.changeChosenAddress(chosenAddress);
        }
      }
      this.setState({ selectLoading: false });
    });
  }

  getCommitte = (provid, distid, type) => {
    this.setState({ selectLoading: true });
    this.props.getCommmitteLocation({ provid, distid }).then((res) => {
      if (res.payload.success) {
        this.setState({ committeLocation: res.payload.data });
        if (type) {
          const { chosenAddress } = this.props.mainState;
          chosenAddress.committeeid = res.payload.data[0].id;
          chosenAddress.committeenm = res.payload.data[0].name;
          chosenAddress.locid = res.payload.data[0].locid;
          this.props.changeChosenAddress(chosenAddress);
          this.getZoneSetting(chosenAddress);
        }
      }
      this.setState({ selectLoading: false });
    });
  }

  onChangeLoc = (e) => {
    const { addrs } = this.props.userinfo;
    let found = addrs.find(item => item.id === e);
    this.props.changeAddressType("edit");
    this.setState({ selectLoading: true });
    this.props.getDistrictAndCommitte({ id: found.id }).then((res) => {
      if (res.payload.success) {
        found.locid = res.payload.data.locid;
        found.districtnm = res.payload.data.districtnm;
        found.committeenm = res.payload.data.committeenm;
        found.provincenm = res.payload.data.provincenm;
        found.districtid = res.payload.data.districtid;
        found.committeeid = res.payload.data.committeeid;
        found.provinceid = res.payload.data.provinceid;
        this.setState({ committeLocation: res.payload.data.committees, districtLocation: res.payload.data.districts });
        this.getZoneSetting(found);
        this.setFieldsValue(found);
        this.props.changeChosenAddress(found);
        this.setState({ inzone: found.inzone });
      }
      this.setState({ selectLoading: false });
    });
  }

  getZoneSetting = (found) => {
    this.setState({ dateLoading: true });
    const { defaultActiveKey, inzone } = this.state;
    let locid = found.locid;
    let deliverytype = defaultActiveKey;
    this.props.getZoneSettings({ locid, deliverytype }).then((res) => {
      this.setState({ dateLoading: false });
      if (res.payload.success) {
        this.props.changeChosenDate(res.payload.data.deliveryDate);
        this.setState({ zoneSetting: res.payload.data });
      }
    });
  }

  setFieldsValue = (value) => {
    const { noAddress } = this.state;
    const { setFieldsValue } = this.props.form;
    const { main, info } = this.props.userinfo;
    const { addresstype } = this.props.mainState;
    if (noAddress) {
      this.props.form.setFieldsValue({
        phone1: info.phone1,
        name: info.firstname,
        committeeid: [],
        districtid: [],
      });
    } else {
      setFieldsValue({
        id: addresstype === "new" ? [] : value.id,
        committeeid: addresstype === "new" ? [] : value.committeeid,
        districtid: addresstype === "new" ? [] : value.districtid,
        provinceid: value.provinceid,
        phone1: addresstype === "new" ? "" : value.phone1,
        address: addresstype === "new" ? "" : value.address,
        name: addresstype === "new" ? "" : value.name,
      });
    }
  }

  onChangeMainLoc = (e) => {
    const { systemlocation } = this.props;
    const { chosenAddress } = this.props.mainState;
    let found = systemlocation.find(item => item.id === e);
    chosenAddress.provinceid = found.id;
    chosenAddress.provincenm = found.name;
    this.props.changeChosenAddress(chosenAddress);
    this.getDistrict(e, true);
  }

  onChangeDistLoc = (e) => {
    const { districtLocation } = this.state;
    const { chosenAddress } = this.props.mainState;
    let found = districtLocation.find(item => item.id === e);
    chosenAddress.districtid = found.id;
    chosenAddress.districtnm = found.name;
    this.props.changeChosenAddress(chosenAddress);
    this.getCommitte(chosenAddress.provinceid, chosenAddress.districtid, true);
  }

  onChangeCommitteLoc = (e) => {
    const { chosenAddress } = this.props.mainState;
    const { committeLocation, inzone } = this.state;
    let found = committeLocation.find(item => item.id === e);
    chosenAddress.committeeid = found.id;
    chosenAddress.committeenm = found.name;
    chosenAddress.locid = found.locid;
    this.getZoneSetting(found);
    this.props.changeChosenAddress(chosenAddress);
    this.setState({ inzone: found.inzone });
  }

  changeTab = (e) => {
    const { deliveryTypes, intl } = this.props;
    let found = deliveryTypes.find(item => item.id === parseInt(e.target.value));
    if (found.isenable === 1) {
      this.props.changeDeliveryTab(found);
      this.setState({ defaultActiveKey: e.target.value, requiredField: found.id === 3 ? false : true }, () => {
        this.getZoneSetting(this.props.mainState.chosenAddress);
        this.props.form.validateFields(['districtid', 'provinceid', 'committeeid', 'address'], { force: true });
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
        content: <Notification type="info" text={intl.formatMessage({ id: "checkout.expressDelivery.info" })} />,
      });
    }
  };

  changeTabError = (e, item) => {
    const { intl } = this.props;
    if (item.isenable === 0) {
      store.addNotification({
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
        content: <Notification type="info" text={intl.formatMessage({ id: "checkout.expressDelivery.info" })} />,
      });
    }
  }

  renderLocation = (locations) => {
    let tmp;
    if (locations.length !== 0) {
      tmp = locations.map((item, i) => {
        return (<Option key={i} value={item.id}>{item.name}</Option>);
      });
    }
    return tmp;
  }

  renderAddrsOption = () => {
    try {
      const { userinfo, intl } = this.props;
      let tmp;
      let main = "";
      if (userinfo.addrs.length !== 0) {
        tmp = userinfo.addrs.map((item, i) => {
          item.ismain === 1 ? main = intl.formatMessage({ id: "shared.form.address1.placeholder" }) : main = intl.formatMessage({ id: "shared.form.address2.placeholder" });
          return (<Option key={i} value={item.id}>{main + " - " + item.address}</Option>);
        });
      }
      return tmp;
    } catch (error) {
      return console.log(error);
    }
  };

  disabledDate = (current) => {
    const { zoneSetting } = this.state;
    let currentDateMill = moment(current, "YYYY-MM-DD").valueOf();
    let tmp = false;
    if (zoneSetting !== null) {
      tmp = moment(zoneSetting.deliveryDate, "YYYY-MM-DD").valueOf() > currentDateMill;
      zoneSetting.restDays.find((item) => {
        if (moment(item.restdate, "YYYY-MM-DD").valueOf() === currentDateMill) {
          tmp = true;
        }
      });
      if (moment(zoneSetting.deliveryDate, "YYYY-MM-DD").add(30, 'days').valueOf() <= currentDateMill) {
        tmp = true;
      }
    }
    return tmp;
  };

  dateStringChange = (date, datestring) => {
    this.props.changeChosenDate(datestring);
  }

  checkError = (value) => {
    if (value === undefined || value === null || value === NaN) {
      return "";
    }
    return value;
  };

  getDistrictAndCommitte = (id) => {
    try {
      const { chosenAddress } = this.props.mainState;
      this.setState({ selectLoading: true });
      this.props.getDistrictAndCommitte({ id }).then((res) => {
        this.setState({ selectLoading: false });
        if (res.payload.success) {
          chosenAddress.provinceid = res.payload.data.provinceid;
          chosenAddress.provincenm = "Улаанбаатар хот";
          chosenAddress.districtid = res.payload.data.districtid;
          chosenAddress.districtnm = res.payload.data.districts[0].name;
          chosenAddress.committeeid = res.payload.data.committeeid;
          chosenAddress.committeenm = res.payload.data.committees[0].name;
          chosenAddress.locid = res.payload.data.committees[0].locid;
          this.setState({ committeLocation: res.payload.data.committees, districtLocation: res.payload.data.districts }, () => {
            this.getZoneSetting(chosenAddress);
            // neg
            this.props.changeChosenAddress(chosenAddress);
            // this.setState({ chosenAddress });
            this.setFieldsValue(chosenAddress);
          });
        }
      });
    } catch (error) {
      return console.log(error);
    }
  }

  handleAddAddress = (e) => {
    e.preventDefault();
    // guraw
    // this.setState({ addresstype: "new" });
    this.props.changeAddressType("new");
    this.getDistrictAndCommitte(0);
  }

  onChangeLast = (value) => {
    this.props.form.setFieldsValue({ name: value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      defaultActiveKey, districtLocation, selectLoading,
      noAddress, committeLocation, dateLoading,
    } = this.state;
    const { chosenAddress, chosenDate } = this.props.mainState;
    const {
      deliveryTypes,
      systemlocation,
      intl,
      mainState,
    } = this.props;
    const lang = intl.locale;
    const { main, info } = this.props.userinfo;
    if (this.props.userinfo.info !== undefined) {
      return (
        <div>
          <Col span={24}>
            <div className="content-container payment" style={{ padding: '0px' }}>
              <RadioGroup name="radiogroup" defaultValue={defaultActiveKey} onChange={this.changeTab} className="col-md-12">
                <div className="hand-pay flex-this">
                  {
                    deliveryTypes.map((item, i) => {
                      let k = item.logo;
                      if (parseInt(defaultActiveKey) === item.id) {
                        k = item.logo.split(".")[0] + "color." + item.logo.split(".")[1];
                      }
                      return (
                        <Col xs={24} sm={24} md={8} lg={9} xl={8} className="padd10" key={i}>
                          <div
                            className="form-check col-md-12"
                            style={{
                              paddingTop: '5px',
                              paddingBottom: '5px',
                              borderRadius: "4px",
                              boxShadow: parseInt(defaultActiveKey) === item.id ? '0 0 0 1px #feb415' : '',
                            }}
                            onClick={e => this.changeTabError(e, item)}
                          >
                            <Radio value={item.id} name={item.id} disabled={!(item.isenable === 1)} className="col-md-12">
                              <img
                                alt="icon"
                                width="40px"
                                height="40px"
                                src={require("../../../../scss/assets/images/demo/" + k)}
                              />
                              <strong>{intl.locale === "mn" ? item.typenm : item.typenm_en}</strong>
                            </Radio>
                          </div>
                        </Col>
                      );
                    })
                  }
                </div>
              </RadioGroup>
            </div>
          </Col>
          <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <Form>
              <div>
                <Col span={24} style={{ marginBottom: '10px' }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                    <div className="text d-flex delivery-info-message" style={{ padding: "0px 15px 0px 15px", borderRadius: "4px" }}>
                      <i
                        className="fa fa-info"
                        aria-hidden="true"
                      />
                      <p className="text flex-this" style={{ fontSize: "13px" }}>{lang === 'mn' ? this.checkError(mainState.chosenDelivery.featuretxt) : this.checkError(mainState.chosenDelivery.featuretxt_en)}</p>
                    </div>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                    <span className="top-text">{intl.formatMessage({ id: "shared.form.firstname.placeholder" })}</span>
                    <Form.Item>
                      {getFieldDecorator("name", {
                        initialValue: this.checkError(chosenAddress.name),
                        rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.customerName.validation.required" }) }],
                      })(
                        <LetterInput size="large" autoComplete="off" allowClear placeholder={intl.formatMessage({ id: "shared.form.customerName.placeholder" })} className="col-md-12" onChange={this.onChangeLast} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                    <span className="top-text">{intl.formatMessage({ id: "shared.form.email.placeholder" })}</span>
                    <Form.Item>
                      {getFieldDecorator("email", {
                        initialValue: this.checkError(info.email),
                        rules: [
                          {
                            required: true,
                            message: intl.formatMessage({ id: "shared.form.email.validation.required" }),
                            type: "email",
                          },
                        ],
                      })(
                        <Input
                          size="large"
                          className="col-md-12"
                          placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })}
                          autoComplete="off"
                          allowClear={info.email === null ? true : false}
                          disabled={info.email === null ? false : true}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                    <span className="top-text">{intl.formatMessage({ id: "shared.form.phone1.placeholder" })}</span>
                    <Form.Item>
                      {getFieldDecorator("phone1", {
                        initialValue: this.checkError(chosenAddress.phone1),
                        rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                        { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                        { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
                      })(
                        <Input size="large" autoComplete="off" allowClear type="text" placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} className="col-md-12" />,
                      )}
                    </Form.Item>
                  </Col>
                </Col>
                {defaultActiveKey !== 3 && main !== null ? (
                  <Col span={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                      <Col xs={20} sm={20} md={23} lg={23} xl={23}>
                        <span className="top-text">{intl.formatMessage({ id: "shared.form.address.placeholder" })}</span>
                        <Form.Item className="select-button">
                          {getFieldDecorator("id", {
                            initialValue: this.checkError(chosenAddress.id),
                            rules: [{ required: false, message: "Хаяг оруулна уу" }],
                          })(
                            <Select onChange={this.onChangeLoc} disabled={noAddress} optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.address.selectAddress.placeholder" })} className="add-select">
                              {this.renderAddrsOption()}
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={4} sm={4} md={1} lg={1} xl={1}>
                        <Button className="addAddressBtn" onClick={this.handleAddAddress} icon="plus" size="large" style={{ borderRadius: "0px 4px 4px 0px", borderLeft: 'none', width: '100%' }} />
                      </Col>
                    </Col>
                  </Col>
                ) : (
                    null
                  )}
                {defaultActiveKey !== 3 ? (
                  <Col span={24}>
                    <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                      <span className="top-text">{intl.formatMessage({ id: "shared.form.city.placeholder" })}</span>
                      <Form.Item>
                        {getFieldDecorator("provinceid", {
                          initialValue: `${systemlocation.find(i => i.gbn === 'U') === undefined ? [] : systemlocation.find(i => i.gbn === 'U').id}`,
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
                        })(
                          <Select disabled placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })} showSearch optionFilterProp="children" className="col-md-12" onChange={this.onChangeMainLoc} >
                            {this.renderLocation(systemlocation)}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                      <span className="top-text">{intl.formatMessage({ id: "shared.form.district.placeholder" })}</span>
                      <Form.Item>
                        {getFieldDecorator("districtid", {
                          initialValue: this.props.userinfo.main === null ? "" : this.checkError(chosenAddress.districtid),
                          rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
                        })(
                          <Select className="col-md-12" showSearch optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.district.placeholder" })} onChange={this.onChangeDistLoc} disabled={selectLoading} loading={selectLoading}>
                            {this.renderLocation(districtLocation)}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
                      <span className="top-text">{intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}</span>
                      <Form.Item>
                        {getFieldDecorator("committeeid", {
                          initialValue: this.props.userinfo.main === null ? "" : this.checkError(chosenAddress.committeeid),
                          rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
                        })(
                          <Select className="col-md-12" placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })} showSearch optionFilterProp="children" onChange={this.onChangeCommitteLoc} disabled={selectLoading} loading={selectLoading}>
                            {this.renderLocation(committeLocation)}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
                      <span className="top-text">{intl.formatMessage({ id: "shared.form.address.placeholder" })}</span>
                      <Form.Item>
                        {getFieldDecorator("address", {
                          initialValue: this.checkError(chosenAddress.address),
                          // rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
                        })(
                          <Input className="col-md-12" size="large" autoComplete="off" allowClear type="text" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Col>
                ) : (
                    null
                  )}
              </div>
              <Col span={24}>
                <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10" style={{ float: 'right', marginBottom: '10px' }}>
                  <span className="top-text">{defaultActiveKey !== 3 ? intl.formatMessage({ id: "shared.form.label.deliveryDate" }) : intl.formatMessage({ id: "shared.form.label.getYourselfDate" })}</span>
                  <DatePicker
                    size="large"
                    className="col-md-12"
                    format="YYYY-MM-DD"
                    showTime={false}
                    placeholder="Огноо сонгох"
                    value={chosenDate === null ? moment(new Date(), "YYYY-MM-DD") : moment(chosenDate, "YYYY-MM-DD")}
                    allowClear={false}
                    onChange={(date, dateString) =>
                      this.dateStringChange(date, dateString)
                    }
                    disabled={dateLoading}
                    disabledDate={this.disabledDate}
                  />
                </Col>
              </Col>
            </Form>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default injectIntl(Form.create({ name: "deliverypanel" })(DeliveryPanel));