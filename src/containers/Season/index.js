import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Filter as FilterModel,
  Cart as CartModel,
} from "../../models";
import { Loader } from "../../components";
import List from "./list";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.filter,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...BannerModel,
    ...ProductModel,
    ...MenuModel,
    ...FilterModel,
    ...CartModel,
  }, dispatch),
});

class Page extends React.Component {
  state = {
    loading: false,
  }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    if (this.props.seasonfilter.length === 0) {
      this.setState({ loading: true });
    }
    this.props.getSeasonBanner();
    this.props.getSeasonMenu({});
    this.props.seasonFilter({
      body: {
        promotid: null,
        parameters: [],
        minprice: 0,
        maxprice: 0,
        startswith: 60,
        rowcount: 20,
        ordercol: "price_asc",
      },
    }).then((res) => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <Spin
        spinning={loading}
        indicator={<Loader />}
      >
        <List {...this.props} />
      </Spin>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
