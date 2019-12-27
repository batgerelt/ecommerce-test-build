/* eslint-disable react/jsx-no-target-blank */
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
        <div className="col-sm-6 col-lg-3 pad10 logo-container">
          <Link to="/" className="logo d-f-center" style={{ width: "10% !important" }}>
            <img alt="logo" src={staticinfo && process.env.IMAGE + staticinfo.logopath2} style={{ width: "100% !important" }} />
          </Link>
          <ul className="social d-f-center">
            <li>
              <a
                href={staticinfo && staticinfo.facebook}
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
              <a href={staticinfo && staticinfo.gmail} target="_blank " rel="noopener">
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
                href={staticinfo && staticinfo.twitter}
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

              <a
                href={staticinfo && staticinfo.instagram}
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
                    icon={["fab", "instagram"]}
                    size="4x"
                    inverse
                    transform="shrink-6 right-1"
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
        <div className="col-sm-6 col-lg-3 pad10 d-f-center">
          <ul className="list-unstyled">
            {staticpages.map((item, index) => {
              if (item.pagetype === 1) {
                return (
                  <li key={index} onClick={() => this.handleDetail(item.id)}>
                    <Link to={`${"/info" + "/"}${item.id}`} className="upper-first">
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
        <div className="col-sm-6 col-lg-3 pad10 d-f-center">
          <ul className="list-unstyled">
            {staticpages.map((item, index) => {
              if (item.pagetype === 2) {
                return (
                  <li key={index} onClick={() => this.handleDetail(item.id)}>
                    <Link to={`${"/info" + "/"}${item.id}`} className="upper-first">
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
        <div className="col-sm-6 col-lg-3 pad10 footer-contract">
          <ul className="list-unstyled address upper-first">
            <li>
              <strong><FormattedMessage id="footer.contract.title" /></strong>
            </li>
            <li className="d-flex">
              <i className="fa fa-map-marker" aria-hidden="true" />
              <span>{lang === "mn" ? staticinfo.address : staticinfo.address_en}</span>
            </li>
            <li className="d-flex">
              <i className="fa fa-phone" aria-hidden="true" />
              <span>{staticinfo.phone}</span>
            </li>
            <li className="d-flex">
              <i className="fa fa-envelope-o" aria-hidden="true" />
              <span>{staticinfo.email}</span>
            </li>
            <li className="d-flex">
              <i className="fa fa-globe" aria-hidden="true" />
              <span>
                <a href={staticinfo.website} target="_blank " rel="noopener" className="text-white">{staticinfo.website}</a>
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
        <div className="section-footer">
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
              <p><FormattedMessage id="footer.copyright.text" /></p>
              <p><FormattedMessage id="footer.poweredby.text" />
                <a href="https://datacare.mn/" target="_blank">Datacare LLC</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
