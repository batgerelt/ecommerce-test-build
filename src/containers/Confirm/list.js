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

  renderSuccessFalse() {
    return <Redirect to="/" />;
  }

  renderConfirm = () => {
    try {
      const { confirms } = this.props;
      if (confirms.success) {
        return this.renderSuccessTrue();
      }
      return this.renderSuccessFalse();
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    const { confirms } = this.props;
    console.log(this.props);
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
                    {/* <img
                      style={{ width: "100%" }}
                      alt="logo"
                      src={IMAGE + staticInfo.logopath}
                    /> */}
                  </div>
                  {confirms.length === 0 ? null : this.renderSuccessTrue()}
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
