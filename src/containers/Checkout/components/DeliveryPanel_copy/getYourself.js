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

        <Col xs={0} sm={0} md={16} lg={16} xl={16} className="padd10" />

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
