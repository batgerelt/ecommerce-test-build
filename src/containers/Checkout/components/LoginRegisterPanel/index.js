/* import React from "react";
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

export default LoginRegisterPanel; */

/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable padded-blocks */
/* eslint-disable react/self-closing-comp */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable react/require-default-props */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Signup, Signin } from "../";

function TabPanel(props) {
  const {
    children,
    value,
    index,
    ...other,
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}


class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
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
      return <Signup {...this.props} {...this} />;
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    const { value } = this.state;
    return (
      <div className="button-navigation">
        <Tabs
          value={value}
          onChange={this.handleChange}
          variant="fullWidth"
          aria-label="full width tabs example"
          className="button-navigation"
        >
          <Tab
            label={<FormattedMessage id="shared.form.button.login" />}
            value={0}
            fullWidth
            icon={<PersonIcon />}
            onClick={event => {
              event.preventDefault();
            }}
          />
          <Tab
            label={<FormattedMessage id="shared.form.button.register" />}
            value={1}
            fullWidth
            icon={<PersonAddIcon />}
            onClick={event => {
              event.preventDefault();
            }}
          />
        </Tabs>
        <SwipeableViews index={value} >
          <TabPanel value={value} index={0}>
            {this.renderLoginForm()}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {this.renderRegisterForm()}
          </TabPanel>
        </SwipeableViews>
      </div >
    );
  }
}

export default Page;
