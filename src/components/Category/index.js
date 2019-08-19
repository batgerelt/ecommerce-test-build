import React from "react";
import { Link } from "react-router-dom";

class MainMenu extends React.Component {
  handleDetail = (id) => {
    this.props.getCategoryInfo({ id });
    this.props.categoryFilter({
      body: {
        catid: id,
        parameters: [],
        minprice: 0,
        maxprice: 0,
        ordercol: "price_asc",
        rowcount: 0,
        startswith: 0,
      },
    });
  }

  render() {
    const { pathname } = this.props.location;

    const data = this.props && this.props.dataSource;
    const lang = this.props.intl.locale;
    let indents = data.map((item, index) => (
      <div className="col-md-3 pad20" key={index} style={{ zIndex: "100" }}>
        <ul className="list-unstyled">
          <li key={index} className="active">
            <Link
              to={item.route ? item.route : ""}
              className="list-unstyled text-light active"
            >
              <strong className="text-uppercase">{lang === "mn" ? item.name : item.name_en}</strong>
            </Link>
          </li>
          {item.children &&
            item.children.map((it, ind) => (
              <li className="active" key={ind} onClick={() => this.handleDetail(it.id)}>
                <Link
                  to={it.route ? it.route : " "}
                  className="list-unstyled text-muted active"
                >
                  <span>{lang === "mn" ? it.name : it.name_en}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    ));
    return <div className="row row10">{indents}</div>;
  }
}

export default MainMenu;
