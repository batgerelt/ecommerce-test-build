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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { paymentTypes } = this.props;
    this.props.setChosenPaymentType(paymentTypes[0]);
  }

  changeRadio = (e) => {
    const { paymentTypes } = this.props;
    paymentTypes.map((item, index) => (
      item.id === e.target.value ? this.props.setChosenPaymentType(item) : ""
    ));
  };

  renderIcons(id, selected) {
    const { chosenPaymentType } = this.props.mainState;
    switch (id) {
      case 1:
        if (chosenPaymentType.id === 1) {
          return (<img
            alt="icon"
            width="35px"
            height="auto"
            src={require("../../../../scss/assets/svg/card-black.svg")}
          />);
        }
        return (<img
          alt="icon"
          width="35px"
          height="auto"
          src={require("../../../../scss/assets/svg/card.svg")}
        />);
      case 2:
        if (chosenPaymentType.id === 2) {
          return (<img
            alt="icon"
            width="35px"
            height="auto"
            src={require("../../../../scss/assets/svg/envelope-black.svg")}
          />);
        }
        return (<img
          alt="icon"
          width="35px"
          height="auto"
          src={require("../../../../scss/assets/svg/envelope.svg")}
        />);
      case 3:
        if (chosenPaymentType.id === 3) {
          return (<img
            alt="icon"
            width="35px"
            height="auto"
            src={require("../../../../scss/assets/svg/qrcode-white.svg")}
          />);
        }
        return (<img
          alt="icon"
          width="35px"
          height="auto"
          src={require("../../../../scss/assets/svg/qrcode-orange.svg")}
        />);
      case 4:
        if (chosenPaymentType.id === 4) {
          return (<img
            alt="icon"
            width="35px"
            height="auto"
            src={require("../../../../scss/assets/svg/social-black.svg")}
          />);
        }
        return (<img
          alt="icon"
          width="35px"
          height="auto"
          src={require("../../../../scss/assets/svg/social.svg")}
        />);
      default:
        return null;
    }
  }

  renderPaymentTypes = () => {
    const { paymentTypes, intl } = this.props;
    const { chosenPaymentType } = this.props.mainState;
    let tmp;
    if (paymentTypes.length !== 0) {
      tmp = paymentTypes.map((item, i) => (
        <Col xs={24} sm={24} md={12} lg={12} xl={12} key={item.id} style={{ padding: "5px" }}>
          <Radio.Button className="d-flex align-items-center radio-height" value={item.id}>
            <h5 className="d-flex align-items-center text-left">
              {this.renderIcons(item.id)}
              <p>
                <span className="text-uppercase" style={{ fontSize: "16px", color: `${item.id === chosenPaymentType.id ? "#494b57" : "black"}` }}>{intl.locale === "mn" ? item.name : item.name_en}</span>
                <span style={{ color: `${item.id === chosenPaymentType.id ? "#494b57" : "black"}` }}>{intl.locale === "mn" ? item.description : item.description_en}</span>
              </p>
            </h5>
          </Radio.Button>
        </Col >
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
    const { chosenRadio, chosenPaymentType } = this.props.mainState;
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
            <Radio.Group buttonStyle="solid" onChange={this.changeRadio} value={chosenPaymentType.id}>
              {this.renderPaymentTypes()}
            </Radio.Group>
          </Col>
        </div>
      </Form >
    );
  }
}

export default injectIntl(Form.create({ name: "paymenttypeform" })(PaymentTypePanel));
