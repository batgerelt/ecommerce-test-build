/* eslint-disable func-names */
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

import crossImage from "../../scss/assets/svg/error.svg";

class MobileMenu extends React.Component {
  state = {
    visible: false,
    logInVisible: false,
    SingUpVisible: false,
    openKeys: ["sub1"],
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleOpen = () => { this.setState({ visible: true }); }
  handleClose = () => { this.setState({ visible: false }); }

  rootSubmenuKeys = ["sub1", "sub2", "sub4"];
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1,
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  renderHeader = () => {
    try {
      const { staticinfo } = this.props.staticcontent;

      return (
        <div className="single">
          <ul className="list-unstyled flex-this flex-space top-1">
            <li className="list-inline-item">
              <div className="e-phone">
                <i className="fa fa-phone" aria-hidden="true" style={{ color: '#ededed' }} />
                <strong style={{ color: '#ededed', paddingLeft: 10 }}>{staticinfo.phone}</strong>
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
            <li className="list-inline-item" onClick={this.handleClose}>
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
            <li className="list-inline-item notification">
              <Link to="#">
                <i className="fa fa-bell" aria-hidden="true" />
                <span>5</span>
              </Link>
            </li>
            <li className="list-inline-item">
              <div onClick={this.showLogInModal} style={{ display: 'flex', alignItems: 'center' }}>
                <span className="text-uppercase" >Нэвтрэх</span>
              </div>
            </li>
          </ul>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  renderContent = () => {
    try {
      const { mainmenu } = this.props.menu;

      return (
        <div className="single top-3">
          <ul className="list-unstyled flex-this flex-wrap">
            {
              mainmenu.map((item, index) => (
                <li key={index}>
                  <Link to={item.link}>
                    <span>{item.menunm}</span>
                  </Link>
                </li>
                ))
            }
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderMenu = () => {
    try {
      const { categorymenu } = this.props.category;
      const root = [];

      categorymenu.forEach((entry) => {
        if (entry.parentid === 0) {
          entry.children = [];
          root.push(entry);
        }

        root.forEach((ent) => {
          if (ent.id === entry.parentid) {
            ent.children.push(entry);
          }
        });
      });

      let toggleCategory = root.map((item, index) => (
        <Menu.SubMenu
          key={index}
          title={
            <Link to={item.route} style={{ color: "#999" }}>
              <span>{item.name}</span>
            </Link>
            }
        >
          {item.children &&
              item.children.map(function (it, ind) {
                return (
                  <Menu.Item key={ind} style={{ color: "white" }}>
                    <Link to={it.route} onClick={() => this.togglePopup}>
                      {it.name}
                    </Link>
                  </Menu.Item>
                );
              })}
        </Menu.SubMenu>
      ));

      return (
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          theme="dark"
          style={{ width: 256, backgroundColor: "transparent" }}
        >
          {toggleCategory}
        </Menu>
      );
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    const { visible } = this.state;

    return (
      <div className={`mobile-menu-container ${visible ? ' activated' : ''}`} onClick={this.handleClose} >
        <div className={`fixed-mobile-menu ${visible ? ' activated' : ''}`}>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}

export default MobileMenu;

