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
import { Tabs, Input, Form, Select, DatePicker, message } from "antd";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { SwalModals } from "../";
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
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }
  componentWillMount() {
    try {
      const { main } = this.props.userinfo;
      const { deliveryTypes } = this.props;
      let found = deliveryTypes.find(item => item.isenable === 1);
      this.setState({ defaultActiveKey: found.id });
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
        }
      }
      this.setState({ selectLoading: false });
    });
  }

  onChangeLoc = (e) => {
    const { addrs } = this.props.userinfo;
    const { inzone } = this.state;
    let found = addrs.find(item => item.id === e);
    this.setState({ selectLoading: true });
    this.props.getDistrictAndCommitte({ id: found.id }).then((res) => {
      if (res.payload.success) {
        this.setState({ committeLocation: res.payload.data.committees, districtLocation: res.payload.data.districts });
      }
      this.setState({ selectLoading: false });
    });
    if (found.inzone === 1 && inzone === 0) {
      this.getZoneSetting(found);
    }
    this.setFieldsValue(found);
    this.setState({ chosenAddress: found, inzone: found.inzone });
  }

  getZoneSetting = (found) => {
    const { defaultActiveKey } = this.state;
    let locid = found.locid;
    let deliverytype = defaultActiveKey;
    this.props.getZoneSettings({ locid, deliverytype }).then((res) => {
      if (res.payload.success) {
        console.log(res);
        this.setState({ zoneSetting: res.payload.data });
      }
    });
  }

  setFieldsValue = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      id: value.id,
      committeeid: value.committeeid,
      districtid: value.districtid,
      provinceid: value.provinceid,
      phone1: value.phone1,
      phone2: value.phone2,
      address: value.address,
      name: value.name,
    });
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
    if (found.inzone === 1 && inzone === 0) {
      this.getZoneSetting(found);
    }
    this.setState({ chosenAddress, inzone: found.inzone });
  }

  changeTab = (e) => {
    const { deliveryTypes } = this.props;
    let found = deliveryTypes.find(item => item.id === parseInt(e));
    this.props.DeliveryInfo.setDeliveryType(found);
    this.setState({ defaultActiveKey: e });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { products } = this.props;
    const { chosenAddress, addresstype } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let body = {};
        body.custid = 1;
        body.locid = chosenAddress.locid;
        body.address = values.address;
        body.name = values.name;
        body.phonE1 = values.phone1;
        body.phonE2 = values.phone2;
        if (addresstype === "new") {
          this.props.addAddress({ body }).then((res) => {
            if (res.payload.success) {
              chosenAddress.newLocId = res.payload.data;
              this.setState({ chosenAddress });
              /* this.setState({ chosenAddress: main });
              this.getDistrict(main.provinceid, false);
              this.getCommitte(main.provinceid, main.districtid, false); */
              message.success(res.payload.message);
            } else {
              message.error(res.payload.message);
            }
          });
        };
        body.provincenm = chosenAddress.provincenm;
        body.districtnm = chosenAddress.districtnm;
        body.committeenm = chosenAddress.committeenm;
        this.props.DeliveryInfo.handleGetValue(body);
        if (products.length !== 0) {
          MySwal.showLoading();
          // eslint-disable-next-line prefer-destructuring
          let locid = this.state.chosenAddress.locid;
          let tmp = [];
          products.map((item) => {
            let it = {
              skucd: item.cd,
              qty: item.qty,
            };
            tmp.push(it);
          });
          this.props.getCheckProductZone({ body: tmp, locid }).then((res) => {
            MySwal.close();
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
    const { userinfo } = this.props;
    let tmp;
    let main = "";
    if (userinfo.addrs.length !== 0) {
      tmp = userinfo.addrs.map((item, i) => {
        item.ismain === 1 ? main = "Үндсэн хаяг" : main = "Туслах хаяг";
        return (<Option key={i} value={item.id}>{main + " - " + item.address}</Option>);
      });
    }
    return tmp;
  };

  disabledDate = (current) => {
    const { zoneSetting } = this.state;
    let currentDate = moment(current, "YYYY-MM-DD").format("YYYY-MM-DD");
    let tmp = current < moment().endOf("day");
    if (zoneSetting !== null) {
      zoneSetting.restDays.find((item) => {
        if (moment(item.restdate, "YYYY-MM-DD").format("YYYY-MM-DD") === currentDate) {
          tmp = true;
        }
      });
      if ((moment(zoneSetting.date, "YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD") <= currentDate)) {
        tmp = true;
      }
    }
    return tmp;
  };

  dateStringChange = (date, datestring) => {
    let tmp = this.state.zoneSetting;
    tmp.date = datestring;
    this.setState({ zoneSetting: tmp });
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
          chosenAddress.address = "";
          chosenAddress.name = "";
          chosenAddress.phone1 = "";
          chosenAddress.phone2 = "";
          this.setState({ committeLocation: res.payload.data.committees, districtLocation: res.payload.data.districts }, () => {
            this.setState({ chosenAddress });
          });
        }
      });
    } catch (error) {
      return console.log(error);
    }
  }

  handleAddAddress = (e) => {
    e.preventDefault();
    this.getDistrictAndCommitte(0);
    this.setState({ addresstype: "new" });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      defaultActiveKey, chosenAddress, districtLocation, selectLoading, noAddress, committeLocation, zoneSetting,
    } = this.state;
    const {
      deliveryTypes,
      systemlocation,
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
                <div className="flex-this center">
                  <img
                    alt="icon"
                    width="40px"
                    height="40px"
                    src={require("../../../../scss/assets/images/demo/" + k)}
                  />
                  <p className="text">
                    <strong>{item.typenm}</strong>
                    <span>{formatter.format(item.price) + "₮"}</span>
                  </p>
                </div>
              }
              disabled={item.isenable === 1 ? false : true}
              key={item.id}
            >
              <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <p className="text">{item.featuretxt}</p>
                <Form onSubmit={this.onSubmit}>
                  <div className="row row10 checkoutFormContainer">
                    {item.id !== 3 ? (
                      <div className="col-xl-12 col-md-12" style={{ display: "flex" }}>
                        <div className="col-xl-8 col-md-8" style={{ paddingLeft: "0px", paddingRight: "11px" }} >
                          <Form.Item>
                            {getFieldDecorator("id", {
                              initialValue: this.checkError(chosenAddress.id),
                              rules: [{ required: !noAddress, message: "Хаяг оруулна уу" }],
                            })(
                              <Select onChange={this.onChangeLoc} showSearch className="addr" disabled={noAddress} optionFilterProp="children" placeholder="Хаягаа сонгоно уу ?">
                                {this.renderAddrsOption()}
                              </Select>,
                            )}
                          </Form.Item>
                        </div>
                        {
                          main !== null ?
                            <div className="col-xl-4 col-md-4">
                              <button className="btn btn-dark addAddressBtn" onClick={this.handleAddAddress}>Шинэ хаяг</button>
                            </div> : null
                        }
                      </div>
                    ) : (
                        ""
                      )}
                    {item.id !== 3 ? (
                      <div className="col-xl-4 col-md-4">
                        <Form.Item>
                          {getFieldDecorator("provinceid", {
                            initialValue: this.checkError(chosenAddress.provinceid),
                            rules: [{ required: true, message: "Хот/Аймаг сонгоно уу?" }],
                          })(
                            <Select placeholder="Хот/аймаг *" showSearch optionFilterProp="children" className="col-md-12" onChange={this.onChangeMainLoc} >
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
                            rules: [{ required: true, message: "Дүүрэг/Сум сонгоно уу?" }],
                          })(
                            <Select showSearch optionFilterProp="children" placeholder="Дүүрэг/Сум*" onChange={this.onChangeDistLoc} disabled={selectLoading} loading={selectLoading}>
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
                            rules: [{ required: true, message: "Хороо сонгоно уу?" }],
                          })(
                            <Select placeholder="Хороо*" showSearch optionFilterProp="children" onChange={this.onChangeCommitteLoc} disabled={selectLoading} loading={selectLoading}>
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
                            rules: [{ required: true, message: "Гэрийн хаяг оруулна уу ?" }],
                          })(
                            <Input autoComplete="off" allowClear type="text" placeholder="Гэрийн хаяг ?*" />,
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
                          rules: [{ required: true, message: "Захиалагчийн нэр оруулна уу ?" }],
                        })(
                          <Input autoComplete="off" allowClear type="text" placeholder="Захиалагчийн нэр*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone1", {
                          initialValue: this.checkError(chosenAddress.phone1),
                          rules: [{ required: true, message: "Утас 1 оруулна уу ?" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу ?" },
                          { len: 8, message: "8 оронтой байх ёстой !." }],
                        })(
                          <Input autoComplete="off" allowClear type="text" placeholder="Утас 1*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone2", {
                          initialValue: this.checkError(chosenAddress.phone2),
                          rules: [{ required: true, message: "Утас 2 оруулна уу ?" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу ?" },
                          { len: 8, message: "8 оронтой байх ёстой !." }],
                        })(
                          <Input autoComplete="off" allowClear type="text" placeholder="Утас 2*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  <div className="text-left">
                    <span style={{ marginLeft: "10px", color: "rgba(0, 0, 0, 0.5)", fontWeight: "bold" }}>
                      Хүргэлтээр авах өдрөө сонгоно уу
                    </span>

                    <DatePicker
                      style={{ marginLeft: "10px" }}
                      format="YYYY-MM-DD"
                      showTime={false}
                      placeholder="Огноо сонгох"
                      value={zoneSetting === null ? moment("2019-07-16", "YYYY-MM-DD") : moment(zoneSetting.date, "YYYY-MM-DD")}
                      allowClear={false}
                      onChange={(date, dateString) =>
                        this.dateStringChange(date, dateString)
                      }
                      disabledDate={this.disabledDate}
                    />
                  </div>
                  <hr />

                  <div className="text-right">
                    <button className="btn btn-main" type="submit" >
                      Дараах
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

export default Form.create({ name: "deliverypanel" })(DeliveryPanel);