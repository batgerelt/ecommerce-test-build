/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable radix */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Radio, Col } from "antd";
import { OrganizationTab } from "../";

const RadioGroup = Radio.Group;
class PaymentTypePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenPaymentType: {},
    };
  }

  componentWillMount() {
    const { paymentTypes } = this.props;
    this.props.setChosenPaymentType(paymentTypes[0]);
  }

  changeRadio = (e) => {
    const { paymentTypes } = this.props;
    let found = paymentTypes.find(item => item.id === parseInt(e.target.id));
    this.props.setChosenPaymentType(found);
  };

  renderPaymentTypes = () => {
    const { paymentTypes, intl } = this.props;
    const { chosenPaymentType } = this.props.mainState;
    let tmp;
    if (paymentTypes.length !== 0) {
      tmp = paymentTypes.map((item, i) => (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10" key={item.id}>
          <label className="card radio-card" style={{ boxShadow: chosenPaymentType.id === item.id ? 'inset 0 0 0 1px #feb415' : '' }}>
            <div className="radio-button-container" style={{ marginTop: "5px" }}>
              <input
                className="form-check-input radio-button"
                type="radio"
                name="paymentRadios"
                checked={chosenPaymentType.id === item.id}
                id={item.id}
                onChange={this.changeRadio}
              />
              <span className="checkmark" style={{ right: "15px" }} />
            </div>
            <h5 className="title radio-button-title">
              <i
                className={item.imgnm}
                aria-hidden="true"
                style={{ marginTop: "10px" }}
              />
              <p>
                <strong>{intl.locale === "mn" ? item.name : item.name_en}</strong>
                <span>{intl.locale === "mn" ? item.description : item.description_en}</span>
              </p>
            </h5>
          </label>
        </Col>
      ));
    }
    return tmp;
  };

  onSubmit = (e) => {
    e !== undefined ? e.preventDefault() : '';
    this.props.changePaymentType();
    this.props.callback("4");
  }

  changeRadioInOrg = (e) => {
    const { mainState } = this.props;
    // eslint-disable-next-line prefer-destructuring
    let cardInfo = mainState.cardInfo;
    if (e.target.value === 2) {
      if (cardInfo !== undefined && mainState.epointUsedPoint !== 0) {
        cardInfo.point = parseFloat(cardInfo.point) + mainState.epointUsedPoint;
        this.props.changeCardInfo(cardInfo);
        this.props.setUseEpoint(false, 0);
      }
    }
    this.props.changeChosenRadio(e.target.value);
  }

  render() {
    const { chosenRadio } = this.props.mainState;
    return (
      <Form name="paymenttypeform" onSubmit={this.onSubmit}>
        <div className="content-container" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
          <Col span={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
              <p className="title font-weight-bold" style={{ marginBottom: '0px' }}>
                <FormattedMessage id="shared.form.label.tax.receipt" />
              </p>
            </Col>
          </Col>
          <div className="content-container payment" style={{ padding: '0 0' }}>
            <RadioGroup onChange={this.changeRadioInOrg} value={chosenRadio} style={{ width: '100%' }}>
              <div className="flex-this hand-pay">
                <Col span={24}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
                    <div className="form-check" style={{ width: '100%', marginRight: '20px', boxShadow: chosenRadio === 1 ? '0 0 0 1px #feb415' : '' }}>
                      <Radio value={1} style={{ width: '100%' }}>
                        {/* <img alt="zurag" src={require("../../../../scss/assets/images/demo/shuurhai.png")} /> */}
                        <FormattedMessage id="shared.form.label.individual" />
                      </Radio>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
                    <div className="form-check" style={{ width: '100%', marginRight: '0px', boxShadow: chosenRadio === 2 ? '0 0 0 1px #feb415' : '' }}>
                      <Radio value={2} style={{ width: '100%' }}><FormattedMessage id="shared.form.label.company" /></Radio>
                    </div>
                  </Col>
                </Col>
              </div>
            </RadioGroup>
          </div>
          {
            chosenRadio === 2 ?
              <OrganizationTab
                {...this.props}
                setOrganizationData={this.props.setOrganizationData}
                changeCompanyInfo={this.props.changeCompanyInfo}
              />
              : null
          }
          <Col span={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
              <p className="title font-weight-bold">
                Төлбөрийн төрөл сонгох
              </p>
            </Col>
          </Col>
          <Col span={24}>
            {this.renderPaymentTypes()}
          </Col>
        </div>
      </Form>
    );
  }
}

export default injectIntl(Form.create({ name: "paymenttypeform" })(PaymentTypePanel));
