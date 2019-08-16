/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Package as PackageModel,
  Widget as WidgetModel,
  Cart as CartModel,
  Auth as AuthModel,
} from "../../models";
import { LoginModal } from "../../components/Login";
import List from "./list";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.package,
  ...state.widget,
  ...state.cart,
  ...state.auth,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...PackageModel,
    ...WidgetModel,
    ...CartModel,
    ...AuthModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    loading: true,
  }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getPackage({
      order: "date_desc",
      start: 0,
      rowcnt: 8,
    });
    this.props.getPackageBanner();
    this.props.getPackageMenu({});
    this.props.getWidget().then((res) => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <div>
        {
          this.state.loading
            ? ""
            :
            <div>
              <List {...this.props} {...this} />
              <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
            </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
