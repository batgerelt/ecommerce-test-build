import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import ReactGoogleLogin from "react-google-login";
import { toast } from "react-toastify";

import { SOCIAL_IDS } from "../../../utils/Consts";

class GoogleLogin extends React.Component {
  handleGoogleLoginResponse = (response) => {
    let param = [];
    if (response && response.profileObj) {
      param = {
        username: response.profileObj.givenName,
        firstname: response.profileObj.givenName,
        lastname: response.profileObj.familyName,
        phone: null,
        email: response.profileObj.email,
        oauthType: "Gmail",
        oauthId: response.profileObj.googleId,
        imgUrl: response.profileObj.imageUrl,
      };
      this.props.loginSocial(param);
    }
  };

  handleGoogleLoginFailure = (err) => {
    console.log(err);
  };

  notify = message => toast(message, { autoClose: 5000 });

  render() {
    return (
      <ReactGoogleLogin
        clientId={SOCIAL_IDS.google}
        onSuccess={this.handleGoogleLoginResponse}
        onFailure={this.handleGoogleLoginFailure}
        render={props => (
          <button
            className="btn btn-block btn-social btn-gmail"
            onClick={props.onClick}
          >
            <FormattedMessage id="shared.form.button.googleLogin" />
          </button>
        )}
      />
    );
  }
}

export default GoogleLogin;

/* eslint-disable react/no-string-refs */
/* eslint-disable func-names */
// import React from "react";
// import { FormattedMessage } from 'react-intl';

// class GoogleLogin extends React.Component {
//   componentDidMount() {
//     this.googleSDK();
//   }

//   prepareLoginButton = () => {
//     this.auth2.attachClickHandler(
//       this.refs.googleLoginBtn,
//       {},
//       (googleUser) => {
//         const profile = googleUser.getBasicProfile();
//         console.log('profile: ', profile);
//         let param = {
//           username: profile.getName(),
//           firstname: profile.getName(),
//           lastname: profile.getName(),
//           phone: null,
//           email: profile.getEmail(),
//           oauthType: "Gmail",
//           oauthId: profile.getId(),
//           imgUrl: profile.getImageUrl(),
//         };
//         this.props.loginSocial(param);
//       },
//       (error) => {
//         alert(JSON.stringify(error));
//       },
//     );
//   };

//   googleSDK = () => {
//     window.googleSDKLoaded = () => {
//       window.gapi.load("auth2", () => {
//         this.auth2 = window.gapi.auth2.init({
//           client_id:
//             "845113891404-qlj5hpuro8aivst2veeqhthtbdsjjdhh.apps.googleusercontent.com",
//           cookiepolicy: "single_host_origin",
//           scope: "profile email",
//         });
//         this.prepareLoginButton();
//       });
//     };

//     (function (d, s, id) {
//       let fjs = d.getElementsByTagName(s)[0];
//       if (d.getElementById(id)) {
//         return;
//       }
//       let js = d.createElement(s);
//       js.id = id;
//       js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
//       fjs.parentNode.insertBefore(js, fjs);
//     }(document, "script", "google-jssdk"));
//   };

//   render() {
//     return (
//       <button
//         className="btn btn-block btn-social btn-gmail"
//         ref="googleLoginBtn"
//       >
//         <FormattedMessage id="shared.form.button.googleLogin" />
//       </button>
//     );
//   }
// }

// export default GoogleLogin;

