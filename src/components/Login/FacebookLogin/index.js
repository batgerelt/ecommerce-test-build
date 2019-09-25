import React from "react";
import { connect } from "react-redux";
import FacebookLogin from 'react-facebook-login';
import { injectIntl, FormattedMessage } from 'react-intl';
import { SOCIAL_IDS } from "../../../utils/Consts";

class FacebookLogin1 extends React.Component {
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
export default injectIntl(FacebookLogin1);
