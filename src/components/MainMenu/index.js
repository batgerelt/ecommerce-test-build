/**
 * @author B.Batgerelt ¯\_(ツ)_/¯
 * @email batgereltb@gmail.com
 * @desc [Emartmall desktop menu component]
 */
import React, { useState } from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

// Menu-г click дарах үед render function байнга дуудагдаад байгаа нь хурдад их нөлөөлж байгаа
// цаашид сайжруулах шаардлагтай [refactor].
class Component extends React.PureComponent {
  render() {
    const data = this.props && this.props.dataSource;
    const { pathname, search } = this.props.history.location;

    try {
      return (
        <span className="main-menu-list horizontal-scroll">
          {
            data.map((item, index) => (
              <Button key={index}>
                <li className="list-inline-item">
                  <Link to={item.link}>
                    <span style={{ color: pathname + search === item.link ? "#FFB81C" : "#FFFFFF" }}>
                      {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
                    </span>
                  </Link>
                </li>
              </Button >
            ))
          }
        </span>
      );
    } catch (error) {
      return console.log('Emartmall main menu rendering warning is: ', error);
    }
  }
}

export default injectIntl(Component);
