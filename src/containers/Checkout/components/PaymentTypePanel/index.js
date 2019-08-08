/* eslint-disable radix */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Form } from "antd";

class PaymentTypePanel extends React.Component {
  state = {
    chosenPaymentType: {},
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }
  componentWillMount() {
    const { paymentTypes } = this.props;
    this.setState({ chosenPaymentType: paymentTypes[0] });
  }

  handleGetValue = () => { return console.log('PaymentPanel'); }

  changeRadio = (e) => {
    const { paymentTypes } = this.props;
    let found = paymentTypes.find(item => item.id === parseInt(e.target.id));
    this.setState({ chosenPaymentType: found });
  };

  renderPaymentTypes = () => {
    const { paymentTypes } = this.props;
    const { chosenPaymentType } = this.state;
    let tmp;
    if (paymentTypes.length !== 0) {
      tmp = paymentTypes.map((item, i) => (
        <label className="card radio-card" key={i}>
          <div
            className="radio-button-container"
            style={{ marginTop: "5px" }}
          >
            <input
              className="form-check-input radio-button"
              type="radio"
              name="paymentRadios"
              defaultChecked={chosenPaymentType.id === item.id}
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
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </p>
          </h5>
        </label>
      ));
    }

    return tmp;
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.changePaymentType();
    this.props.callback("4");
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <div className="content-container">
          {this.renderPaymentTypes()}
        </div>
        <hr />
        <div className="text-right">
          <button className="btn btn-main" name="payment" type="submit">
            <FormattedMessage id="shared.form.button.next" />
          </button>
        </div>
      </Form>
    );
  }
}

export default PaymentTypePanel;
