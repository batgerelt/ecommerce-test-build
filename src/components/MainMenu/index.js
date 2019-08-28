/* eslint-disable arrow-body-style */
import React from "react";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  state = {
    selected: null,
  }

  handleMenu = (index) => {
    this.setState({ selected: index + 1000 });
  }

  render() {
    try {
      const { selected } = this.state;
      const data = this.props && this.props.dataSource;
      let indents = data.map((item, index) => {
        return (
          <li className="list-inline-item" key={index + 1000} onClick={e => this.handleMenu(index)}>
            <Link to={item.link} key={index}>
              <span style={{ color: selected === index + 1000 ? "#feb415" : "#fff" }}>
                {this.props.intl.locale === "mn" ? item.menunm : item.menunm_en}
              </span>
            </Link>
          </li>
        );
      });
      return <span>{indents}</span>;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(MainMenu);
