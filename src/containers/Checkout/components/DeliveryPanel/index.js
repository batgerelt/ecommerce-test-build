/* eslint-disable use-isnan */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable eol-last */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/newline-after-import */
import React from "react";
import { connect } from "react-redux";
import { Icon, Tabs, Input, Form, Select, DatePicker, Button } from "antd";
import moment from "moment";
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const formatter = new Intl.NumberFormat("en-US");
class DeliveryPanel extends React.Component {
  state = {
    chosenAddress: {},
    addresstype: "edit",
    defaultActiveKey: 1,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }
  componentWillMount() { this.setState({ chosenAddress: this.props.useraddress.main }); }
  onChangeLoc = (e) => {
    const { addrs } = this.props.useraddress;
    let found = addrs.find(item => item.id === e);
    this.getAddress(found.provid, found.distid);
    this.setState({ chosenAddress: found });
  }

  getAddress = (provid, distid) => {
    this.props.getDistrictLocation({ id: provid });
    this.props.getCommmitteLocation({ provid, distid }).then((res) => {
      console.log(res, "pp");
    });
  }

  onChangeMainLoc = (e) => {
    this.props.form.validateFields((err, values) => {
      this.getAddress(e, 0);
      this.setState({ chosenAddress: values });
    });
    console.log(e, "hot");
  }

  onChangeDistLoc = (e) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ chosenAddress: values });
    });
    console.log(e, "duureg");
  }

  changeTab = (e) => {
    this.setState({ defaultActiveKey: e });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err, values);
      if (!err) {
        this.props.callback("3");
      }
    });
  }

  renderLocation = (locations) => {
    let tmp;
    if (locations.length !== 0) {
      tmp = locations.map((item, i) => {
        return (
          <Option key={i} value={item.id}>
            {item.name}
          </Option>
        );
      });
    }
    return tmp;
  }

  renderAddrsOption = () => {
    const { useraddress } = this.props;
    let tmp;
    let main = "";
    if (useraddress.addrs.length !== 0) {
      tmp = useraddress.addrs.map((item, i) => {
        item.ismain === 1 ? main = "Үндсэн" : main = "Туслах";
        return (
          <Option key={i} value={item.id}>
            {main + " - " + item.address}
          </Option>
        );
      });
    }
    return tmp;
  };

  disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  handleGetValue = () => { return console.log('DeliveryPanel'); }
  checkError = (value) => {
    if (value === undefined || value === null || value === NaN) {
      return "";
    }
    return value;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { defaultActiveKey, chosenAddress } = this.state;
    console.log(this.props.useraddress.addrs, "aaaa");
    console.log(this.props.districtlocation, "bbbb");
    const {
      deliveryTypes,
      changeTab,
      onChangeSubLoc,
      addAddress,
      deliveryId,
      key,
      dateString,
      dateStringChange,
      addresstype,
      committelocation,
      districtlocation,
      systemlocation,
    } = this.props;
    const style = {
      color: "#feb415",
    };

    return (
      <Tabs onChange={this.changeTab} defaultActiveKey={defaultActiveKey.toString()} activeKey={defaultActiveKey.toString()}>
        {deliveryTypes.map((item, i) => {
          return (
            <TabPane
              tab={
                <div className="flex-this center">
                  <img
                    alt="icon"
                    width="40px"
                    height="40px"
                    src={require("../../../../scss/assets/images/demo/" + item.logo)}
                  />
                  <p className="text">
                    <strong>{item.typenm}</strong>
                    <span>{formatter.format(item.price) + "₮"}</span>
                  </p>
                </div>
              }
              key={item.id}
            >
              <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <p className="text">{item.featuretxt}</p>
                <Form onSubmit={this.onSubmit}>
                  <div className="row row10">
                    {item.id !== 3 ? (
                      <div className="col-xl-12 col-md-12" style={{ display: "flex" }}>
                        <div className="col-xl-8 col-md-8" style={{ paddingLeft: "0px", paddingRight: "11px" }} >
                          <Form.Item>
                            {getFieldDecorator("id", {
                              initialValue: this.checkError(chosenAddress.id),
                              rules: [{ required: true, message: "Хаяг оруулна уу" }],
                            })(
                              <Select onChange={this.onChangeLoc} showSearch className="addr" optionFilterProp="children" placeholder="Хаягаа сонгоно уу ?">
                                {this.renderAddrsOption()}
                              </Select>,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-xl-4 col-md-4">
                          <button className="btn btn-dark addAddressBtn" onClick={this.handleAddAddress}>Хаяг нэмэх</button>
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
                            rules: [{ required: true, message: "Хот/Аймаг сонгоно уу?" }],
                          })(
                            <Select placeholder="Хот/аймаг *" showSearch optionFilterProp="children" className="col-md-12" onChange={this.onChangeMainLoc}>
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
                            <Select showSearch optionFilterProp="children" placeholder="Дүүрэг/Сум*" onChange={this.onChangeDistLoc}>
                              {this.renderLocation(districtlocation)}
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
                            <Select placeholder="Хороо*" showSearch optionFilterProp="children">
                              {this.renderLocation(committelocation)}
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
                            rules: [{ required: true, message: "Хаяг оруулна уу ?" }],
                          })(
                            <Input allowClear type="text" placeholder="Хаягаа оруулна уу ?*" />,
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
                          rules: [{ required: true, message: "Нэр оруулна уу" }],
                        })(
                          <Input allowClear type="text" placeholder="Нэр*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone1", {
                          initialValue: this.checkError(chosenAddress.phone1),
                          rules: [{ required: true, message: "Утас 1 оруулна уу" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу" },
                          { len: 8, message: "8 оронтой байх ёстой." }],
                        })(
                          <Input allowClear type="text" placeholder="Утас 1*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone2", {
                          initialValue: this.checkError(chosenAddress.phone2),
                          rules: [{ required: true, message: "Утас 2 оруулна уу" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу" },
                          { len: 8, message: "8 оронтой байх ёстой." }],
                        })(
                          <Input allowClear type="text" placeholder="Утас 2*" className="col-md-12" />,
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
                      defaultValue={moment("2019-07-04", "YYYY-MM-DD")}
                      allowClear={false}
                      /* onChange={(date, dateString) =>
                        dateStringChange(date, dateString)
                      } */
                      disabledDate={this.disabledDate}
                    /* disabledTime={disabledDateTime} */
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