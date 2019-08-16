/* eslint-disable react/no-danger */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { message, Button } from "antd";

class List extends React.Component {
  state = { message: [] };

  handleLogin = () => {
    this.props.LoginModal.handleLoginModal();
  }

  renderSuccessTrue() {
    return (
      <div>
        <h3><FormattedMessage id="registration.confirmation.title" /></h3>
        <p><FormattedMessage id="registration.confirmation.body1" /></p>
        <p><FormattedMessage id="registration.confirmation.body2" /></p>
        <Button className="btn btn-black text-uppercase" onClick={this.handleLogin}>
          <FormattedMessage id="shared.form.button.login" />
        </Button>
      </div>
    );
  }

  renderTimer() {
    setTimeout(() => this.props.history.push("/"), 5000);
  }

  renderSuccessFalse() {
    return <Redirect to="/" />;
  }

  renderConfirm = () => {
    try {
      const { confirms } = this.props;
      console.log(confirms.success);
      if (confirms.success) {
        return this.renderSuccessTrue();
      }
      return this.renderSuccessFalse();
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    console.log(this.props.history);
    const { confirms } = this.props;
    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10" />
          <div className="top-container">
            <div className="section">
              <div className="col-md-12">
                <center>
                  <div
                    className="logo"
                    style={{ width: "15%", marginBottom: "50px" }}
                  >
                    <img
                      style={{ width: "100%" }}
                      alt="logo"
                      src="http://test.emart.urto.mn/Uploads/Products/emartMallLogo.png"
                    />
                  </div>
                  {confirms.length === 0 ? null : this.renderConfirm()}
                </center>
              </div>
            </div>
          </div>
        </div>
        {this.renderTimer()}
      </div>
    );
  }
}

export default List;
