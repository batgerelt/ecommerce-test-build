/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
import React from "react";
import { Form } from "antd";

class PaymentTypePanel extends React.Component {
  state = {};

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleGetValue = () => { return console.log('PaymentPanel'); }

  changeRadio = (e) => {
    const { paymentTypes, changeRadio } = this.props;
    if (paymentTypes !== 0) {
      paymentTypes.map((item, i) => {
        if (item.id === e.target.id) {
          changeRadio(item);
          // this.setState({ chosenPayment: item });
        }
      });
    }
  };

  renderPaymentTypes = () => {
    const { paymentTypes, chosenPayment } = this.props;
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
              defaultChecked={item.id === 1}
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

  render() {
    const { onSubmit } = this.props;
    return (
      <Form onSubmit={e => onSubmit(e)} name="payment">
        <div className="content-container">
          {this.renderPaymentTypes()}
        </div>
        <hr />
        <div className="text-right">
          <button className="btn btn-main" name="payment" type="submit">
            Дараах
          </button>
        </div>
      </Form>
    );
  }
}

export default PaymentTypePanel;
