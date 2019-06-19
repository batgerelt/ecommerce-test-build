import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  Layout,
  Menu,
  Icon,
} from 'antd';
import { Global } from "../../models";
import styles from './index.less';
import otLogo from "../../assets/images/ot-white.png";

const { SubMenu } = Menu;
const {
  Sider,
} = Layout;

const mapStateToProps = (state) => {
  const { global: { collapsed } } = state;
  return {
    collapsed,
  };
};

class SideNav extends PureComponent {
  static defaultProps = {
  };
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    menus: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.menus = props.menus;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
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
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }

  handleOpenChange = (openKeys) => {
    console.log('openKeys: ', openKeys);
    // const lastOpenKey = openKeys[openKeys.length - 1];
    this.setState({
      openKeys: [...openKeys],
    });
  }

  render() {
    const {
      collapsed,
    } = this.props;

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={(collapsed1, type) => { console.log(collapsed1, type); }}
        width={256}
        className={styles.sider}
        style={{
          overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
        }}
      >
        <div className={styles.logo}>
          <Link to="/">
            <img src={otLogo} alt="Эрдэнэт үйлдвэр" />
            <h1>Эрдэнэт үйлдвэр</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={this.getCurrentMenuSelectedKeys()}
          style={{ margin: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(connect(mapStateToProps, { onCollapse: Global.onCollapse })(SideNav));
