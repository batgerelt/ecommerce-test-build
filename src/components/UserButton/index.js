import React from "react";
import * as jwtDecode from 'jwt-decode';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import { Avatar, Progress, Icon, Button, Upload, Spin, message, notification } from "antd";
import ButtonGoogle from "@material-ui/core/Button";
import { store } from 'react-notifications-component';
import { Notification } from "../";
import avatar from "../../scss/assets/images/demo/defaultAvatar.png";
import upload from "../../scss/assets/images/demo/upload.png";
import profile from "../../../src/scss/assets/images/demo/profile.png";
import history from "../../../src/scss/assets/images/demo/history.png";
import wishlist from "../../../src/scss/assets/images/demo/wishlist.png";
import location from "../../../src/scss/assets/images/demo/location.png";
import password from "../../../src/scss/assets/images/demo/password.png";
import store2 from "../../../src/scss/assets/images/demo/store.png";
import crossImage from "../../scss/assets/svg/error.svg";
import style from "./style.less";
import profile1 from "../../scss/assets/svg/profile.svg";
import history1 from "../../scss/assets/svg/history.svg";
import wishlist1 from "../../scss/assets/svg/wishlist.svg";
import store1 from "../../scss/assets/svg/store.svg";
import location1 from "../../scss/assets/svg/location.svg";
import password1 from "../../scss/assets/svg/password.svg";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    store.addNotification({
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: false,
      },
      content: <Notification type="warning" text="5MB-ээс бага хэмжээтэй зураг оруулна уу" />,
    });
  }
  return isLt2M;
}

class UserButton extends React.Component {
  state = {
    progress: 0,
    pro: false,
    logout: false,
    visible: false,
    loading: false,
    file: [],
    showButton: false,
    imageUrl: {},
  };

  showpro = () => {
    this.setState({ visible: !this.state.visible });
  };

  handleLogin = () => { this.props.LoginModal.handleLoginModal(); };

  handleLogoutClick = () => {
    this.setState({ visible: false });
    this.props.logout();
    this.props.clearLocally(); // cart-iig hoosolj bgaa heseg
    this.props.clearUserModelState();
    this.props.clearDetailModelState();
    this.props.clearProfileModalState();
    if (localStorage.getItem('auth') === null) {
      const { intl } = this.props;
      store.addNotification({
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
        content: <Notification type="success" text={intl.formatMessage({ id: "userButton.info.success" })} />,
      });
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ file: info.file, showButton: true });
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  uploadPick = () => {
    const { file } = this.state;
    const data = new FormData();
    const isfiles = true;
    data.append('uploadimage', file.originFileObj, file.name);
    this.props.userPic({
      body: data,
      isfiles,
    }).then((response) => {
      if (response.payload.success) {
        let realImage = JSON.stringify(process.env.IMAGES + response.payload.data);
        localStorage.setItem('img', realImage);
        this.props.getCustomer().then((res) => {
          if (res.payload.success) {
            localStorage.setItem('percent', res.payload.data.info.cstatus);
            this.setState({ showButton: false });
          }
        });
      }
    });
  }

  handleClose = () => { this.setState({ visible: false }); }

  renderProgress() {
    const intl = this.props;
    let percents = (Number(localStorage.getItem('percent')) + 1) * 25;
    return (
      <div style={{ width: "230px" }}>
        <Progress percent={percents} strokeColor="#feb415" showInfo={false} />
        <p className="text text-center">
          <strong style={{ color: "white" }}>
            <FormattedMessage id="header.profile.userInfo" />
          </strong>
          <span style={{ color: "white" }}>{percents}%</span>
        </p>
      </div>
    );
  }

  renderProgress1() {
    let percents = (Number(localStorage.getItem('percent')) + 1) * 25;
    return (
      <div>
        <Progress percent={percents} strokeColor="#feb415" showInfo={false} />
        <p className="text text-center">
          <strong><FormattedMessage id="header.profile.userInfo" /></strong>
          <span>{percents}%</span>
        </p>
      </div>
    );
  }

  renderImage = () => {
    try {
      return (
        <div id="imagePreview" style={{ backgroundImage: `url(${localStorage.getItem('img')})` }} />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  handleLoginhandleLogin = () => {
    const { pathname } = this.props.location;
    if (pathname === "/checkout") {
      console.log("checkoutLogin: ", this.props.checkoutLogin);
    } else {
      this.handleLogin();
    }
  }

  render() {
    const { pathname } = this.props.location;
    const {
      imageUrl,
      showButton,
      loading,
      visible,
    } = this.state;
    const { intl } = this.props;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const profilemenu = `${this.state.pro ? " open" : ""}`;
    let content = (
      <li className="list-inline-item login-button-material" onClick={this.handleLoginhandleLogin}>
        <ButtonGoogle>
          <div className="text-uppercase" style={{ cursor: 'default' }}>
            <FormattedMessage id="header.profile.text" />
          </div>
        </ButtonGoogle>
      </li>
    );
    if (localStorage.getItem('auth') !== null) {
      if (JSON.parse(localStorage.getItem('auth')).success) {
        content = (
          <li className="list-inline-item user">
            <Link to="#" className="" onClick={this.showpro}>
              <div className="image-container default">
                <span className="image" style={{ backgroundImage: `url(${localStorage.getItem('img') === "null" ? avatar : localStorage.getItem('img')})` }} />
              </div>
              <span><strong>{localStorage.getItem('emartmall_co') === null ? " " : localStorage.getItem('emartmall_co')}</strong></span>
            </Link>
            {/* Desktop */}
            <div className={`dropdown ${visible ? ' open' : ''}`} >
              <div className="drop-content">
                <div className="profile-menu" >
                  <div className="menu-header" style={{ display: "none" }}>
                    <div className="flex-this">
                      <div className="image-container default">
                        <span className="image" style={{ backgroundImage: `url(${localStorage.getItem('img') === "null" ? avatar : localStorage.getItem('img')})` }} />
                      </div>
                      <p className="name">
                        {localStorage.getItem('emartmall_co') === null ? " " : localStorage.getItem('emartmall_co')}
                      </p>
                    </div>
                    {this.renderProgress1()}
                  </div>
                  <ul className="list-unstyled">
                    <li onClick={this.showpro}>
                      <Link to="/profile" className="flex-this">
                        <Avatar size="small" src={profile} shape="square" style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.userProfile" />
                        </span>
                      </Link>
                    </li>
                    <li onClick={this.showpro}>
                      <Link to="/profile/history" className="flex-this">
                        <Avatar size="small" shape="square" src={history} style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.seenHistory" />
                        </span>
                      </Link>
                    </li>
                    <li onClick={this.showpro}>
                      <Link to="/profile/wish" className="flex-this">
                        <Avatar size="small" shape="square" src={wishlist} style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.savedProducts" />
                        </span>
                      </Link>
                    </li>
                    <li onClick={this.showpro}>
                      <Link to="/profile/delivery" className="flex-this">
                        <Avatar size="small" shape="square" src={store2} style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.orderHistory" />
                        </span>
                      </Link>
                    </li>
                    <li onClick={this.showpro}>
                      <Link to="/profile/address" className="flex-this">
                        <Avatar size="small" shape="square" src={location} style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.deliveryAddress" />
                        </span>
                      </Link>
                    </li>
                    <li onClick={this.showpro}>
                      <Link to="/profile/password" className="flex-this">
                        <Avatar size="small" shape="square" src={password} style={{ width: "35px" }} />
                        <span>
                          <FormattedMessage id="header.profile.changePassword" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                  <div className="text-right" onClick={this.handleLogoutClick}>
                    <button className="btn btn-gray" style={{ width: "100%" }}>
                      <span className="text-uppercase">
                        <FormattedMessage id="header.profile.logout" />{" "}
                        <IconFont type="icon-tuichu" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile left panel */}
            <div className={`mobile-menu-container ${visible ? ' activated' : ''}`}>
              <div className={`fixed-mobile-menu ${visible ? ' activated' : ''}`}>
                <div className="d-none single">
                  <ul className="list-unstyled flex-this flex-space top-1">
                    <li className="list-inline-item d-none">
                      <div className="e-phone">
                        <i className="fa fa-phone" aria-hidden="true" style={{ color: '#ededed' }} />
                        <strong style={{ color: '#ededed', paddingLeft: 10 }}>9947-2882</strong>
                      </div>
                    </li>
                    <li className="list-inline-item language">
                      <form>
                        <select className="custom-select" defaultValue="0">
                          <option value="0">МОН</option>
                          <option value="1">ENG</option>
                        </select>
                      </form>
                    </li>
                    <li className="list-inline-item" style={{ marginLeft: "80%" }} onClick={this.handleClose}>
                      <button className="button buttonBlack">
                        <img
                          src={crossImage}
                          alt="cross"
                          height="25px"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  </ul>
                  <ul className="list-unstyled flex-this flex-space top-2">
                    <li className="list-inline-item">
                      <div className="flex-this user-btn user">
                        <Upload
                          className={style.avatarupload}
                          accept={".jpg,.png,.jpeg,.gif"}
                          showUploadList={false}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          beforeUpload={beforeUpload}
                          onChange={this.handleChange}
                        >
                          <Spin
                            style={{ backgroundColor: "none" }}
                            spinning={loading}
                            indicator={antIcon}
                          >
                            <div className={style.avatarpreview}>
                              {showButton ? <div id="imagePreview" style={{ backgroundImage: `url(${imageUrl})` }} /> : this.renderImage(localStorage.getItem('emartmall_co'))}
                            </div>
                          </Spin>
                        </Upload>
                        <span style={{ color: "white" }}>{localStorage.getItem('emartmall_co') === null ? " " : localStorage.getItem('emartmall_co')}</span>
                        {this.state.showButton ? <Button style={{ marginLeft: "10px", padding: "5px 5px 5px 5px" }} onClick={this.uploadPick}><p style={{ marginBottom: "0px", color: "black" }}>{intl.formatMessage({ id: "shared.form.button.save" })}</p></Button> : null}
                      </div>
                      {this.renderProgress()}
                    </li>
                  </ul>
                  <div className="profile-menu" style={{ backgroundColor: "#262a32" }}>
                    <div className="menu-header">
                      <ul className="list-unstyled">
                        <li className={pathname === "/profile" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile" className="flex-this">
                            <Avatar size="small" shape="square" src={profile1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.userProfile" />
                            </span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/history" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile/history" className="flex-this">
                            <Avatar size="small" shape="square" src={history1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.seenHistory" />
                            </span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/wish" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile/wish" className="flex-this">
                            <Avatar size="small" shape="square" src={wishlist1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.savedProducts" />
                            </span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/delivery" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile/delivery" className="flex-this">
                            <Avatar size="small" shape="square" src={store1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.orderHistory" />
                            </span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/address" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile/address" className="flex-this">
                            <Avatar size="small" shape="square" src={location1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.deliveryAddress" />
                            </span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/password" ? "active" : " "} onClick={this.handleClose}>
                          <Link to="/profile/password" className="flex-this">
                            <Avatar size="small" shape="square" src={password1} style={{ width: "35px" }} />
                            <span style={{ color: "white" }}>
                              <FormattedMessage id="header.profile.changePassword" />
                            </span>
                          </Link>
                        </li>
                      </ul>
                      <div className="text-right" onClick={this.handleLogoutClick}>
                        <ButtonGoogle className="btn" style={{ border: "1px solid white", color: "white", width: "100%" }}>
                          <span className="text-uppercase">
                            <FormattedMessage id="header.profile.logout" />{" "}
                            <IconFont type="icon-tuichu" />
                          </span>
                        </ButtonGoogle>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`fixed-left-side ${visible ? ' activated' : ''}`} style={{ width: "100%", height: "100%" }} onClick={this.showpro} />
            </div>
          </li>
        );
      }
    }
    return content;
  }
}

export default injectIntl(UserButton);
