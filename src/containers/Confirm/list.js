/* eslint-disable react/no-danger */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { message, Button } from "antd";
import logo from "../../../src/scss/assets/images/demo/logo.jpg";

class List extends React.Component {
  state = {
    message: [],
    time: 10,
    timer: true,
    second: true,
  };

  handleLogin = () => {
    this.setState({ second: false });
    this.props.LoginModal.handleLoginModal();
  }

  componentWillMount() {
    // setTimeout(() => { this.setState({ timer: true }) }, 10000);
    setInterval(() => {
      if (!this.props.LoginModal.state.visible) {
        const { time } = this.state;
        if (time === 0) {
          this.setState({ timer: false });
        } else {
          this.setState({ time: this.state.time - 1 });
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval();
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
    console.log("gaga");
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
                      src={logo}
                    />
                  </div>
                  {confirms.length === 0 ? null : this.renderSuccessTrue()}
                  {!this.state.timer ? <Redirect to="/" /> : <h1>jaja</h1>}
                  <p>Нүүр хуудас руу үсрэхэд {this.state.time} секунд дутуу</p>
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
/* loadMoreRows = async (key) => {
    try {
      setTimeout(() => {
        this.props.getPackageScroll({
          order: "date_desc",
          start: this.props.packageCount,
          rowcnt: 8,
        });
      }, 1000);
    } catch (error) {
      return console.log(error);
    }
  }; */
