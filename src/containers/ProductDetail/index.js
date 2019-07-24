import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import {
  Auth as AuthModel,
  Product as ProductModel,
  Cart as CartModel,
} from "../../models";
import List from "./list";
import { Loader } from "../../components";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.product,
  ...state.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...AuthModel,
      ...ProductModel,
      ...CartModel,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  state = {
    detailLoad: true,
    relationalLoad: true,
    attributeLoad: true,
    commentLoad: true,
    collectionLoad: true,
    categoryLoad: true,
    detail: false,
  };
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    const { id } = this.props.match.params;
    if (localStorage.getItem("auth") !== null) {
      this.props.addViewList({ skucd: id });
    }
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      if (localStorage.getItem("auth") !== null) {
        this.props.addViewList({ skucd: id });
      }
      this.setState(
        {
          detailLoad: true,
          relationalLoad: true,
          attributeLoad: true,
          commentLoad: true,
          collectionLoad: true,
          categoryLoad: true,
        },
        () => {
          this.getData();
        },
      );
    }
  }

  getData = () => {
    const { id } = this.props.match.params;
    this.props
      .getProductDetail({ skucd: id })
      .then(r => this.setState({ detailLoad: false }));
    this.props
      .getProductRelational({ skucd: id })
      .then(r => this.setState({ relationalLoad: false }));
    this.props
      .getProductComment({ skucd: id })
      .then(r => this.setState({ commentLoad: false }));
    this.props
      .getProductCollection({ skucd: id })
      .then(r => this.setState({ collectionLoad: false }));
    this.props
      .getProductAttribute({ skucd: id })
      .then(r => this.setState({ attributeLoad: false }));
    this.props.getCategorys().then(r => this.setState({ categoryLoad: false }));
  };

  render() {
    const {
      detailLoad,
      relationalLoad,
      commentLoad,
      collectionLoad,
      categoryLoad,
      attributeLoad,
    } = this.state;
    return (
      <Spin
        spinning={
          detailLoad ||
          relationalLoad ||
          commentLoad ||
          collectionLoad ||
          categoryLoad ||
          attributeLoad
        }
        indicator={<Loader />}
      >
        <List {...this.props} {...this} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </Spin>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
