import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import ReactGoogleLogin from "react-google-login";
import { toast } from "react-toastify";

import { SOCIAL_IDS } from "../../../utils/Consts";

class GoogleLogin extends React.Component {
  handleGoogleLoginResponse = (response) => {
    if (response && response.profileObj) {
      const user = {
        id: response.profileObj.googleId,
        email: response.profileObj.email,
        firstname: response.profileObj.name,
        lastname: response.profileObj.name,
        picture: response.profileObj.imageUrl,
      };
      console.log("user", user);
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
