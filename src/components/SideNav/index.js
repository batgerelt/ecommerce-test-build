import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Icon, Badge } from 'antd';
import axios from 'axios';

import styles from "./index.less";

const { SubMenu } = Menu;

class SideNav extends Component {
  static defaultProps = {
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
    menus: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.menus = props.menus;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      count: null,
    };
  }

  // componentDidMount() {
  //   setInterval(e => this.handleEmergencyOrder(e), 5000);
  // }

  handleEmergencyOrder = (e) => {
    axios.get(`${process.env.HOST_SERVER}/mn/api/spotordercount`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
      },
    })
      .then(res => (res.data.value !== this.state.count ? this.setState({ count: res.data.value }) : ''));
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return [''];
    }
    return currentMenuSelectedKeys;
  }

  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }

  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item && item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;

      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}
                <span>
                  {item.name}
                </span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}
                <span>
                  {item.path === 'emergency' ? (
                    this.state.count === 0 ? item.name : <Badge count={this.state.count} className={styles.badge}>{item.name}</Badge>
                  ) : item.name}
                </span>
              </Link>
              )
          }
        </Menu.Item>
      );
    });
  }

  rootSubmenuKeys = ['category', 'settings', 'products', 'order'];
  state = {
    openKeys: ['category'],
  };

  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  render() {
    const {
      collapsed,
    } = this.props;
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };
    return (
      <Menu
        inlineCollapsed
        defaultSelectedKeys={this.getCurrentMenuSelectedKeys()}
        onOpenChange={this.handleOpenChange}
        openKeys={this.state.openKeys}
        mode="inline"
        theme="light"
        {...menuProps}
      >
        {this.getNavMenuItems(this.menus)}
      </Menu>
    );
  }
}

export default SideNav;
