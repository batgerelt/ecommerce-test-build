import React from "react";
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
  };

  handleLogin = () => { this.props.LoginModal.handleLoginModal(); };

  handleLogoutClick = () => {
    localStorage.clear();
  }

  render() {
    const profilemenu = `${this.state.pro ? " open" : ""}`;
    let content = (
      <li className="list-inline-item" onClick={this.handleLogin}>
        <div className="text-uppercase" style={{ cursor: 'default' }}>
          Нэвтрэх
        </div>
      </li>
    );
    /* console.log(localStorage.getItem('auth'));
    localStorage.clear();
 */
    /* if (this.props.auth.isLogged) {
      const user = this.props.auth.data[0].info.customerInfo;
      content = (
        <li className="list-inline-item user" onClick={this.showpro}>
          <Link to="#" className="flex-this">
            <div className="image-container default">
              <span className="image" style={{ backgroundImage: `url(${avatar})` }} />
            </div>
            <span className="">{user.firstname ? user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname : user.email ? user.email : ""}</span>
          </Link>
          <div className={`dropdown ${profilemenu}`}>
            <div className="drop-content">
              <div className="profile-menu">
                <div className="menu-header">
                  <div className="flex-this">
                    <div className="image-container default">
                      <span
                        className="image"
                        style={{
                          backgroundImage: `url(${
                            user.picture
                              ? user.picture.data
                                ? user.picture.data.url
                                : user.picture
                              : avatar
                            })`,
                        }}
                      />
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
                  <Progress percent={50} strokeColor="#feb415" status="active" />
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
                    <Link to="#" className="flex-this">
                      <Avatar size="small" shape="square" src={history} style={{ width: "30px" }} /><span>Таны үзсэн барааны түүх</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="flex-this">
                      <Avatar size="small" shape="square" src={wishlist} style={{ width: "30px" }} /><span>Хадгалсан бараа</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="flex-this">
                      <Avatar size="small" shape="square" src={store} style={{ width: "30px" }} /><span>Захиалгын түүх</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="flex-this">
                      <Avatar size="small" shape="square" src={location} style={{ width: "30px" }} /><span>Хүргэлтийн хаяг</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="flex-this">
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
    } */

    return content;
  }
}

export default UserButton;
