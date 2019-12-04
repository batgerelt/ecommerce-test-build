/* eslint-disable arrow-body-style */
import React from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

class MainMenu extends React.Component {
  renderMenus = () => {
    const data = this.props && this.props.dataSource;
    const { pathname, search } = this.props.history.location;
    let tmp = data.map((item, index) => {
      return (
        <Button key={index}>
          <li className="list-inline-item">
            <Link to={item.link}>
              <span style={{ color: pathname + search === item.link ? "#FFB81C" : "#FFFFFF" }}>
                {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
              </span>
            </Link>
          </li>
        </Button>
      );
    });
    return tmp;
  }

  render() {
    try {
      return <span className="main-menu-list">{this.renderMenus()}</span>;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(MainMenu);
