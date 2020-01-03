import React from "react";
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  render() {
    const data = this.props && this.props.dataSource;
    const lang = this.props.intl.locale;
    return (
      <div className="row row10">
        {data.map((item, index) => (
          <div className="col-md-3 pad20" key={index} style={{ zIndex: "100" }}>
            <ul className="list-unstyled">
              <li key={index} className="active">
                <Link
                  to={item.route ? `${item.route}?lvl=${item.lvl}` : '#'}
                  className="list-unstyled text-light active"
                >
                  <strong className="text-uppercase">
                    {lang === "mn" ? item.name : item.name_en}
                  </strong>
                </Link>
              </li>
              {item.children &&
                item.children
                  .sort((a, b) => (a.orders !== b.orders ? a.order > b.orders : a.name.localeCompare(b.name)))
                  .map((it, ind) => (
                    <li
                      className="active"
                      key={ind}
                    >
                      <Link
                        to={item.route ? `${it.route}?lvl=${it.lvl}` : '#'}
                        className="list-unstyled active sub-category-color"
                      >
                        <span>{lang === "mn" ? it.name : it.name_en}</span>
                      </Link>
                    </li>
                  ))}
              <br />
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export default MainMenu;
