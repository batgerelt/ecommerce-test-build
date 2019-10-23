/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable radix */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Radio } from "antd";
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
        <label className="card radio-card" key={item.id}>
          <div
            className="radio-button-container"
            style={{ marginTop: "5px" }}
          >
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
    if (e.target.value === 2) {
      // eslint-disable-next-line prefer-destructuring
      let cardInfo = mainState.cardInfo;
      cardInfo.point = parseFloat(cardInfo.point) + mainState.epointUsedPoint;
      this.props.changeCardInfo(cardInfo);
      this.props.setUseEpoint(false, 0);
    }
    this.props.changeChosenRadio(e.target.value);
  }

  render() {
    const { chosenRadio } = this.props.mainState;
    return (
      <Form name="paymenttypeform" onSubmit={this.onSubmit}>
        <div className="content-container">
          <p className="title font-weight-bold" style={{ marginBottom: '0px' }}>
            <FormattedMessage id="shared.form.label.tax.receipt" />
          </p>
          <div className="content-container payment" style={{ padding: '0 0' }}>
            <RadioGroup onChange={this.changeRadioInOrg} value={chosenRadio} style={{ width: '100%' }}>
              <div className="flex-this hand-pay">
                <div className="form-check" style={{ width: '100%' }}>
                  <Radio value={1} style={{ width: '100%' }}><FormattedMessage id="shared.form.label.individual" /></Radio>
                </div>
                <div className="form-check" style={{ width: '100%' }}>
                  <Radio value={2} style={{ width: '100%' }}><FormattedMessage id="shared.form.label.company" /></Radio>
                </div>
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
          <p className="title font-weight-bold">
            Төлбөрийн төрөл сонгох
          </p>
          {this.renderPaymentTypes()}
        </div>
        <hr />
      </Form>
    );
  }
}

export default injectIntl(Form.create({ name: "paymenttypeform" })(PaymentTypePanel));
