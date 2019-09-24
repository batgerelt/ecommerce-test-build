/* import React from "react";
import { injectIntl } from 'react-intl';
import ReactFacebookLogin from "react-facebook-login";
import { toast } from "react-toastify";

import { SOCIAL_IDS } from "../../../utils/Consts";
import LoginModal from "../LoginModal";

class FacebookLogin extends React.Component {
  handleResponse = (res) => {
    if (res && res.userID) {
      const user = {
        id: res.userID,
        email: res.email,
        firstname: res.name.split(" ")[0],
        lastname: res.name.split(" ").length > 1 ? res.name.split(" ")[1] : "",
        picture: res.picture,
      };

      this.props.onSuccess(user);
    } else {
      this.notify("Холбогдох үед алдаа гарлаа");
    }
  };

  notify = message => toast(message, { autoClose: 5000 });

  render() {
    console.log("facebookLogIn", SOCIAL_IDS.facebook);
    const { intl } = this.props;

    return (
      <ReactFacebookLogin
        appId={SOCIAL_IDS.facebook}
        // autoLoad
        fields="name,email,picture"
        callback={this.handleResponse}
        cssClass="btn btn-block btn-social btn-facebook"
        textButton={intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
      />
    );
  }
}

export default injectIntl(FacebookLogin);
 */
import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { injectIntl } from 'react-intl';
import { SOCIAL_IDS } from "../../../utils/Consts";

export default class FacebookLogin1 extends React.Component {
  state = {
    isLoggedIn: false,
    userID: '',
    name: '',
    email: '',
    picture: '',
  }

  consoleLog = () => {
    const values = {
      email: "ga.ariuka27@gmail.com",
      password: "123456a",
    };
    this.props.login({ body: { ...values } }).then((res) => {
      console.log(res.payload);
    });
  }
  componentClicked = () => console.log('clicked');

  responseFacebook = (response) => {
    console.log(response);
    if (response.name === "Ариунхүслэн") {
      console.log(response.name);
      this.consoleLog();
    }
  };

  render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        <FacebookLogin
          appId={SOCIAL_IDS.facebook}
          autoLoad
          fields="name,email,picture"
          cssClass="btn btn-block btn-social btn-facebook"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
        />
      );
    }
    return (
      <div>{fbContent}</div>
    );
  }
}
