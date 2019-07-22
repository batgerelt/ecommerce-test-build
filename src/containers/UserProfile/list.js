/* eslint-disable react/no-danger */
import React from "react";
import { Avatar, Progress, Upload, message } from "antd";
import { Route, Link, Switch, BrowserRouter as Router } from "react-router-dom";
import avatar from "../../../src/scss/assets/images/demo/defaultAvatar.png";
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

class List extends React.Component {
  handleChange = ({ fileList }) => {
    const data = new FormData();
    const isfiles = true;
    data.append('uploadimage', fileList[0].originFileObj, fileList[0].name);
    this.props.userPic({
      body: data,
      isfiles,
    }).then((res) => {
      if (res.payload.success) {
        this.props.getCustomer({ custid: this.props.data[0].info.customerInfo.id }).then((res) => {
          if (res.payload.success) {
            localStorage.setItem('img', res.payload.data.info.imgnm);
          }
        });
      }
    });
  };
  renderName(info) {
    return <strong><span style={{ padding: '21px', position: 'absolute' }}>{info.firstname} {info.lastname}</span></strong>;
  }

  handleLogout = () => {
    this.props.clearProducts().then(res => console.log(res));
  }

  renderImage = () => {
    try {
      const { userInfo } = this.props;
      const realImage = JSON.stringify(process.env.IMAGES + userInfo.info.imgnm);
      return (
        <div id="imagePreview" style={{ backgroundImage: `url(${userInfo.info.imgnm === undefined || userInfo.info.imgnm === null ? upload : realImage})` }} />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    const { match } = this.props;
    match.path = "/profile";
    return (
      <div className="section section-gray">
        <div className="container">
          <div className="user-section">
            <div className="user-section-container">
              <div className="row">
                <div className="col-md-4 d-none d-md-block">
                  <div className="profile-menu">
                    <div className="menu-header">
                      <Upload className={style.avatarupload} accept={".jpg,.png,.jpeg,.gif"} action="//jsonplaceholder.typicode.com/posts/" showUploadList={false} onChange={this.handleChange}>
                        <div className={style.avatarpreview}>
                          {this.props.userInfo === undefined ? null : this.renderImage()}
                        </div>
                      </Upload>
                      {this.props.userInfo === undefined ? null : this.renderName(this.props.userInfo.info)}
                      <p className="text text-right" style={{ marginBottom: "-3px", marginTop: "-12px" }} >Таны мэдээлэл</p>
                      <div>
                        <Progress percent={50} strokeColor="#feb415" showInfo={false} style={{ width: "78%", fontSize: "16px" }} />
                        <span>50% / 100%</span>
                      </div>
                    </div>
                    <ul className="list-unstyled" style={{ marginTop: "20px" }}>
                      <li>
                        <Link to={`${match.path}`} className="flex-this">
                          <Avatar size="small" shape="square" src={profile} className="marginRight10" /><span>Профайл хуудас</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`${match.path}/history`} className="flex-this">
                          <Avatar size="small" shape="square" src={history} className="marginRight10" /><span>Үзсэн барааны түүх</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`${match.path}/wish`} className="flex-this">
                          <Avatar size="small" shape="square" src={wishlist} className="marginRight10" /><span>Хадгалсан бараа</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`${match.path}/delivery`} className="flex-this">
                          <Avatar size="small" shape="square" src={store} className="marginRight10" /><span>Захиалгын түүх</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`${match.path}/address`} className="flex-this">
                          <Avatar size="small" shape="square" src={location} className="marginRight10" /><span>Хүргэлтийн хаяг</span>
                        </Link>
                      </li>
                      <li>
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
