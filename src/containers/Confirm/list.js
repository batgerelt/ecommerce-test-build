/* eslint-disable react/no-danger */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { message, Button, Row, Col } from "antd";
import logo from "../../../src/scss/assets/images/demo/logo.jpg";

class List extends React.Component {
  state = {
    message: [],
    time: 20,
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
      <div style={{ marginTop: "100px", marginBottom: "100px" }}>
        <h3><FormattedMessage id="registration.confirmation.title" /></h3>
        <p><FormattedMessage id="registration.confirmation.body1" /></p>
        <p><FormattedMessage id="registration.confirmation.body2" /></p>
        <p><FormattedMessage id="registration.confirmation.time" values={{ seconds: this.state.time }} /></p>
        <Button
          type="submit"
          className="btn btn-reverse"
          style={{ width: "50%", backgroundColor: "#FFB81C" }}
          onClick={this.handleLogin}
        >
          <span className="text-uppercase" style={{ color: "#000000" }}>
            <FormattedMessage id="shared.form.button.login" />
          </span>
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
    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10" />
          <div className="top-container">
            <div className="section">
              <Row>
                <Col xs={0} sm={0} md={0} lg={8} xl={8} />
                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: "center" }} >
                  {confirms.length === 0 ? null : this.renderConfirm()}
                  {!this.state.timer ? <Redirect to="/" /> : null}
                </Col>
                <Col xs={0} sm={0} md={0} lg={8} xl={8} />
              </Row>
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
