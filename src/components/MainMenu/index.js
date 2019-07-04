import React from "react";
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  render() {
    try {
      const data = this.props && this.props.dataSource;
      let indents = data.map((item, index) => (
        <li className="list-inline-item" key={index + 1000}>
          <Link to={item.link} key={index}>
            <span>{item.menunm}</span>
          </Link>
        </li>
      ));

      return <span>{indents}</span>;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default MainMenu;
