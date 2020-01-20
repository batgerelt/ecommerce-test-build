import React from "react";
import { connect } from "react-redux";
import { message } from "antd";
import { FacebookLogin } from 'react-facebook-login-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { SOCIAL_IDS } from "../../../utils/Consts";

class FacebookLogin1 extends React.Component {
  state = {
    isLoggedIn: false,
  }

  componentClicked = () => this.props.closeLoginModal();

  responseFacebook = (response) => {
    let param = [];
    if (response.status === "unknown") {
      message.warning("Фэйсбүүктэй холбогдоход алдаа гарлаа.");
    }
    if (response && response.userID) {
      param = {
        username: response.name,
        firstname: null,
        lastname: null,
        phone: null,
        email: response.email,
        oauthType: "FaceBook",
        oauthId: response.userID,
        imgUrl: response.picture.data.url,
      };
      this.props.loginSocial(param);
    }
  };
  render() {
    const { intl } = this.props;
    let fbContent;
    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        // <FacebookLogin
        //   isMobile
        //   disableMobileRedirect
        //   appId={SOCIAL_IDS.facebook}
        //   autoLoad={false}
        //   fields="name,email,picture.type(large)"
        //   cssClass="btn btn-block btn-social btn-facebook"
        //   onClick={this.componentClicked}
        //   callback={this.responseFacebook}
        //   textButton={intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
        //   size="metro"
        // />
        <FacebookLogin
          socialId={SOCIAL_IDS.facebook}
          language="mn_MN"
          scope="name,email,picture.type(large)"
          responseHandler={this.responseFacebook}
          xfbml
          fields="name,email,picture.type(large)"
          version="v2.5"
          className="btn btn-block btn-social btn-facebook"
          buttonText={intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
        />
      );
    }
    return (
      <div>{fbContent}</div>
    );
  }
}
export default injectIntl(FacebookLogin1);

