import React from "react";
import { Link } from "react-router-dom";

class UserButton extends React.Component {
  state = {
    progress: 0,
    pro: false,
  };

  handleLogin = () => { this.props.LoginModal.handleLoginModal(); };

  render() {
    const profilemenu = `${this.state.pro ? " open" : ""}`;
    let content = (
      <li className="list-inline-item" onClick={this.handleLogin}>
        <div className="text-uppercase" style={{ cursor: 'default' }}>
          Нэвтрэх
        </div>
      </li>
    );

    return content;
  }
}

export default UserButton;
