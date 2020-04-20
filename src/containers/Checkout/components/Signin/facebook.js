/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React from "react";
import { Button } from "antd";
import { injectIntl, FormattedMessage } from 'react-intl';

import { store } from 'react-notifications-component';
import { Notification } from "../../../../components";

class FacebookLogin1 extends React.Component {
  loginSocial = (param) => {
    this.props.ouathLog({ body: { ...param } }).then(async (res) => {
      this.loggedData(res);
      if (res.payload.success) {
        this.setState({ confirm: this.state.direct });
        await this.props.getUserInfo();
        await this.props.getSystemLocation();
      }
    });
  }

  // eslint-disable-next-line consistent-return
  loggedData = (r) => {
    const { intl } = this.props;
    if (r.payload.success) {
      store.addNotification({
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
        content: <Notification type="success" text={intl.formatMessage({ id: "loginModal.info.success" })} />,
      });
    } else {
      if (r.payload.code) {
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification type="warning" text={intl.formatMessage({ id: r.payload.code })} />,
        });
      }
      return null;
    }
    if (r.payload.data[0].info.customerInfo.imgnm !== null) {
      let realImage = "";
      let realImage1 = r.payload.data[0].info.customerInfo.imgnm;
      if (realImage1.slice(0, 5) === "https") {
        realImage = r.payload.data[0].info.customerInfo.imgnm;
      } else {
        realImage = JSON.stringify(process.env.IMAGES + r.payload.data[0].info.customerInfo.imgnm);
      }
      localStorage.setItem('img', realImage);
    } else {
      localStorage.setItem('img', null);
    }
    localStorage.setItem('auth', JSON.stringify(r.payload));
    localStorage.setItem('percent', (Number(r.payload.data[0].info.customerInfo.cstatus) + 1) * 25);
    localStorage.setItem('emartmall_co', r.payload.data[0].info.customerInfo.firstname);
    localStorage.setItem('emartmall_token', r.payload.data[0].info.access_token);
    // eslint-disable-next-line consistent-return
    this.props.getUserInfo().then(async (res) => {
      if (res.payload.success) {
        if (res.payload.data.main !== null) {
          this.props.getDistrictLocation({ id: res.payload.data.main.provinceid });
          this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
        }
        let { products } = this.props;
        products = products.map(prod => ({
          skucd: prod.skucd,
          qty: prod.qty,
        }));
        let result = await this.props.increaseProductsByQtyRemotely({
          iscart: 0,
          body: products,
        });
        if (!result.payload.success) {
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
          });
        }
        this.props.getProducts().then((res) => {
          let resCount = 0;
          let prodCount = 0;
          res.payload.data.map((item) => {
            resCount += item.qty;
          });
          products.map((item) => {
            prodCount += item.qty;
          });
          let k = res.payload.data.length - products.length;
          if (resCount !== prodCount) {
            this.props.history.push("/cart");
          } else {
            this.props.callback("2");
          }

          // Админ талаас онцгой санал авах барааны мэдээллийг авах хүсэлт
          this.props.getCheckGift().then((res) => {
            console.log('res: ', res);
            res.payload.data.length !== 0 ? this.props.history.push("/cart") : null;
          });
        });
      } else {
        console.log("error: ", res.payload);
      }
    }).catch((err) => {
      console.log('error: ', err);
    });
    this.props.getSystemLocation({});
  }

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
        this.loginSocial(result);
      });
    }
  }

  render() {
    const { intl } = this.props;
    return (
      <button onClick={() => this.facebookLogin()} className="btn btn-block btn-social btn-facebook">
        {intl.formatMessage({ id: "shared.form.button.facebookLogin" })}
      </button>
    );
  }
}
export default injectIntl(FacebookLogin1);

