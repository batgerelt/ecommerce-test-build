import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from "antd";

import {
  Category as CategoryModel,
  Brand as BrandModel,
  Banner as BannerModel,
} from "../../models";
import { Loader } from "../../components";
import Home from "./list";

const mapStateToProps = state => ({
  ...state.brand,
  ...state.category,
  ...state.banner,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...CategoryModel,
    ...BrandModel,
    ...BannerModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    iscat: true,
    isbrand: true,
    banners: [],
  }

  /** Home хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд  */
  componentWillMount() {
    this.props.getCategoryMenu().then(res => this.setState({ iscat: false })); // Menu-ийн өгөгдөл авах хүсэлт
    this.props.getBrand().then(res => this.setState({ isbrand: false })); // Brand-ийн өгөгдөл авах хүсэлт
  }

  /** Props буюу redux-ийн state өөрчилөгдсөн тохиолдолд тухайн хуудасыг дахин зурах */
  componentWillUpdate(nextProps, nextState) {
    if (nextProps !== nextState.dataSource) {
      this.setState({ dataSource: nextProps });
    }
  }

  componentDidMount() {
    // console.log(this.props);
  }

  render() {
    const { iscat, isbrand, isbanner } = this.state;

    return (
      <Spin spinning={iscat || isbrand || isbanner} indicator={<Loader />}>
        { (iscat || isbrand) ? <div /> : <Home {...this.props} {...this.state} />}
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
