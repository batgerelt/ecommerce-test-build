import React from "react";
import { connect } from "react-redux";
import ReactGoogleLogin from "react-google-login";
import { toast } from "react-toastify";

import { SOCIAL_IDS } from "../../../utils/Consts";

class GoogleLogin extends React.Component {
  handleGoogleLoginResponse = (res) => {
    console.log(res);
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
            Gmail-р нэвтрэх
          </button>
        )}
      />
    );
  }
}

export default GoogleLogin;

// export default connect(
//   null,
//   { setUser },
// )(GoogleLogin);
