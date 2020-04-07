/* eslint-disable react/no-string-refs */
/* eslint-disable func-names */
import React from "react";
import { FormattedMessage } from 'react-intl';

class GoogleLogin extends React.Component {
  componentWillMount() {
    this.googleSDK();
  }

  prepareLoginButton = () => {
    this.auth2.attachClickHandler(
      this.refs.googleLoginBtn,
      {},
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        let param = {
          username: profile.getName(),
          firstname: profile.getName(),
          lastname: profile.getName(),
          phone: null,
          email: profile.getEmail(),
          oauthType: "Gmail",
          oauthId: profile.getId(),
          imgUrl: profile.getImageUrl(),
        };
        this.props.loginSocial(param);
      },
    );
  };

  googleSDK = () => {
    window.googleSDKLoaded = () => {
      window.gapi.load("auth2", () => {
        this.auth2 = window.gapi.auth2.init({
          client_id:
            "845113891404-qlj5hpuro8aivst2veeqhthtbdsjjdhh.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });
        this.prepareLoginButton();
      });
    };

    (function (d, s, id) {
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      let js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "google-jssdk"));
  };

  render() {
    return (
      <button
        className="btn btn-block btn-social btn-gmail"
        ref="googleLoginBtn"
      >
        <FormattedMessage id="shared.form.button.googleLogin" />
      </button>
    );
  }
}

export default GoogleLogin;

