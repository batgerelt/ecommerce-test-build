import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  Banner as BannerModel,
  Product as ProductModel,
  Menu as MenuModel,
  Filter as FilterModel,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...BannerModel,
      ...ProductModel,
      ...MenuModel,
      ...FilterModel,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getSeasonBanner();
    this.props.getSeasonMenu({});
    this.props.seasonFilter({
      body: {
        promotid: null,
        parameters: [],
        minprice: 0,
        maxprice: 0,
        ordercol: "price_asc",
      },
    });
  }

  render() {
    return <List {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
