/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-unreachable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, Form } from "antd";

import { Category, MainMenu, UserButton } from "../../components";
import searchImage from "../../scss/assets/svg/001-search.svg";
import heartImage from "../../scss/assets/svg/003-chat.svg";
import navImage from "../../scss/assets/svg/list.svg";

import "./style.css";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
      isDropdownOpen: false,
      isSearchDropdownOpen: false,
      menucategories: [],
      item: "Бүх бараа",
      suggestion: [],
      word: "",
      keywordid: null,
      isSearch: false,
      pro: false,
    };
  }

  handleSearch = () => {
    const { word, keywordid } = this.state;

    keywordid === null ? this.props.searchWord({ keyword: word }) : this.props.searchKeyWord({ keywordid });
  }

  handleChangeKeyWord = (e) => {
    const { suggestion } = this.state;

    suggestion.map((item) => {
      if (e.target.value === item.keyword) {
        this.setState({ keywordid: item.id });
      }
      return null;
    });

    this.setState({ word: e.target.value });

    if (this.state.word.length >= 1) {
      this.props.searchWord({ keyword: e.target.value }).then((res) => {
        res === undefined ? null : res.payload.success ? this.setState({ suggestion: res.payload.data }) : null;
      });
    }
  };

  onItem = (e, item) => {
    this.setState({ item: item.name });
  };

  onItem1 = (e) => {
    this.setState({ item: "Бүх бараа" });
  };

  togglePopup = () => {
    this.props.onChange();
  };

  toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  searchDropdown = () => {
    this.setState({ isSearchDropdownOpen: !this.state.isSearchDropdownOpen });
  };

  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };

  renderTopNavigation = () => {
    try {
      const { staticinfo } = this.props.staticcontent;

      return (
        <div className="top-nav">
          <div className="container container-laptop pad10">
            <div className="row row10">
              <div className="col-lg-6 col-md-6 d-none d-md-block pad10">
                <ul className="list-inline left-panel">
                  <li className="list-inline-item">
                    <div className="e-phone" style={{ padding: 9 }}>
                      <Icon
                        type="phone"
                        theme="filled"
                        style={{ color: "rgba(254, 180, 21, 1)" }}
                      />
                      <strong> {staticinfo.phone} </strong>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 d-none d-md-block  pad10">
                <div className="text-right">
                  <ul className="list-inline right-panel" style={{ boxShadow: 'none' }}>
                    <li className="list-inline-item" style={{ boxShadow: 'none' }}>
                      <select className="classic" defaultValue="0" style={{ boxShadow: 'none' }}>
                        <option value="0" defaultValue style={{ boxShadow: 'none' }}> МОН </option>
                        <option value="1" style={{ boxShadow: 'none' }}>ENG</option>
                      </select>
                    </li>
                    <UserButton {...this.props} />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderTopMain = () => {
    try {
      const { staticinfo } = this.props.staticcontent;
      const { categorymenu } = this.props.category;
      const { keywordid, word } = this.state;

      const dropdownClass = `dropdown-menu${this.state.isDropdownOpen ? " show" : ""}`;
      const searchClass = `search-mobile${this.state.isSearch ? " activated" : " "}`;

      let root = [];
      categorymenu.map((item) => {
        if (item.parentid === 0) {
          item.children = [];
          root.push(item);
        }
      });

      root.map((item, i) => {
        categorymenu.map((item1, i1) => {
          if (item.id === item1.parentid) {
            item.children.push(item1);
          }
        });
      });

      return (
        <div className="top-main">
          <div className="container container-laptop pad10">
            <div className="row row10">
              <div className="col-xl-8 col-lg-8 col-md-5 col-4 pad10">
                <div className="flex-this flex-space">
                  <button
                    className="d-block d-md-none button buttonGrey"
                    onClick={this.togglePopup}
                  >
                    {/* <i className="fa fa-navicon" aria-hidden="true" /> */}
                    <img
                      src={navImage}
                      alt="mobile navigation"
                      height="25px"
                    />
                  </button>
                  <Link to="/" className="logo">
                    <img alt="logo" src={process.env.IMAGE + staticinfo.logopath} />
                  </Link>
                  <div className="search">
                    <Form className={searchClass}>
                      <ul className="list-unstyled list-float clr mainsearch">
                        <li>
                          <div
                            className="dropdown"
                            onClick={this.toggleDropdown}
                          >
                            <button
                              className="btn dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              style={{ boxShadow: 'none' }}
                            >
                              {this.state.item}
                            </button>
                            <div
                              className={dropdownClass}
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a
                                className="dropdown-item"
                                onClick={e => this.onItem1(e)}
                              >
                                <span>Бүх бараа</span>
                              </a>
                              {root.map((entry, index) => (
                                <a
                                  className="dropdown-item"
                                  key={index}
                                  onClick={e => this.onItem(e, entry)}
                                >
                                  {entry.icon ? (
                                    <img
                                      src={process.env.IMAGE + entry.icon}
                                      alt="category"
                                    />
                                      ) : (
                                        " "
                                      )}
                                  <span>{entry.name}</span>
                                </a>
                                  ))}
                            </div>
                          </div>
                        </li>
                        <li className="search-form">
                          <div className="form-group">
                            <label
                              className="input"
                              style={{ margin: "0px", width: "100%" }}
                            >
                              <input
                                list="cat"
                                type="text"
                                className="form-control input-search"
                                placeholder="Бүгдээс хайх"
                                style={{ boxShadow: 'none' }}
                                onChange={e => this.handleChangeKeyWord(e)}
                              />
                              <datalist id="cat" className="list-unstyled">
                                {this.state.suggestion.map(item => (
                                  <option
                                    key={item.id}
                                    value={item.keyword}
                                  />
                                    ))}
                              </datalist>
                            </label>
                          </div>
                        </li>
                        <li>
                          <Link
                            className="btn"
                            to={keywordid === null ? `/search/${word}/0` : `/search/${keywordid}/1`}
                            style={{ boxShadow: 'none', color: 'black' }}
                          >
                            <i
                              className="fa fa-search d-block d-sm-none"
                              style={{ fontSize: "20px", margin: "5px" }}
                            />
                            <span
                              className="text-uppercase d-none d-sm-block"
                              onClick={this.handleSearch}
                            >
                              Хайх
                            </span>
                          </Link>
                          <Link
                            to=""
                            className="btn mobile-search-cross"
                            onClick={this.toggleSearch}
                            style={{ background: "#feb415" }}
                          >
                            <i
                              className="fa fa-remove d-block d-sm-none"
                              style={{ fontSize: "20px", margin: "5px" }}
                            />
                            <span
                              className="text-uppercase d-none d-sm-block"
                              style={{ color: "black" }}
                            >
                                Хаах
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-7 col-8 pad10">
                <div className="action">
                  <ul className="list-inline text-right">
                    <li className="list-inline-item">
                      <Link
                        to=""
                        className="flex-this search-mobile-btn d-flex d-lg-none row10"
                        onClick={this.toggleSearch}
                      >
                        {/* <i className="fa fa-search" /> */}
                        <img src={searchImage} alt="search" height="25px" />
                        <p>
                          <small>Хайлт</small>
                          <span className="text-uppercase">хийх</span>
                        </p>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      {this.props.isLoggedIn ? (
                        <a href="/userprofile/wishlist" className="row10">
                          {/* <Icon type="heart" theme="filled" /> */}
                          <img
                            src={heartImage}
                            alt="wishlist"
                            height="25px"
                          />
                          <p>
                            <small>Хадгалсан</small>
                            <span className="text-uppercase">бараа</span>
                          </p>
                        </a>
                        ) : (
                          <a className="row10">
                            {/* <Icon type="heart" theme="filled" /> */}
                            <img
                              src={heartImage}
                              alt="wishlist"
                              height="25px"
                            />
                            <p>
                              <small>Хадгалсан</small>
                              <span className="text-uppercase">бараа</span>
                            </p>
                          </a>
                        )}
                    </li>
                    <li className="list-inline-item">
                      {/* <CartButton /> */}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderMainNavigation = () => {
    try {
      const { mainmenu } = this.props.menu;
      const { categorymenu } = this.props.category;

      let root = [];
      categorymenu.map((item) => {
        if (item.parentid === 0) {
          item.children = [];
          root.push(item);
        }
      });

      root.map((item, i) => {
        categorymenu.map((item1, i1) => {
          if (item.id === item1.parentid) {
            item.children.push(item1);
          }
        });
      });

      return (
        <div className="main-nav">
          <div className="container container-laptop pad10">
            <ul className="list-inline">
              <li className="list-inline-item active">
                <Link to="/">
                  <Icon
                    type="home"
                    theme="filled"
                    style={{ color: "#feb415" }}
                  />
                </Link>
              </li>
              <li className="list-inline-item has-drop">
                <Link to="" >
                  <span>Ангилал</span>
                  <Icon type="down" style={{ color: "#feb415" }} />
                </Link>

                <div className="drop-container">
                  <div className="container pad10">
                    <Category dataSource={root} {...this.props} />
                  </div>
                </div>
              </li>
              <MainMenu dataSource={mainmenu} />
            </ul>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    const { mainmenu } = this.props.menu;
    const { staticinfo } = this.props.staticcontent;
    const { categorymenu } = this.props.category;

    return (
      <div className="wrap" id="main-header">
        {
          mainmenu.length === 0 || staticinfo === null || categorymenu.length === 0 ? null : (
            <div className="top-container">
              {this.renderTopNavigation()}
              {this.renderTopMain()}
              {this.renderMainNavigation()}
            </div>
          )
        }
        {/* <RegisterModal /> */}
      </div>
    );
  }
}

export default AppHeader;
