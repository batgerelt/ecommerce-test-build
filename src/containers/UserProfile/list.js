/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Avatar, Progress, Upload, Button, Spin, Icon, Row, Col, notification } from "antd";
import { Route, Link, Switch, BrowserRouter as Router } from "react-router-dom";
import { store } from 'react-notifications-component';
import { Notification } from "../../components";
import upload from "../../../src/scss/assets/images/demo/upload.png";
import profile from "../../../src/scss/assets/images/demo/profile.png";
import history from "../../../src/scss/assets/images/demo/history.png";
import wishlist from "../../../src/scss/assets/images/demo/wishlist.png";
import location from "../../../src/scss/assets/images/demo/location.png";
import password from "../../../src/scss/assets/images/demo/password.png";
import store1 from "../../../src/scss/assets/images/demo/store.png";
import logout from "../../../src/scss/assets/svg/sign-out.svg";
import {
  UserProfile,
  UserHistory,
  UserWish,
  UserDelivery,
  UserAddress,
  UserPassword,
} from "./Component";
import style from "./style.less";

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

class List extends React.Component {
  state = {
    loading: false,
    file: [],
    showButton: false,
    imageUrl: {},
  };

  handleLogout = () => {
    this.props.logout();
    this.props.clearLocally();
    this.props.clearUserModelState();
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

  renderProgress = (data) => {
    let info = data;
    let percents = localStorage.getItem("percent");
    percents = (Number(percents) + 1) * 25;
    return (
      <div>
        <Progress className="renderprogress" percent={percents} strokeColor="#feb415" showInfo={false} style={{ fontSize: "16px" }} />
        <span className="rendername"> {percents}%</span>
      </div >
    );
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

  renderImage = () => {
    try {
      const { userInfo } = this.props;
      return (
        <div id="imagePreview" style={{ backgroundImage: `url(${userInfo.info.imgnm === undefined || userInfo.info.imgnm === null ? upload : localStorage.getItem('img')})` }} />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderName(info) {
    const { intl } = this.props;
    let percents = localStorage.getItem("percent");
    percents = (Number(percents) + 1) * 25;
    try {
      return (
        <span
          style={{
            width: "60%",
            marginLeft: "15px",
            marginTop: "5px",
            position: 'absolute',
          }}
        >
          <strong style={{ marginBottom: "-10px" }}>{localStorage.getItem('emartmall_co')}</strong>
          {this.state.showButton ?
            <Button style={{ marginTop: "-5px", marginLeft: "5px", color: "black" }} onClick={this.uploadPick}>{intl.formatMessage({ id: "shared.form.button.save" })}</Button>
            :
            null}
          <p className="text progress-text" style={{ margin: "0px" }}><FormattedMessage id="header.profile.userInfo" /></p>
          <Progress className="renderprogress progress-small" percent={percents} strokeColor="#feb415" showInfo={false} />
          <span className="rendername" style={{ fontSize: "13px" }}> {percents}%</span>
        </span>
      );
    } catch (error) {
      return null;
    }
  }

  render() {
    const { match } = this.props;
    const { pathname } = this.props.location;
    const { imageUrl, showButton, loading } = this.state;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div className="profile-section" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
        <div className="container" style={{ paddingLeft: "5px !important", paddingRight: "5px !important" }}>
          <div className="user-section">
            <div>
              <Row style={{ width: "100%" }} >
                <Col xs={0} sm={0} md={8} lg={7} xl={7}>
                  <div style={{ backgroundColor: "white", borderRadius: "10px", marginRight: "10px" }}>
                    <div className="profile-menu" style={{ padding: "10px" }}>
                      <div className="menu-header">
                        <Upload
                          className={style.avatarupload}
                          accept={".jpg,.png,.jpeg,.gif"}
                          showUploadList={false}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          beforeUpload={beforeUpload}
                          onChange={this.handleChange}
                        >
                          <Spin
                            spinning={loading}
                            indicator={antIcon}
                          >
                            <div className={style.avatarpreview}>
                              {showButton ? <div id="imagePreview" style={{ backgroundImage: `url(${imageUrl})` }} /> : this.props.userInfo !== undefined ? this.renderImage() : null}
                            </div>
                          </Spin>
                        </Upload>
                        {this.props.userInfo === undefined ? null : this.renderName(this.props.userInfo.info)}
                      </div>
                      <ul className="list-unstyled" style={{ marginTop: "20px" }}>
                        <li className={pathname === "/profile" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }} >
                          <Link to={`${match.path}`} className="flex-this">
                            <Avatar size="small" shape="square" src={profile} className="marginRight10" /><span><FormattedMessage id="header.profile.userProfile" /></span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/history" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to={`${match.path}/history`} className="flex-this">
                            <Avatar size="small" shape="square" src={history} className="marginRight10" /><span><FormattedMessage id="header.profile.seenHistory" /></span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/wish" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to={`${match.path}/wish`} className="flex-this">
                            <Avatar size="small" shape="square" src={wishlist} className="marginRight10" /><span><FormattedMessage id="header.profile.savedProducts" /></span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/delivery" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to={`${match.path}/delivery`} className="flex-this">
                            <Avatar size="small" shape="square" src={store1} className="marginRight10" /><span><FormattedMessage id="header.profile.orderHistory" /></span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/address" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to={`${match.path}/address`} className="flex-this">
                            <Avatar size="small" shape="square" src={location} className="marginRight10" /><span><FormattedMessage id="header.profile.deliveryAddress" /></span>
                          </Link>
                        </li>
                        <li className={pathname === "/profile/password" ? "active" : " "} style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to={`${match.path}/password`} className="flex-this">
                            <Avatar size="small" shape="square" src={password} className="marginRight10" /><span><FormattedMessage id="header.profile.changePassword" /></span>
                          </Link>
                        </li>
                        <hr />
                        <li style={{ marginTop: "5px", marginBottom: "5px" }}>
                          <Link to="#" onClick={this.handleLogout}>
                            <Avatar size="small" shape="square" src={logout} className="marginRight10" /><span><FormattedMessage id="header.profile.logout" /></span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={16} lg={17} xl={17} style={{ padding: "0px !important" }}>
                  <Switch>
                    <Route exact path={match.path} component={UserProfile} {...this} />
                    <Route path={`${match.path}/history`} component={UserHistory} {...this} />
                    <Route path={`${match.path}/wish`} component={UserWish} {...this} />
                    <Route path={`${match.path}/delivery`} component={UserDelivery} {...this} />
                    <Route path={`${match.path}/address`} component={UserAddress} {...this} />
                    <Route path={`${match.path}/password`} component={UserPassword} {...this} />
                  </Switch>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(List);
