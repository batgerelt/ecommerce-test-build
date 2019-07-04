/* eslint-disable arrow-body-style */
/* eslint-disable eol-last */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/newline-after-import */
import React from "react";
import { connect } from "react-redux";
import { Icon, Tabs, Input, Form, Select, DatePicker } from "antd";
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const formatter = new Intl.NumberFormat("en-US");
class DeliveryPanel extends React.Component {
  state = {
    defaultAddress: [],
    addresstype: "edit",
    userInfo: [],
    userAddress: [],
    epointcard: null,
    defaultActiveKey: 1,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); console.log("aaaa"); }

  changeTab = (e) => {
    this.setState({ defaultActiveKey: e });
  };

  onSubmit = () => {
    this.props.callback("3");
  }

  renderAddrsOption = () => {
    const { useraddress } = this.props;
    let tmp;
    if (useraddress.length !== 0) {
      tmp = useraddress.map((item, i) => {
        return (
          <Option key={i} value={item.id}>
            {item.address}
          </Option>
        );
      });
    }
    return tmp;
  };

  handleGetValue = () => { return console.log('DeliveryPanel'); }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { defaultActiveKey } = this.state;
    const {
      deliveryTypes,
      changeTab,
      onChangeMainLoc,
      onChangeSubLoc,
      addAddress,
      deliveryId,
      key,
      dateString,
      dateStringChange,
      addresstype,
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
              <div
                className="tab-pane active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <p className="text">{item.featuretxt}</p>
                <Form name="delivery">
                  <div className="row row10">
                    {item.id !== 3 ? (
                      <div
                        className="col-xl-12 col-md-12"
                        style={{ display: "flex" }}
                      >
                        <div
                          className="col-xl-8 col-md-8"
                          style={{ paddingLeft: "0px", paddingRight: "11px" }}
                        >
                          <Form.Item>
                            {getFieldDecorator("address", {
                              rules: [{ required: true, message: "Хаяг оруулна уу" }],
                            })(
                              <Select
                                onChange={e => this.onChangeLoc(e)}
                                showSearch
                                className="addr"
                                optionFilterProp="children"
                                placeholder="Хаягаа сонгоно уу ?"
                              >
                                {this.renderAddrsOption()}
                              </Select>,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-xl-4 col-md-4">
                          <button
                            className="btn btn-dark"
                            onClick={this.handleAddAddress}
                            style={{
                              padding: "2px 64px",
                              marginTop: "4px",
                              marginLeft: "3px",
                            }}
                          >
                            Хаяг нэмэх
                          </button>
                        </div>
                      </div>
                    ) : (
                        ""
                      )}
                    {item.id !== 3 ? (
                      <div className="col-xl-4 col-md-4">
                        <Form.Item>
                          {getFieldDecorator("mainLocation", {
                            rules: [{ required: true, message: "Хот/Аймаг сонгоно уу?" }],
                          })(
                            <Select
                              placeholder="Хот/аймаг *"
                              showSearch
                              optionFilterProp="children"
                              className="col-md-12"
                              onChange={e =>
                                onChangeMainLoc(e, this.props.form)
                              }
                            >
                              {/* this.renderMainLocation() */}
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
                          {getFieldDecorator("subLocation", {
                            rules: [{ required: true, message: "Дүүрэг/Сум сонгоно уу?" }],
                          })(
                            <Select
                              showSearch
                              optionFilterProp="children"
                              placeholder="Дүүрэг/Сум*"
                              onChange={e =>
                                onChangeSubLoc(
                                  e,
                                  this.props.form.validateFields,
                                  undefined,
                                )
                              }
                            >
                              {/* this.renderSubLocation() */}
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
                          {getFieldDecorator("commiteLocation", {
                            rules: [{ required: true, message: "Хороо сонгоно уу?" }],
                          })(
                            <Select
                              placeholder="Хороо*"
                              showSearch
                              optionFilterProp="children"
                            >
                              {/* this.renderCommiteLocation() */}
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
                          {getFieldDecorator("addresstype", {
                            rules: [{ required: addresstype === "new" ? true : false, message: "Хаяг оруулна уу ?" }],
                          })(
                            <Input
                              type="text"
                              placeholder="Хаягаа оруулна уу ?*"
                            />,
                          )}
                        </Form.Item>
                      </div>
                    ) : (
                        ""
                      )}
                    <div className="col-xl-4 col-md-4">
                      {/* <FormInput
                        form={this.props.form}
                        placeholder=""
                        name={"lastName"}
                        rules={[{ required: true, message: "Нэр оруулна уу" }]}
                      /> */}
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone1", {
                          rules: [{ required: true, message: "Утас оруулна уу" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу" },
                          { len: 8, message: "8 оронтой байх ёстой." }],
                        })(
                          <Input
                            type="text"
                            placeholder="Утас*"
                            className="col-md-12"
                          />,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-xl-4 col-md-4">
                      <Form.Item>
                        {getFieldDecorator("phone2", {
                          rules: [{ required: true, message: "Утас оруулна уу" },
                          { pattern: new RegExp("^[0-9]*$"), message: "Утас зөв оруулна уу" },
                          { len: 8, message: "8 оронтой байх ёстой." }],
                        })(
                          <Input
                            type="text"
                            placeholder="Утас*"
                            className="col-md-12"
                          />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  <div className="text-left">
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "rgba(0, 0, 0, 0.5)",
                        fontWeight: "bold",
                      }}
                    >
                      Хүргэлтээр авах өдрөө сонгоно уу
                    </span>

                    {/* <DatePicker
                      style={{ marginLeft: "10px" }}
                      format="YYYY-MM-DD"
                      showTime={false}
                      placeholder="Огноо сонгох"
                      defaultValue={moment(dateString, "YYYY-MM-DD")}
                      allowClear={false}
                      onChange={(date, dateString) =>
                        dateStringChange(date, dateString)
                      }
                      disabledDate={this.disabledDate}
                      disabledTime={disabledDateTime}
                    /> */}
                  </div>
                  <hr />

                  <div className="text-right">
                    <button
                      className="btn btn-main"
                      name="delivery"
                      onClick={this.onSubmit}
                    >
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

export default Form.create({ name: "checkoutdelivery" })(DeliveryPanel);