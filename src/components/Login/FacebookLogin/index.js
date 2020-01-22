import React from "react";
import { injectIntl } from 'react-intl';

class FacebookLogin1 extends React.Component {
  facebookLogin = () => {
    if (!window.FB) return;

    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        window.FB.login(this.facebookLoginHandler, { scope: 'email' });
      }
    });
  }

  facebookLoginHandler = (response) => {
    if (response.status === 'connected') {
      window.FB.api('/me', { fields: 'id,name,email,picture.type(large)' }, (userData) => {
        let result = {
          username: userData.name,
          firstname: null,
          lastname: null,
          phone: null,
          email: userData.email,
          oauthType: "FaceBook",
          oauthId: userData.id,
          imgUrl: userData.picture.data.url,
        };
        this.props.loginSocial(result);
      });
    } else {
      // message.warning("Фэйсбүүктэй холбогдоход алдаа гарлаа.");
    }
  }

  render() {
    const { intl } = this.props;

    return (
      <div onClick={() => this.facebookLogin()} className="btn btn-block btn-social btn-facebook">
        {intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
      </div>
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
    );
  }
}
export default injectIntl(FacebookLogin1);

