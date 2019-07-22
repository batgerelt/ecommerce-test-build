import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { Avatar, Progress } from "antd";
import avatar from "../../scss/assets/images/demo/defaultAvatar.png";
import profile from "../../../src/scss/assets/images/demo/profile.png";
import history from "../../../src/scss/assets/images/demo/history.png";
import wishlist from "../../../src/scss/assets/images/demo/wishlist.png";
import location from "../../../src/scss/assets/images/demo/location.png";
import password from "../../../src/scss/assets/images/demo/password.png";
import store from "../../../src/scss/assets/images/demo/store.png";

class UserButton extends React.Component {
  state = {
    progress: 0,
    pro: false,
    logout: false,
  };

  showpro = () => {
    this.setState({ pro: !this.state.pro });
  };

  handleLogin = () => { this.props.LoginModal.handleLoginModal(); };

  handleLogoutClick = () => {
    this.props.logout();
    this.setState({ logout: !this.state.logout });
    this.props.clearLocally(); // cart-iig hoosolj bgaa heseg
  }

  render() {
    const profilemenu = `${this.state.pro ? " open" : ""}`;
    let content = (
      <li className="list-inline-item" onClick={this.handleLogin}>
        <div className="text-uppercase" style={{ cursor: 'default' }}>
          <FormattedMessage id="auth.login" defaultMessage="Нэвтрэх" />
        </div>
      </li>
    );

    if (localStorage.getItem('auth') !== null) {
      if (JSON.parse(localStorage.getItem('auth')).success) {
        const user = JSON.parse(localStorage.getItem('auth')).data[0].info.customerInfo;
        const realImage = JSON.stringify(process.env.IMAGES + localStorage.getItem('img'));
        content = (
          <li className="list-inline-item user" onClick={this.showpro}>
            <Link to="#" className="flex-this">
              <div className="image-container default">
                <span className="image" style={{ backgroundImage: `url(${user.imgnm === undefined || user.imgnm === null ? avatar : realImage})` }} />
              </div>
              <span className="">{user.firstname ? `${user.firstname}` : user.email ? user.email : ""}</span>
            </Link>
            <div className={`dropdown ${profilemenu}`}>
              <div className="drop-content">
                <div className="profile-menu">
                  <div className="menu-header">
                    <div className="flex-this">
                      <div className="image-container default">
                        <span className="image" style={{ backgroundImage: `url(${user.imgnm === undefined || user.imgnm === null ? avatar : realImage})` }} />
                      </div>
                      <p className="name">
                        {user.firstname
                          ? user.lastname
                            ? `${user.firstname} ${user.lastname}`
                            : user.firstname
                          : user.email
                            ? user.email
                            : ""}
                      </p>
                    </div>
                    <Progress percent={50} strokeColor="#feb415" showInfo={false} />
                    <p className="text text-center">
                      <strong>Таны мэдээлэл</strong>
                      <span>50%</span>
                    </p>
                  </div>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/profile" className="flex-this">
                        <Avatar size="small" src={profile} shape="square" style={{ width: "30px" }} /><span>Профайл хуудас</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/history" className="flex-this">
                        <Avatar size="small" shape="square" src={history} style={{ width: "30px" }} /><span>Үзсэн барааны түүх</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/wish" className="flex-this">
                        <Avatar size="small" shape="square" src={wishlist} style={{ width: "30px" }} /><span>Хадгалсан бараа</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/delivery" className="flex-this">
                        <Avatar size="small" shape="square" src={store} style={{ width: "30px" }} /><span>Захиалгын түүх</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/address" className="flex-this">
                        <Avatar size="small" shape="square" src={location} style={{ width: "30px" }} /><span>Хүргэлтийн хаяг</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/password" className="flex-this">
                        <Avatar size="small" shape="square" src={password} style={{ width: "30px" }} /><span>Нууц үгээ солих</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="text-left" onClick={this.handleLogoutClick}>
                    <button className="btn btn-gray">
                      <i className="fa fa-chevron-left" aria-hidden="true" />
                      <span className="text-uppercase">Гарах</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      }
    }
    return content;
  }
}

export default UserButton;
