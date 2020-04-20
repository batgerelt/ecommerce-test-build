import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Select, Input, Button, Divider, DatePicker } from "antd";
import moment from "moment";
import LetterInput from "../../../../components/Input/LetterInput";

const { TextArea } = Input;
const { Option, OptGroup } = Select;
class Component extends React.Component {
  state = {};

  render() {
    const {
      mainState, lang, intl, deliveryTypes, systemlocation,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { chosenAddress, chosenDate } = mainState;
    const { main, info } = this.props.userinfo;
    const {
      defaultActiveKey, districtLocation, selectLoading,
      noAddress, committeLocation, dateLoading,
    } = this.props.bigState;
    return (
      <Col span={24} style={{ marginBottom: '10px' }}>

        <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.firstname.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("name", {
              initialValue: this.props.checkError(chosenAddress.name),
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.customerName.validation.required" }) }],
            })(
              <LetterInput size="large" autoComplete="off" allowclear placeholder={intl.formatMessage({ id: "shared.form.customerName.placeholder" })} className="col-md-12" onChange={this.onChangeLast} />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.email.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("email", {
              initialValue: this.props.checkError(info.email),
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
                disabled={info.email !== null}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.phone1.placeholder" })} 1</span>
          <Form.Item>
            {getFieldDecorator("phone1", {
              initialValue: this.props.checkError(chosenAddress.phone1),
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
              { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
              { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],
            })(
              <Input size="large" autoComplete="off" allowclear type="text" placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} className="col-md-12" />,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          {main !== null ? (
            <Col xs={24} sm={24} md={16} lg={16} xl={16} className="padd10">
              <Col xs={20} sm={20} md={22} lg={22} xl={22}>
                <span className="top-text">{intl.formatMessage({ id: "shared.form.addressSelect.placeholder" })}</span>
                <Form.Item className="select-button">
                  {getFieldDecorator("id", {
                    initialValue: this.props.checkError(chosenAddress.id),
                    rules: [{ required: false, message: "Хаяг оруулна уу" }],
                  })(
                    <Select onChange={this.props.onChangeLoc} disabled={this.props.bigState.noAddress} optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.address.selectAddress.placeholder" })} className="add-select">
                      {this.props.renderAddrsOption()}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xs={4} sm={4} md={2} lg={2} xl={2}>
                <Button className="addAddressBtn" onClick={this.props.handleAddAddress} icon="plus" size="large" style={{ borderRadius: "0px 4px 4px 0px", borderLeft: 'none', width: '100%' }} />
              </Col>
            </Col>
          ) : (
              null
            )}

          <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.phone1.placeholder" })} 2</span>
            <Form.Item>
              {getFieldDecorator("phone2", {
                initialValue: null,
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.phone1.validation.required" }) },
                { validator: this.props.compareToFirstPassword },
                { pattern: new RegExp("^[0-9]*$"), message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }) },
                { len: 8, message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }) }],

              })(
                <Input size="large" autoComplete="off" allowclear type="text" placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} className="col-md-12" />,
              )}
            </Form.Item>
          </Col>
        </Col>

        <Col span={24}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.city.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("provinceid", {
                initialValue: `${systemlocation.find(i => i.gbn === 'U') === undefined ? [] : systemlocation.find(i => i.gbn === 'U').id}`,
                rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
              })(
                <Select disabled placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })} showSearch optionFilterProp="children" className="col-md-12" onChange={this.props.onChangeMainLoc} >
                  {this.props.renderLocation(systemlocation)}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.district.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("districtid", {
                initialValue: this.props.userinfo.main === null ? "" : this.props.checkError(chosenAddress.districtid),
                rules: [{ required: defaultActiveKey !== "3", message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
              })(
                <Select className="col-md-12" showSearch optionFilterProp="children" placeholder={intl.formatMessage({ id: "shared.form.district.placeholder" })} onChange={this.props.onChangeDistLoc} disabled={selectLoading} loading={selectLoading}>
                  <OptGroup label="Сум/Дүүрэг">
                    <Option value={null} disabled>Сонгох</Option>
                    {this.props.renderLocation(districtLocation)}
                  </OptGroup>
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("committeeid", {
                initialValue: this.props.userinfo.main === null ? "" : this.props.checkError(chosenAddress.committeeid),
                rules: [{ required: defaultActiveKey !== "3", message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
              })(
                <Select className="col-md-12" placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })} showSearch optionFilterProp="children" onChange={this.props.onChangeCommitteLoc} disabled={selectLoading} loading={selectLoading}>
                  <OptGroup label="Хороо">
                    <Option value={null} disabled>Сонгох</Option>
                    {this.props.renderLocationCommit(committeLocation)}
                  </OptGroup>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.address" })}</span>
          <Form.Item>
            {getFieldDecorator("address", {
              initialValue: this.props.checkError(chosenAddress.address),
              rules: [{ required: defaultActiveKey !== "3", message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
            })(
              <Input className="col-md-12" size="large" autoComplete="off" allowclear type="text" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />,
            )}
          </Form.Item>
        </Col>
        <Divider />
        <Col xs={24} sm={24} md={16} lg={16} xl={16} className="padd10">
          <span className="top-text">Нэмэлт мэдээлэл</span>
          <Form.Item>
            {getFieldDecorator("explanation", {
              initialValue: this.state.explanation,
              rules: [{
                max: 100,
                message: "100 тэмдэгтэнд багтаан бичнэ үү",
              }],
            })(
              <TextArea
                placeholder={"Хүргэлтийн үйлчилгээний үед анхаарах нэмэлт мэдээллээ үлдээнэ үү!"}
                rows={4}
                allowclear
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10" style={{ float: 'right', marginBottom: '15px' }}>
          <span className="top-text" style={{ fontWeight: "700 !important" }}>{defaultActiveKey !== 3 ? intl.formatMessage({ id: "shared.form.label.deliveryDate" }) : intl.formatMessage({ id: "shared.form.label.getYourselfDate" })}</span>
          <DatePicker
            size="large"
            className="col-md-12"
            format="YYYY-MM-DD"
            placeholder="Огноо сонгох"
            value={chosenDate === null ? moment(new Date(), "YYYY-MM-DD") : moment(chosenDate, "YYYY-MM-DD")}
            onChange={(date, dateString) =>
              this.props.dateStringChange(date, dateString)
            }
            allowClear={this.props.bigState.clear}
            disabled={dateLoading}
            disabledDate={this.props.disabledDate}
          />
        </Col>
        {mainState.isChooseDeliveryCycleId ?
          <Col xs={24} sm={24} md={8} lg={24} xl={8} className="padd10">
            <span className="top-text">{defaultActiveKey !== 3 ? intl.formatMessage({ id: "shared.form.deliverycycle" }) : intl.formatMessage({ id: "shared.form.deliverycycleGet" })}</span>
            <Form.Item>
              {getFieldDecorator("deliveryTime", {
                initialValue: mainState.chosenDeliveryCycleId,
              })(
                <Select className="col-md-12" onChange={this.props.onDeliveryCycle}>
                  <Option value={null} disabled>Сонгох</Option>
                  {this.props.renderDeliveryCycle()}
                </Select>,
              )}
            </Form.Item>
          </Col>
          :
          null}

      </Col>
    );
  }
}

export default injectIntl(Form.create({ name: "Component" })(Component));
