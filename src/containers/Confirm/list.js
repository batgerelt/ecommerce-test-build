/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { message, Button } from "antd";
import logo from "../../../src/scss/assets/images/demo/logo.jpg";

import { intl } from '../../components/IntlGlobalProvider';

class List extends React.Component {
  state = {
    message: [],
    time: 1000,
    timer: true,
    second: true,
  };

  handleLogin = () => {
    this.setState({ second: false });
    this.props.LoginModal.handleLoginModal();
  }

  componentWillMount() {
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

  render() {
    const { staticinfo } = this.props;
    return (
      <div className="top-container">
        {
          !this.state.timer ?
            <Redirect to="/" />
            :
            <div className="section">
              <div className="container pad10" />
              <div className="top-container">
                <div className="section">
                  <div className="col-md-12">
                    <center>
                      <div>
                        <div
                          className="logo"
                          style={{ width: "15%", marginBottom: "50px" }}
                        >
                          {
                            staticinfo !== null ? <img style={{ width: "100%" }} alt="logo" src={process.env.IMAGE + staticinfo.logopath} /> : null
                          }
                        </div>
                        <h3><FormattedMessage id="registration.confirmation.title" /></h3>
                        <p><FormattedMessage id="registration.confirmation.body1" /></p>
                        <p><FormattedMessage id="registration.confirmation.body2" /></p>
                        <p>
                          <FormattedMessage
                            id="registration.confirmation.time"
                            values={{
                              seconds: this.state.time,
                            }}
                          />
                        </p>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="btn btn-block btn-login text-uppercase"
                          onClick={this.handleLogin}
                          style={{ width: "200px" }}
                        >
                          <FormattedMessage id="shared.form.button.login" />
                        </Button>
                      </div>
                    </center>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default List;
