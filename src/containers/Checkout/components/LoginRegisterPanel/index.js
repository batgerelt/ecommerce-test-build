/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { FormattedMessage } from 'react-intl';
import { Tabs } from "antd";
import { Signup, Signin } from "../";

const TabPane = Tabs.TabPane;
class LoginRegisterPanel extends React.Component {
  state = {
    loading: false,
    defaultActiveKey: 1,
    collapse: false,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() {
    this.props.onRef(this);
  }

  changeTab = (e) => {
    this.setState({ defaultActiveKey: e });
  };

  renderLoginForm = () => {
    try {
      return <Signin {...this.props} {...this} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderRegisterForm = () => {
    try {
      return <Signup {...this.props} />;
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <Tabs
        onChange={this.changeTab}
        defaultActiveKey={"1"}
        activeKey={this.state.defaultActiveKey.toString()}
        className="checkout-reg-tab"
      >
        <TabPane
          tab={
            <div className="flex-this center">
              <img
                alt="icon"
                width="40px"
                height="40px"
                src={require("../../../../scss/assets/images/demo/login.svg")}
              />
              <p className="text">
                <strong><FormattedMessage id="shared.form.button.login" /></strong>
              </p>
            </div>
          }
          key={1}
        >
          <div className="content-container">
            {this.renderLoginForm()}
          </div>
        </TabPane>
        <TabPane
          tab={
            <div className="flex-this center">
              <img
                alt="icon"
                width="40px"
                height="40px"
                src={require("../../../../scss/assets/images/demo/user.svg")}
              />
              <p className="text">
                <strong><FormattedMessage id="shared.form.button.register" /></strong>
              </p>
            </div>
          }
          key={2}
        >
          <div className="content-container">
            {this.renderRegisterForm()}
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

export default LoginRegisterPanel;
