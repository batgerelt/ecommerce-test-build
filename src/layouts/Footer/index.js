/* eslint-disable no-useless-concat */
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";

class Footer extends React.Component {
  render() {
    const { staticinfo, staticpage } = this.props.staticcontent;
    return (
      <div className="top-container">
        <div className="section section-footer">
          <div className="container pad10">
            <div className="row row10">
              <div className="col-sm-12 col-md-6 col-lg-3 pad10">
                <Link to="/" className="logo">
                  <img alt="logo" src={process.env.IMAGE + staticinfo.logopath2} />
                </Link>
                <ul className="social">
                  <li>
                    <a
                      href={staticinfo.facebook}
                      target="_blank "
                      rel="noopener"
                    >
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon
                          icon={["fas", "circle"]}
                          size="4x"
                          color="#999"
                        />
                        <FontAwesomeIcon
                          icon={["fab", "facebook-f"]}
                          size="4x"
                          inverse
                          transform="shrink-6 right-3.5"
                        />
                      </span>
                    </a>
                    <a href={staticinfo.gmail} target="_blank " rel="noopener">
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon
                          icon={["fas", "circle"]}
                          size="4x"
                          color="#999"
                        />
                        <FontAwesomeIcon
                          icon={["fab", "google-plus-g"]}
                          size="4x"
                          inverse
                          transform="shrink-6 left-2"
                        />
                      </span>
                    </a>
                    <a
                      href={staticinfo.twitter}
                      target="_blank "
                      rel="noopener"
                    >
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon
                          icon={["fas", "circle"]}
                          size="4x"
                          color="#999"
                        />
                        <FontAwesomeIcon
                          icon={["fab", "twitter"]}
                          size="4x"
                          inverse
                          transform="shrink-6"
                        />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 pad10">
                <ul className="list-unstyled">
                  {staticpage.map((item, index) => {
                    if (item.pagetype === "1") {
                      return (
                        <li key={index}>
                          <a href={`${"/info" + "/"}${item.id}${item.slug}`}>
                            <span>{item.name}</span>
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 pad10">
                <ul className="list-unstyled">
                  {staticpage.map((item, index) => {
                    if (item.pagetype === "2") {
                      return (
                        <li key={index}>
                          <a href={`${"/info" + "/"}${item.id}${item.slug}`}>
                            <span>{item.name}</span>
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 pad10">
                <ul className="list-unstyled address">
                  <li>
                    <strong>Холбоо барих</strong>
                  </li>
                  <li>
                    <span>{staticinfo.address}</span>
                  </li>
                  <li>
                    <span>{staticinfo.phone}</span>
                  </li>
                  <li>
                    <span>{staticinfo.email}</span>
                  </li>
                  <li>
                    <span>
                      <Link to={staticinfo.website}>{staticinfo.website}</Link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bottom-container">
              <center>
                <p>Copyright © 2016-2019 emart. All Rights Reserved.</p>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
