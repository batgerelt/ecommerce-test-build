/* eslint-disable arrow-body-style */
import React from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

class MainMenu extends React.Component {
  handleClick = () => {
    console.log("gagaga");
  }
  renderMenus = () => {
    const data = this.props && this.props.dataSource;
    const { pathname, search } = this.props.history.location;
    let tmp = data.map((item, index) => {
      console.log('item: ', item.link.includes('/e'));
      return (
        <Button key={index}>
          <li className="list-inline-item">
            {
              item.link.includes('/e') ? (
                <Link to={item.link} onClick={e => this.handleClick(e)}>
                  <span style={{ color: pathname + search === item.link ? "#FFB81C" : "#FFFFFF" }}>
                    {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
                  </span>
                </Link>
              )
                :
                (
                  <Link to={item.link}>
                    <span style={{ color: pathname + search === item.link ? "#FFB81C" : "#FFFFFF" }}>
                      {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
                    </span>
                  </Link>
                )
            }
          </li>
        </Button >
      );
    });
    return tmp;
  }

  render() {
    try {
      return <span className="main-menu-list horizontal-scroll">{this.renderMenus()}</span>;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(MainMenu);
