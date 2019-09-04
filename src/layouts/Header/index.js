/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-unreachable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Form, Dropdown } from "antd";
import moment from "moment";

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
      item: { id: 0, name: "" },
      suggestion: [],
      word: "",
      keywordid: null,
      isSearch: false,
      pro: false,
      categoryDropdown: false,
    };
  }

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleLangChange = (e) => {
    this.props.setLang(e);
    // this.props.getMenu();
    // this.props.getCategoryMenu();
    // this.props.getStaticPages();
    // this.props.getStaticInfo();
  };

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

  handleKeyPress = (event, url) => {
    if (event.key === 'Enter') {
      this.props.history.push(url);
      this.setState({ word: '' });
    }
    return null;
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
          <div className="container container-laptop pad10">
            <div className="row row10">
              <div className="col-lg-6 col-md-6 d-none d-md-block pad10">
                <ul className="list-inline left-panel">
                  <li className="list-inline-item">
                    <div className="e-phone">
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
              <div className="col-lg-6 col-md-6 d-none d-md-block pad10">
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
      const { keywordid, word, item } = this.state;
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
        <div className="top-main">
          <div className="container container-laptop pad10">
            <div className="row">
              <div className="col-xl-9 col-lg-8 col-md-6 col-5 pad10">
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
                              {
                                this.state.item.name
                                  ? this.state.item.name
                                  : <FormattedMessage id="header.category.label.allProducts" />
                              }
                            </button>
                            <div
                              className={dropdownClass}
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a
                                className="dropdown-item"
                                onClick={this.handelAllCategory}
                              >
                                <span className="no-padding">
                                  <FormattedMessage id="header.category.label.allProducts" />
                                </span>
                              </a>
                              {root.map((item, index) => (
                                <a
                                  className={`dropdown-item ${item.icon ? '' : 'no-icon-category'}`}
                                  key={index}
                                  onClick={e => this.handleChangeCategory(item, e)}
                                >
                                  {item.icon ? (
                                    <img
                                      src={process.env.IMAGE + item.icon}
                                      alt={item}
                                    />
                                  ) : null}
                                  <span>{lang === "mn" ? item.name : item.name_en}</span>
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
                                value={word}
                                // required={item.id === 0 && word === ''}
                                onInvalid={this.hadleValidate}
                                list="cat"
                                type="text"
                                className="form-control input-search"
                                placeholder={intl.formatMessage({ id: "header.searchBar.placeholder" })}
                                style={{ boxShadow: 'none' }}
                                onChange={e => this.handleChangeSearchWord(e)}
                                onKeyPress={e => this.handleKeyPress(e, item.id === 0 && word === '' ? "#" : `/search/${item.id}/${word === "" ? '.' : word}/${moment()}`)}
                              />
                              <datalist id="cat" className="list-unstyled" onKeyPress={e => this.handleKeyPress(e, item.id === 0 && word === '' ? "#" : `/search/${item.id}/${word === "" ? '.' : word}/${moment()}`)}>
                                {this.state.suggestion.map(item => <option key={item.id} value={item.keyword} />)}
                              </datalist>
                            </label>
                          </div>
                        </li>
                        <li>
                          <Link
                            className="btn"
                            to={item.id === 0 && word === '' ? "#" : `/search/${item.id}/${word === "" ? '.' : word}/${moment()}`}
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
                              <FormattedMessage id="header.searchBar.button" />
                            </span>
                          </Link>
                          <Link
                            to="#"
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
              <div className="col-xl-3 col-lg-4 col-md-6 col-7 pad10">
                <div className="action">
                  <ul className="list-inline text-right">
                    <li className="list-inline-item">
                      <span
                        className="flex-this search-mobile-btn d-flex d-lg-none row10"
                        onClick={this.toggleSearch}
                        style={{ padding: 5 }}
                      >
                        <img src={searchImage} alt="search" height="25px" />
                        <p>
                          <small>Хайлт</small>
                          <span className="text-uppercase">хийх</span>
                        </p>
                      </span>
                    </li>
                    <li className="list-inline-item">
                      {
                        localStorage.getItem('auth') !== null ?
                          (
                            <Link to="/profile/wish" className="row10">
                              <img
                                src={addedWishList ? heartImageColor : heartImage}
                                alt="wishlist"
                                height={"25px"}
                                style={addedWishList ? { transition: "0.3s", transform: "scale(1.4)" } : { transition: "0.3s", transform: "scale(1)" }}
                              />
                              <p className="header-text header-wish-text">
                                <small className="upper-first"><FormattedMessage id="header.wishlist.part1" /></small>
                                <span><FormattedMessage id="header.wishlist.part2" /></span>
                              </p>
                            </Link>
                          ) : (
                            <Link to="#" className="row10" onClick={this.handleLogin}>
                              <img src={addedWishList ? heartImageColor : heartImage} alt="wishlist" height="25px" />
                              <p className="header-text header-wish-text">
                                <small className="upper-first"><FormattedMessage id="header.wishlist.part1" /></small>
                                <span><FormattedMessage id="header.wishlist.part2" /></span>
                              </p>
                            </Link>
                          )
                      }
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
      return console.log(error);
    }
  }

  handleCategoryDropdown = () => this.setState({ categoryDropdown: !this.state.categoryDropdown })

  handleScroll = e => console.log('e: ', e);

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
        <div className="drop-container" onClick={this.handleCategoryDropdown} style={{ backgroundColor: '#262a32', marginTop: '-5px' }}>
          <div className="container pad10" style={{ padding: '30px 30px 30px 30px' }}>
            <Category dataSource={root} {...this.props} />
          </div>
        </div>
      );
      return (
        <div className="main-nav">
          <div className="container container-laptop pad10">
            <ul className="list-inline">
              <li className="list-inline-item active" style={{ paddingLeft: '0px' }}>
                <Link to="/" style={{ paddingLeft: '0px' }}>
                  <Icon
                    type="home"
                    theme="filled"
                    style={{ color: "#feb415" }}
                  />
                </Link>
              </li>
              <li className="list-inline-item has-drop">
                <Dropdown overlay={dropdown} trigger={['click']} onVisibleChange={this.handleCategoryDropdown}>
                  <Link to="#" onClick={this.handleCategoryDropdown}>
                    <span><FormattedMessage id="search.filter.category.title" /></span>
                    <Icon type="left" style={{ color: '#feb415', transition: '0.1s' }} rotate={categoryDropdown ? -90 : 0} />
                  </Link>
                </Dropdown>
              </li>
              <MainMenu dataSource={mainmenu} history={this.props.history} />
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
      <div className="wrap" id="main-header" onClick={this.handleDropDownClose}>
        {
          mainmenu.length === 0 || staticinfo === null || categorymenu.length === 0 ? null : (
            <div className="top-container">
              {this.renderTopNavigation()}
              {this.renderTopMain()}
              {this.renderMainNavigation()}
            </div>
          )
        }
      </div>
    );
  }
}
export default withRouter(injectIntl(AppHeader));
