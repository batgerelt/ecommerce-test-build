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

  componentClicked = () => console.log('clicked');

  responseFacebook = (response) => {
    if (response && response.userID) {
      const user = {
        id: response.userID,
        email: response.email,
        firstname: response.name.split(" ")[0],
        lastname: response.name.split(" ").length > 1 ? response.name.split(" ")[1] : "",
        picture: response.picture,
      };
      console.log("user", user);
    }
  };

  render() {
    const { intl } = this.props;
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
          textButton={intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
        />
      );
    }
    return (
      <div>{fbContent}</div>
    );
  }
}
