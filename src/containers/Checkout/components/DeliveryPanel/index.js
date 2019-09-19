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
import { Tabs, Input, Form, Select, DatePicker, message } from "antd";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { SwalModals } from "../";
import LetterInput from "../../../../components/Input/LetterInput";
import NumberInput from "../../../../components/Input/NumberInput";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const formatter = new Intl.NumberFormat("en-US");
const MySwal = withReactContent(Swal);

class DeliveryPanel extends React.Component {
  state = {
    chosenAddress: {},
    addresstype: "edit",
    defaultActiveKey: 1,
    districtLocation: [],
    committeLocation: [],
    selectLoading: false,
    chosenDeliveryType: {},
    noAddress: false,
    inzone: 0,
    zoneSetting: null,
    chosenDate: null,
    dateLoading: false,
    requiredField: true,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }
  componentWillMount() {
    try {
      const { main, info } = this.props.userinfo;
      const { deliveryTypes } = this.props;
      let found = deliveryTypes.find(item => item.isenable === 1);
      this.setState({ defaultActiveKey: found.id, chosenDeliveryType: found });
      this.props.DeliveryInfo.setDeliveryType(found);
      if (main !== null) {
        this.setState({ chosenAddress: main, inzone: main.inzone });
        this.getZoneSetting(main);
        this.getDistrict(main.provinceid, false);
        this.getCommitte(main.provinceid, main.districtid, false);
      } else {
        this.setState({ noAddress: true, addresstype: "new" });
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
          const { chosenAddress } = this.state;
          chosenAddress.districtid = res.payload.data[0].id;
          chosenAddress.districtnm = res.payload.data[0].name;
          this.getCommitte(id, res.payload.data[0].id, true);
          this.setState({ chosenAddress });
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
          const { chosenAddress } = this.state;
          chosenAddress.committeeid = res.payload.data[0].id;
          chosenAddress.committeenm = res.payload.data[0].name;
          chosenAddress.locid = res.payload.data[0].locid;
          this.setState({ chosenAddress });
          this.getZoneSetting(chosenAddress);
        }
      }
      this.setState({ selectLoading: false });
    });
  }

  onChangeLoc = (e) => {
    const { addrs } = this.props.userinfo;
    let found = addrs.find(item => item.id === e);
    this.setState({ selectLoading: true, addresstype: "edit" });
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
        this.setState({ chosenAddress: found, inzone: found.inzone });
      }
      this.setState({ selectLoading: false });
    });
  }

  getZoneSetting = (found) => {
    this.setState({ dateLoading: true });
    const { defaultActiveKey, inzone } = this.state;
    // if (found.inzone === 1 && inzone === 0) {
    let locid = found.locid;
    let deliverytype = defaultActiveKey;
    this.props.getZoneSettings({ locid, deliverytype }).then((res) => {
      this.setState({ dateLoading: false });
      if (res.payload.success) {
        this.setState({ zoneSetting: res.payload.data, chosenDate: res.payload.data.deliveryDate });
      }
    });
    // }
  }

  setFieldsValue = (value) => {
    const { addresstype, noAddress } = this.state;
    const { setFieldsValue } = this.props.form;
    const { main, info } = this.props.userinfo;
    if (noAddress) {
      this.props.form.setFieldsValue({
        phone1: info.phone1,
        phone2: info.phone2,
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
        phone2: addresstype === "new" ? "" : value.phone2,
        address: addresstype === "new" ? "" : value.address,
        name: addresstype === "new" ? "" : value.name,
      });
    }
  }

  onChangeMainLoc = (e) => {
    const { systemlocation } = this.props;
    const { chosenAddress } = this.state;
    let found = systemlocation.find(item => item.id === e);
    chosenAddress.provinceid = found.id;
    chosenAddress.provincenm = found.name;
    this.setState({ chosenAddress });
    this.getDistrict(e, true);
  }

  onChangeDistLoc = (e) => {
    const { chosenAddress, districtLocation } = this.state;
    let found = districtLocation.find(item => item.id === e);
    chosenAddress.districtid = found.id;
    chosenAddress.districtnm = found.name;
    this.setState({ chosenAddress });
    this.getCommitte(chosenAddress.provinceid, chosenAddress.districtid, true);
  }

  onChangeCommitteLoc = (e) => {
    const { chosenAddress, committeLocation, inzone } = this.state;
    let found = committeLocation.find(item => item.id === e);
    chosenAddress.committeeid = found.id;
    chosenAddress.committeenm = found.name;
    chosenAddress.locid = found.locid;
    // if (found.inzone === 1 && inzone === 0) {
    this.getZoneSetting(found);
    // }
    this.setState({ chosenAddress, inzone: found.inzone });
  }

  changeTab = (e) => {
    const { deliveryTypes, intl } = this.props;
    // this.props.form.resetFields();
    let found = deliveryTypes.find(item => item.id === parseInt(e));
    if (found.isenable === 1) {
      this.props.DeliveryInfo.setDeliveryType(found);
      this.setState({ defaultActiveKey: e, chosenDeliveryType: found, requiredField: found.id === 3 ? false : true }, () => {
        this.getZoneSetting(this.state.chosenAddress);
        this.props.form.validateFields(['districtid', 'provinceid', 'committeeid', 'address'], { force: true });
      });
    } else {
      message.warning(intl.formatMessage({ id: "checkout.expressDelivery.info" }));
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { products, userinfo } = this.props;
    const { chosenAddress, addresstype, chosenDeliveryType } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let body = {};
        body.id = chosenAddress.id;
        body.custid = 1;
        body.locid = chosenAddress.locid;
        body.address = values.address;
        body.name = values.name;
        body.phonE1 = values.phone1;
        body.phonE2 = values.phone2;
        if (addresstype === "new" && chosenDeliveryType.id !== 3) {
          this.props.addAddress({ body }).then((res) => {
            if (res.payload.success) {
              chosenAddress.id = res.payload.data;
              body.id = res.payload.data;
              this.setState({ chosenAddress, addresstype: "edit" });
              this.props.getUserInfo().then((res) => {
                if (res.payload.success) {
                  this.setState({ noAddress: false });
                }
              });
            } else {
              message.warning(res.payload.message);
            }
          });
        };
        body.provincenm = chosenAddress.provincenm;
        body.districtnm = chosenAddress.districtnm;
        body.committeenm = chosenAddress.committeenm;
        this.props.DeliveryInfo.handleGetValue(body, this.state.chosenDate);
        if (products.length !== 0) {
          if (chosenDeliveryType.id === 3) {
            this.props.changeDeliveryType();
            this.props.callback("3");
          } else {
            this.props.changeLoading(true);
            // MySwal.showLoading();
            // eslint-disable-next-line prefer-destructuring
            let locid = this.state.chosenAddress.locid;
            let tmp = [];
            products.map((item) => {
              let it = {
                skucd: item.skucd,
                qty: item.qty,
              };
              tmp.push(it);
            });
            this.props.getCheckProductZone({ body: tmp, locid }).then((res) => {
              // MySwal.close();
              this.props.changeLoading(false);
              if (res.payload.success) {
                this.props.changeDeliveryType();
                this.props.callback("3");
              } else {
                MySwal.fire({
                  html: (
                    <SwalModals
                      type={"delete"}
                      data={[]}
                      ordData={[]}
                      onRef={ref => (this.SwalModals = ref)}
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
              }
            });
          }
        }
      }
    });
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
    this.setState({ chosenDate: datestring });
  }

  handleGetValue = () => { return console.log('DeliveryPanel'); }

  checkError = (value) => {
    if (value === undefined || value === null || value === NaN) {
      return "";
    }
    return value;
  };

  getDistrictAndCommitte = (id) => {
    try {
      const { chosenAddress } = this.state;
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
          /* chosenAddress.address = "";
          chosenAddress.name = "";
          chosenAddress.phone1 = "";
          chosenAddress.phone2 = ""; */
          this.setState({ committeLocation: res.payload.data.committees, districtLocation: res.payload.data.districts }, () => {
            this.getZoneSetting(chosenAddress);
            this.setState({ chosenAddress });
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
    this.setState({ addresstype: "new" });
    this.getDistrictAndCommitte(0);
  }

  onChangeLast = (value) => {
    this.props.form.setFieldsValue({ name: value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      defaultActiveKey, chosenAddress, districtLocation, selectLoading,
      noAddress, committeLocation, chosenDate, dateLoading, addresstype, requiredField,
    } = this.state;
    const {
      deliveryTypes,
      systemlocation,
      intl,
    } = this.props;
    const { main } = this.props.userinfo;
    return (
      <Tabs onChange={this.changeTab} defaultActiveKey={defaultActiveKey.toString()} activeKey={defaultActiveKey.toString()}>
        {deliveryTypes.map((item, i) => {
          let k = item.logo;
          if (parseInt(defaultActiveKey) === item.id) {
            k = item.logo.split(".")[0] + "color." + item.logo.split(".")[1];
          }
          return (
            <TabPane
              tab={
                <div className="flex-this center" style={{ cursor: item.isenable === 1 ? 'pointer' : 'not-allowed' }}>
                  <img
                    alt="icon"
                    width="40px"
                    height="40px"
                    src={require("../../../../scss/assets/images/demo/" + k)}
                  />
                  <p className="text">
                    <strong>{intl.locale === "mn" ? item.typenm : item.typenm_en}</strong>
                    <span>{formatter.format(item.price) + "₮"}</span>
                  </p>
                </div>
              }
              // disabled={item.isenable === 1 ? false : true}
              key={item.id}
            >
              <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <p className="text">{intl.locale === "mn" ? item.featuretxt : item.featuretxt_en}</p>
                <Form onSubmit={this.onSubmit}>
                  <div className="row row10 checkoutFormContainer">
                    {item.id !== 3 && main !== null ? (
                      <div className="col-xl-12 col-md-12 checkout-addbtn-container">
                        <div className="col-xl-8 col-md-8 checkout-address-container">
                          <Form.Item>
                            {getFieldDecorator("id", {
                              initialValue: this.checkError(chosenAddress.id),
                              rules: [{ required: false, message: "Хаяг оруулна уу" }],
                            })(
                              <Select onChange={this.onChangeLoc} showSearch className="addr" disabled={noAddress} optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.address.selectAddress.placeholder" })}>
                                {this.renderAddrsOption()}
                              </Select>,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-xl-4 col-md-4">
                          <button className="btn btn-dark addAddressBtn" onClick={this.handleAddAddress}><FormattedMessage id="shared.form.button.newAddress" /></button>
                        </div>
                      </div>
                    ) : (
                        ""
                      )}
                    {item.id !== 3 ? (
                      <div className="col-xl-4 col-md-4">
                        <Form.Item>
                          {getFieldDecorator("provinceid", {
                            initialValue: this.checkError(chosenAddress.provinceid),
                            rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
                          })(
                            <Select placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })} showSearch optionFilterProp="children" className="col-md-12" onChange={this.onChangeMainLoc} >
                              {this.renderLocation(systemlocation)}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                    ) : (
                        ""
                      )}
                    {item.id !== 3 ? (
                      <div className="col-xl-4 col-md-4">
                        <Form.Item>
                          {getFieldDecorator("districtid", {
                            initialValue: this.checkError(chosenAddress.districtid),
                            rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
                          })(
                            <Select showSearch optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })} onChange={this.onChangeDistLoc} disabled={selectLoading} loading={selectLoading}>
                              {this.renderLocation(districtLocation)}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                    ) : (
                        ""
                      )}
                    {item.id !== 3 ? (
                      <div className="col-xl-4 col-md-4">
                        <Form.Item>
                          {getFieldDecorator("committeeid", {
                            initialValue: this.checkError(chosenAddress.committeeid),
                            rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
                          })(
                            <Select placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })} showSearch optionFilterProp="children" onChange={this.onChangeCommitteLoc} disabled={selectLoading} loading={selectLoading}>
                              {this.renderLocation(committeLocation)}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                    ) : (
                        ""
                      )}

                    {item.id !== 3 ? (
                      <div className="col-xl-12 col-md-12">
                        <Form.Item>
                          {getFieldDecorator("address", {
                            initialValue: this.checkError(chosenAddress.address),
                            rules: [{ required: defaultActiveKey === "3" ? false : true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
                          })(
                            <Input autoComplete="off" allowClear type="text" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />,
                          )}
                        </Form.Item>
                      </div>
                    ) : (
                        ""
                      )}
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("name", {
                          initialValue: this.checkError(chosenAddress.name),
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.customerName.validation.required" }) }],
                        })(
                          <LetterInput autoComplete="off" allowClear placeholder={intl.formatMessage({ id: "shared.form.customerName.placeholder" })} className="col-md-12" onChange={this.onChangeLast} />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone1", {
                          initialValue: this.checkError(chosenAddress.phone1),
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                          { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                          { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
                        })(
                          <NumberInput
                            placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })}
                            maxLength={8}
                            allowClear
                            className="col-md-12"
                            autoComplete="off"
                          />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone2", {
                          initialValue: this.checkError(chosenAddress.phone2),
                          rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                          { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                          { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
                        })(
                          <Input autoComplete="off" allowClear type="text" placeholder={intl.formatMessage({ id: "shared.form.phone2.placeholder" })} className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  <div className="text-left">
                    <span style={{ marginLeft: "10px", color: "rgba(0, 0, 0, 0.5)", fontWeight: "bold" }}>
                      <FormattedMessage id="shared.form.label.deliveryDate" />
                    </span>

                    <DatePicker
                      style={{ marginLeft: "10px" }}
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
                  </div>
                  <hr />

                  <div className="text-right" style={{ marginBottom: "15px" }}>
                    <button className="btn btn-main" type="submit" disabled={!(!dateLoading || !selectLoading)}>
                      <FormattedMessage id="shared.form.button.next" />
                    </button>
                  </div>
                </Form>
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default injectIntl(Form.create({ name: "deliverypanel" })(DeliveryPanel));