/* eslint-disable arrow-body-style */
import React from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  renderMenus = () => {
    const data = this.props && this.props.dataSource;
    const { pathname } = this.props.history.location;
    let tmp = data.map((item, index) => {
      return (
        <li className="list-inline-item" key={index} style={{ textTransform: "uppercase" }}>
          <Link to={item.link}>
            <span style={{ color: pathname === item.link ? "#FFB81C" : "#FFFFFF" }}>
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
