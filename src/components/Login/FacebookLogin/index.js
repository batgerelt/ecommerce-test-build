import React from "react";
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
    const { intl } = this.props;

    return (
      <ReactFacebookLogin
        appId={SOCIAL_IDS.facebook}
        // autoLoad
        fields="name,email,picture"
        callback={this.handleResponse}
        cssClass="btn btn-block btn-social btn-facebook"
        textButton={intl.formatMessage({ id: "loginModal.form.button.facebookLogin" })}
      />
    );
  }
}

export default injectIntl(FacebookLogin);
