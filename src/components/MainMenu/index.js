/* eslint-disable arrow-body-style */
import React from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  state = {
    pathname: this.props.history.location.pathname,
  }

  handleMenu = () => {
    this.setState({ pathname: this.props.history.location.pathname });
  }

  renderMenus = () => {
    const data = this.props && this.props.dataSource;
    const { pathname } = this.state;
    let tmp = data.map((item, index) => {
      return (
        <li className="list-inline-item" key={index} onClick={this.handleMenu}>
          <Link to={item.link}>
            <span style={{ color: pathname === item.link ? "#fffff" : "#fffff" }}>
              {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
            </span>
          </Link>
        </li>
      );
    });
    return tmp;
  }

  render() {
    try {
      return <span>{this.renderMenus()}</span>;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(MainMenu);
