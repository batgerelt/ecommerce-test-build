/* eslint-disable react/no-danger */
import React from "react";
import { Avatar, Progress, Upload, Button } from "antd";
import { Route, Link, Switch, BrowserRouter as Router } from "react-router-dom";
// import avatar from "../../../src/scss/assets/images/demo/defaultAvatar.png";
import upload from "../../../src/scss/assets/images/demo/upload.png";
import profile from "../../../src/scss/assets/images/demo/profile.png";
import history from "../../../src/scss/assets/images/demo/history.png";
import wishlist from "../../../src/scss/assets/images/demo/wishlist.png";
import location from "../../../src/scss/assets/images/demo/location.png";
import password from "../../../src/scss/assets/images/demo/password.png";
import store from "../../../src/scss/assets/images/demo/store.png";
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
  }

  renderProgress = (data) => {
    const info = data;
    let percents = (Number(info.cstatus) + 1) * 25;
    return (
      <div>
        <Progress percent={percents} strokeColor="#feb415" showInfo={false} style={{ width: "75%", fontSize: "16px" }} />
        <span>{percents}% / 100%</span>
      </div>
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
        const realImage = JSON.stringify(process.env.IMAGES + response.payload.data);
        localStorage.setItem('img', realImage);
        this.props.getCustomer().then((res) => {
          if (res.payload.success) {
            localStorage.setItem('next', JSON.stringify(res.payload.data.info));
            this.setState({ showButton: false });
          }
        });
      }
    });
  }

  renderImage = () => {
    try {
      const { userInfo } = this.props;
      const realImage = localStorage.getItem('img');
      return (
        <div id="imagePreview" style={{ backgroundImage: `url(${userInfo.info.imgnm === undefined || userInfo.info.imgnm === null ? upload : realImage})` }} />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderName(info) {
    return <strong><span style={{ marginLeft: "15px", marginTop: "15px", position: 'absolute' }}>{info.lastname} {info.firstname}{this.state.showButton ? <Button style={{ marginTop: "-5px", marginLeft: "5px" }} onClick={this.uploadPick}>Хадгалах</Button> : null}</span></strong>;
  }

  render() {
    const { match } = this.props;
    const { pathname } = this.props.location;
    const { imageUrl, showButton } = this.state;
    return (
      <div className="section section-gray">
        <div className="container">
          <div className="user-section">
            <div className="user-section-container">
              <div className="row">
                <div className="col-md-4 d-none d-md-block">
                  <div className="profile-menu">
                    <div className="menu-header">
                      <Upload
                        className={style.avatarupload}
                        accept={".jpg,.png,.jpeg,.gif"}
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        onChange={this.handleChange}
                      >
                        <div className={style.avatarpreview}>
                          {showButton ? <div id="imagePreview" style={{ backgroundImage: `url(${imageUrl})` }} /> : this.props.userInfo !== undefined ? this.renderImage() : null}
                        </div>
                      </Upload>
                      {this.props.userInfo === undefined ? null : this.renderName(this.props.userInfo.info)}
                      <p className="text text-right" style={{ marginBottom: "-3px", marginTop: "-13px" }} >Таны мэдээлэл</p>
                      <div>
                        {this.props.userInfo === undefined ? null : this.renderProgress(this.props.userInfo.info)}
                      </div>
                    </div>
                    <ul className="list-unstyled" style={{ marginTop: "20px" }}>
                      <li className={pathname === "/profile" ? "active" : " "} >
                        <Link to={`${match.path}`} className="flex-this">
                          <Avatar size="small" shape="square" src={profile} className="marginRight10" /><span>Профайл хуудас</span>
                        </Link>
                      </li>
                      <li className={pathname === "/profile/history" ? "active" : " "}>
                        <Link to={`${match.path}/history`} className="flex-this">
                          <Avatar size="small" shape="square" src={history} className="marginRight10" /><span>Үзсэн барааны түүх</span>
                        </Link>
                      </li>
                      <li className={pathname === "/profile/wish" ? "active" : " "}>
                        <Link to={`${match.path}/wish`} className="flex-this">
                          <Avatar size="small" shape="square" src={wishlist} className="marginRight10" /><span>Хадгалсан бараа</span>
                        </Link>
                      </li>
                      <li className={pathname === "/profile/delivery" ? "active" : " "} >
                        <Link to={`${match.path}/delivery`} className="flex-this">
                          <Avatar size="small" shape="square" src={store} className="marginRight10" /><span>Захиалгын түүх</span>
                        </Link>
                      </li>
                      <li className={pathname === "/profile/address" ? "active" : " "}>
                        <Link to={`${match.path}/address`} className="flex-this">
                          <Avatar size="small" shape="square" src={location} className="marginRight10" /><span>Хүргэлтийн хаяг</span>
                        </Link>
                      </li>
                      <li className={pathname === "/profile/password" ? "active" : " "}>
                        <Link to={`${match.path}/password`} className="flex-this">
                          <Avatar size="small" shape="square" src={password} className="marginRight10" /><span>Нууц үгээ солих</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Link to="#" className="btn btn-gray" onClick={this.handleLogout}>
                    <i className="fa fa-chevron-left" /><span>Гарах</span>
                  </Link>
                </div>

                <Switch>
                  <Route exact path={match.path} component={UserProfile} {...this} />
                  <Route path={`${match.path}/history`} component={UserHistory} {...this} />
                  <Route path={`${match.path}/wish`} component={UserWish} {...this} />
                  <Route path={`${match.path}/delivery`} component={UserDelivery} {...this} />
                  <Route path={`${match.path}/address`} component={UserAddress} {...this} />
                  <Route path={`${match.path}/password`} component={UserPassword} {...this} />
                </Switch>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
