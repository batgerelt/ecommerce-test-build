/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Progress, Avatar } from "antd";

// import withCart from "./HOC/withCart";
// import { updateCart } from "../actions/cart";
// import { signOut, showLoginModal } from "../actions/login";

import avatar from "../../scss/assets/images/demo/defaultAvatar.png";

import profile from "../../scss/assets/images/demo/profile.png";
import history from "../../scss/assets/images/demo/history.png";
import wishlist from "../../scss/assets/images/demo/wishlist.png";
import location from "../../scss/assets/images/demo/location.png";
import password from "../../scss/assets/images/demo/password.png";
import store from "../../scss/assets/images/demo/store.png";

class UserButton extends React.Component {
  state = {
    progress: 0,
    pro: false,
  };

  showpro = (e) => {
    this.setState({ pro: !this.state.pro });
  };

  componentDidMount() {
    this.setState({ ...this.props.container });
    this.getUserData();
  }

  handleLoginClick = (e) => {
    e.preventDefault();
    this.props.showLoginModal();
  };

  handleLogoutClick = () => {
    this.props.updateCart({
      products: [],
      totalQty: 0,
      totalPrice: 0,
    });
    this.props.signOut();
  };

  getUserData = async () => {
    let progress = 25;
    if (this.props.user) {
      // await api.customer.findUserData({ id: this.props.user.id }).then((res) => {
      //   if (res.success) {
      //     /* if (res.data.info.imgnm) {
      //       progress = parseInt(progress) + 25;
      //     }
      //     if (res.data.addrs.length > 0) {
      //       progress = parseInt(progress) + 25;
      //     }
      //     if (res.data.card) {
      //       progress = parseInt(progress) + 25;
      //     }
      //     this.setState({ progress: progress }); */
      //   }
      // });
    } else {
      this.setState({ progress: 25 });
    }
  };

  render() {
    const profilemenu = `${this.state.pro ? " open" : ""}`;
    let content = (
      <li className="list-inline-item">
        <Link to="" onClick={this.handleLoginClick}>
          <span className="text-uppercase">Нэвтрэх</span>
        </Link>
      </li>
    );

    if (this.props.isLoggedIn && this.props.user) {
      let user = this.props.user;
      // const { match, user } = this.props;

      content = (
        <li className="list-inline-item user" onClick={this.showpro}>
          <Link to="" className="flex-this">
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
            <span className="">
              {user.firstname
                ? user.lastname
                  ? `${user.firstname} ${user.lastname}`
                  : user.firstname
                : user.email
                ? user.email
                : ""}
            </span>
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
                  <Progress
                    percent={parseInt(this.state.progress)}
                    strokeColor="#feb415"
                    showInfo={false}
                  />
                  <p className="text text-center">
                    <strong>Таны мэдээлэл</strong>
                    <span>{parseInt(this.state.progress)}%</span>
                  </p>
                </div>
                <ul className="list-unstyled">
                  <li>
                    <a href="/userprofile" className="flex-this">
                      <Avatar
                        size="small"
                        src={profile}
                        shape="square"
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Профайл хуудас</span>
                    </a>
                  </li>
                  <li>
                    <a href="/userprofile/history" className="flex-this">
                      <Avatar
                        size="small"
                        src={history}
                        shape="square"
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Таны үзсэн барааны түүх</span>
                    </a>
                  </li>
                  <li>
                    <a href="/userprofile/wishlist" className="flex-this">
                      <Avatar
                        size="small"
                        shape="square"
                        src={wishlist}
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Хадгалсан бараа</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/userprofile/deliveryhistory"
                      className="flex-this"
                    >
                      <Avatar
                        size="small"
                        shape="square"
                        src={store}
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Захиалгын түүх</span>
                    </a>
                  </li>
                  {/* <li>
                    <Link to="/userprofile" className="flex-this">
                      <i
                        className="fa fa-credit-card"
                        aria-hidden="true"
                        style={{ color: "#feb415" }}
                      />
                      <span>ePoint карт</span>
                    </Link>
                  </li> */}
                  <li>
                    <a href="/userprofile/delivery" className="flex-this">
                      <Avatar
                        size="small"
                        shape="square"
                        src={location}
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Хүргэлтийн хаяг</span>
                    </a>
                  </li>
                  <li>
                    <a href="/userprofile/password" className="flex-this">
                      <Avatar
                        size="small"
                        src={password}
                        shape="square"
                        style={{
                          width: "30px",
                        }}
                      />{" "}
                      <span>Нууц үгээ солих</span>
                    </a>
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

    return content;
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
});

export default UserButton;

// export default withCart(
//   connect(
//     mapStateToProps,
//     { updateCart, signOut, showLoginModal },
//   )(UserButton),
// );
