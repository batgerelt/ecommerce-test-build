/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-unreachable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Form, Dropdown } from "antd";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { Category, MainMenu, UserButton, CartButton } from "../../components";
import searchImage from "../../scss/assets/svg/001-search.svg";
import heartImage from "../../scss/assets/svg/003-chat.svg";
import navImage from "../../scss/assets/svg/list.svg";
import heartImageColor from "../../scss/assets/svg/003-chat-Copy.svg";
import "./style.css";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.intl.locale,
      isDropdownOpen: false,
      isSearchDropdownOpen: false,
      item: { id: 0, name: "", name_en: '' },
      suggestion: [],
      word: "",
      keywordid: null,
      isSearch: false,
      categoryDropdown: false,
    };
  }

  componentWillUnmount() {
    this.props.onRef(null);
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    this.props.onRef(this);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleLangChange = (e) => {
    this.props.setLang(e);
  };

  handleScroll = () => {
    // this.state.categoryDropdown ? this.setState({ categoryDropdown: false }) : null;
  }

  handleChangeSearchWord = (e) => {
    this.setState({ word: e.target.value });

    if (this.state.word.length >= 1) {
      this.props.searchWord({ keyword: e.target.value }).then((res) => {
        if (res !== undefined) {
          res.payload.success ? this.setState({ suggestion: res.payload.data }) : null;
        } else { this.setState({ suggestion: [] }); }
      });
    }

    if (e.target.value.length === 1) { this.setState({ suggestion: [] }); }
  };

  handleChangeCategory = (item) => {
    this.setState({ item });
  };

  handelAllCategory = () => {
    const { intl } = this.props;
    this.setState({ item: { id: 0, name: intl.formatMessage({ id: "header.category.label.allProducts" }) } });
  }

  togglePopup = () => {
    this.props.Mobilemenu.handleOpen();
  };

  toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  handleDropDownClose = () => {
    if (this.state.isDropdownOpen) {
      this.setState({ isDropdownOpen: false });
    }
  }

  searchDropdown = () => {
    this.setState({ isSearchDropdownOpen: !this.state.isSearchDropdownOpen });
  };

  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };

  handleKeyPress = (categoryid, searchword) => {
    if (categoryid === 0 && searchword === "") {
      return null;
    }

    this.props.history.push({
      pathname: `/search/${categoryid}/${moment()}`,
      state: searchword,
    });
    return this.setState({ word: '', isSearch: false });
  }

  hadleValidate = (e) => {
    if (e.target.value === '') {
      e.target.setCustomValidity("Хайх үгээ оруулна уу!");
      return true;
    }
    return false;
  }

  renderTopNavigation = () => {
    try {
      const { staticinfo } = this.props.staticcontent;
      return (
        <div className="top-nav">
          <div className="container container-laptop">
            <div className="row row10">
              <div className="col-lg-6 col-md-6 d-none d-md-block">
                <ul className="list-inline left-panel">
                  <li className="list-inline-item">
                    <span className="e-phone">
                      <Icon
                        type="phone"
                        theme="filled"
                        style={{ color: "rgba(254, 180, 21, 1)" }}
                      />
                      <strong> {staticinfo === null ? '' : staticinfo.phone} </strong>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 d-none d-md-block">
                <ul className="list-inline right-panel text-right color-new-grey" style={{ boxShadow: 'none' }}>
                  <li className="list-inline-item">
                    <select onChange={this.handleLangChange} className="classic color-new-grey" defaultValue={this.props.locale.lang} style={{ boxShadow: 'none', color: "#63666A" }}>
                      <option value="mn" style={{ boxShadow: 'none' }}>МОН</option>
                      <option value="en" style={{ boxShadow: 'none' }}>ENG</option>
                    </select>
                  </li>
                  <UserButton {...this.props} />
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  handleLogin = (e) => {
    this.props.LoginModal.handleLoginModal();
  }

  renderTopMain = () => {
    try {
      const { intl } = this.props;
      const { staticinfo } = this.props.staticcontent;
      const { categorymenu } = this.props.category;
      const { word, item, isDropdownOpen } = this.state;
      const { addedWishList } = this.props.product;
      const dropdownClass = `dropdown-menu${this.state.isDropdownOpen ? " show" : ""}`;
      const searchClass = `search-mobile${this.state.isSearch ? " activated" : " "}`;
      const lang = intl.locale;

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
        <div className="top-main header-container">
          <div className="container container-laptop pad10">
            <div className="row">
              <div className="col-lg-8 col-md-7 col-6 pad10">
                <div className="flex-this flex-space">
                  <Button
                    className="d-block d-md-none button buttonGrey header-mobile-menu"
                    onClick={this.togglePopup}
                  >
                    <img src={navImage} alt="mobile navigation" height="25px" />
                  </Button>
                  <Link to="/" className="logo">
                    <img
                      alt="logo"
                      className="header-brand-logo"
                      src={process.env.IMAGE + staticinfo.logopath}
                    />
                  </Link>
                  <div className="search">
                    <Form className={searchClass}>
                      <ul className="list-unstyled list-float mainsearch">
                        <li style={{ justifyContent: "unset", width: "auto" }}>
                          <div
                            className="dropdown"
                            onClick={this.toggleDropdown}
                          >
                            <Button className="btn btn-allProduct">
                              {this.state.item.id !== 0 ? (
                                lang === "mn" ? (
                                  this.state.item.name
                                ) : (
                                    this.state.item.name_en
                                  )
                              ) : (
                                  <FormattedMessage id="header.category.label.allProducts" />
                                )}
                              <Icon type={isDropdownOpen ? "caret-down" : "caret-left"} />
                            </Button>
                            <div
                              className={dropdownClass}
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a
                                className="dropdown-item"
                                onClick={this.handelAllCategory}
                              >
                                <span
                                  className="no-padding"
                                  style={{ fontSize: "14px" }}
                                >
                                  <FormattedMessage id="header.category.label.allProducts" />
                                </span>
                              </a>
                              {root.length !== 0 &&
                                root.map((item, index) => (
                                  <a
                                    className={`dropdown-item ${
                                      item.icon ? "" : "no-icon-category"
                                      }`}
                                    key={index}
                                    onClick={e =>
                                      this.handleChangeCategory(item, e)
                                    }
                                  >
                                    {item.icon ? (
                                      <img
                                        src={process.env.IMAGE + item.icon}
                                        alt={item}
                                      />
                                    ) : null}
                                    <span style={{ fontSize: "14px" }}>
                                      {lang === "mn" ? item.name : item.name_en}
                                    </span>
                                  </a>
                                ))}
                            </div>
                          </div>
                        </li>
                        <li className="search-form" style={{ width: "100%" }}>
                          <div className="form-group">
                            <label
                              className="input"
                              style={{ margin: "0px", width: "100%" }}
                            >
                              <input
                                value={word}
                                // required={item.id === 0 && word === ''}
                                onInvalid={this.hadleValidate}
                                list="cat"
                                className="form-control input-search"
                                placeholder={intl.formatMessage({
                                  id: "header.searchBar.placeholder",
                                })}
                                style={{ boxShadow: "none", fontSize: "14px" }}
                                onChange={this.handleChangeSearchWord}
                                onKeyPress={e =>
                                  (e.key === "Enter"
                                    ? this.handleKeyPress(item.id, word)
                                    : null)
                                }
                              />
                              <datalist
                                id="cat"
                                className="list-unstyled"
                                onKeyPress={e =>
                                  (e.key === "Enter"
                                    ? this.handleKeyPress(item.id, word)
                                    : null)
                                }
                              >
                                {this.state.suggestion.map(item => (
                                  <option key={item.id} value={item.keyword} />
                                ))}
                              </datalist>
                            </label>
                          </div>
                        </li>
                        <li className="header-search-btn">
                          <Button
                            onClick={() => this.handleKeyPress(item.id, word)}
                            style={{ boxShadow: "none", color: "black" }}
                          >
                            {
                              window.innerWidth < 576 ? (
                                this.props.search.isLoadingSearch ? (
                                  <i className="fa fa-circle-o-notch fa-spin" />
                                ) : (
                                    <i
                                      className="fa fa-search d-block d-sm-none"
                                      style={{ fontSize: "20px", margin: "5px" }}
                                    />
                                  )
                              ) : (
                                  this.props.search.isLoadingSearch ? (
                                    <i className="fa fa-circle-o-notch fa-spin" />
                                  ) : (
                                      <span
                                        className="text-uppercase d-none d-sm-block"
                                        onClick={this.handleSearch}
                                      >
                                        <FormattedMessage id="header.searchBar.button" />
                                      </span>
                                    )
                                )
                            }
                          </Button>
                        </li>
                      </ul>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-5 col-6 pad10">
                <div className="action">
                  <ul className="list-inline text-right">
                    <li className="list-inline-item search-icon">
                      <Link to="#" onClick={this.toggleSearch}>
                        <img src={searchImage} alt="search" height="25px" />
                        <p>
                          <small>Хайлт</small>
                          <span className="text-uppercase">хийх</span>
                        </p>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      {localStorage.getItem("auth") !== null ? (
                        <Link to="/profile/wish" className="row10">
                          <img
                            src={addedWishList ? heartImageColor : heartImage}
                            alt="wishlist"
                            height="25px"
                            style={
                              addedWishList
                                ? {
                                  transition: "0.3s",
                                  transform: "scale(1.4)",
                                }
                                : { transition: "0.3s", transform: "scale(1)" }
                            }
                          />
                          <p className="header-text header-wish-text">
                            <small className="upper-first">
                              <FormattedMessage id="header.wishlist.part1" />
                            </small>
                            <span>
                              <FormattedMessage id="header.wishlist.part2" />
                            </span>
                          </p>
                        </Link>
                      ) : (
                          <Link to="#" className="row10" onClick={this.handleLogin}>
                            <img src={addedWishList ? heartImageColor : heartImage} alt="wishlist" height="25px" />
                            <p className="header-text header-wish-text">
                              <small className="upper-first">
                                <FormattedMessage id="header.wishlist.part1" />
                              </small>
                              <span>
                                <FormattedMessage id="header.wishlist.part2" />
                              </span>
                            </p>
                          </Link>
                        )}
                    </li>
                    <li className="list-inline-item">
                      <CartButton {...this.props} />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }

  handleCategoryDropdown = () => this.setState({ categoryDropdown: !this.state.categoryDropdown })

  renderMainNavigation = () => {
    try {
      const { mainmenu } = this.props.menu;
      const { categorymenu } = this.props.category;
      const { categoryDropdown } = this.state;

      let root = [];
      categorymenu.map((item) => {
        if (item.parentid === 0) {
          item.children = [];
          root.push(item);
        }
      });

      root.map((item) => {
        categorymenu.map((item1) => {
          if (item.id === item1.parentid) {
            item.children.push(item1);
          }
        });
      });

      const dropdown = (
        <div className="drop-container" onClick={this.handleCategoryDropdown} style={{ zIndex: -5 }}>
          <div className="container pad10 scrolled-menu">
            <Category dataSource={root} {...this.props} />
          </div>
        </div>
      );
      return (

        <div className="main-nav">
          <div className="container container-laptop pad10">
            <ul className="list-inline horizontal">
              <li className="list-inline-item active header-home-icon" style={{ paddingLeft: '0px' }}>
                <Button>
                  <Link to="/" style={{ paddingLeft: '0px' }}>
                    <Icon
                      type="home"
                      theme="filled"
                      style={{ color: "#feb415" }}
                    />
                  </Link>
                </Button>
              </li>
              <li className="list-inline-item has-drop">
                <Dropdown placement="bottomLeft" visible={categoryDropdown} overlay={dropdown} trigger={['click']} onVisibleChange={this.handleCategoryDropdown}>
                  <Link to="#" onClick={this.handleCategoryDropdown}>
                    <span><FormattedMessage id="search.filter.category.title" /></span>
                    <Icon type="left" style={{ color: '#feb415', transition: '0.1s' }} rotate={categoryDropdown ? -90 : 0} />
                  </Link>
                </Dropdown>
              </li>
              <li className="list-inline-item horizontal-top">
                <MainMenu dataSource={mainmenu} history={this.props.history} />
              </li>
            </ul>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div className="wrap" id="main-header" onClick={this.handleDropDownClose} >
        <div className="top-container">
          {this.renderTopNavigation()}
          {this.renderTopMain()}
          {this.renderMainNavigation()}
        </div>
      </div>
    );
  }
}
export default withRouter(injectIntl(AppHeader));
