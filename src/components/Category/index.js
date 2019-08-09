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
    const data = this.props && this.props.dataSource;
    let indents = data.map((item, index) => (
      <div className="col-md-3 pad20" key={index} style={{ zIndex: "100" }}>
        <ul className="list-unstyled">
          <li key={index}>
            <Link
              to={item.route ? item.route : ""}
              className="list-unstyled text-light"
            >
              <strong className="text-uppercase">{item.name}</strong>
            </Link>
          </li>
          {item.children &&
            item.children.map((it, ind) => (
              <li key={ind} onClick={() => this.handleDetail(it.id)}>
                <Link
                  to={it.route ? it.route : " "}
                  className="list-unstyled text-muted"
                >
                  <span>{it.name}</span>
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
