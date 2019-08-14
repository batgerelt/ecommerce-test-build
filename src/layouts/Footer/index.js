/* eslint-disable no-useless-concat */
import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";

class Footer extends React.Component {
  handleDetail = (id) => {
    this.props.getStaticPage({ id });
  }

  renderColFirst = () => {
    try {
      const { staticinfo } = this.props.staticcontent;

      return (
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
      );
    } catch (error) {
      return error;
    }
  }

  renderColSecond = () => {
    try {
      const { lang } = this.props.locale;
      const { staticpages } = this.props.staticcontent;

      return (
        <div className="col-sm-12 col-md-6 col-lg-3 pad10">
          <ul className="list-unstyled">
            {staticpages.map((item, index) => {
              if (item.pagetype === 1) {
                return (
                  <li key={index} onClick={() => this.handleDetail(item.id)}>
                    <Link to={`${"/info" + "/"}${item.id}`}>
                      <span>{lang === "mn" ? item.name : item.name_en}</span>
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderColThird = () => {
    try {
      const { lang } = this.props.locale;
      const { staticpages } = this.props.staticcontent;

      return (
        <div className="col-sm-12 col-md-6 col-lg-3 pad10">
          <ul className="list-unstyled">
            {staticpages.map((item, index) => {
              if (item.pagetype === 2) {
                return (
                  <li key={index} onClick={() => this.handleDetail(item.id)}>
                    <Link to={`${"/info" + "/"}${item.id}`}>
                      <span>{lang === "mn" ? item.name : item.name_en}</span>
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderColLast = () => {
    try {
      const { lang } = this.props.locale;
      const { staticinfo } = this.props.staticcontent;
      return (
        <div className="col-sm-12 col-md-6 col-lg-3 pad10">
          <ul className="list-unstyled address">
            <li>
              <strong><FormattedMessage id="footer.contract.title" /></strong>
            </li>
            <li>
              <span>{lang === "mn" ? staticinfo.address : staticinfo.address_en}</span>
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
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    const { staticinfo, staticpages } = this.props.staticcontent;
    return (
      <div className="top-container">
        <div className="section section-footer">
          <div className="container pad10">
            {
              staticinfo === null || staticpages.length === 0 ? null : (
                <div className="row row10">
                  {this.renderColFirst()}
                  {this.renderColSecond()}
                  {this.renderColThird()}
                  {this.renderColLast()}
                </div>
              )
            }
            <div className="bottom-container">
              <center>
                <p><FormattedMessage id="footer.copyright.text" /></p>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
