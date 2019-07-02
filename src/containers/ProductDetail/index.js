import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import { Product as ProductModel } from "../../models";
import List from "./list";
import { Loader } from "../../components";

const mapStateToProps = state => ({
  ...state.product,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...ProductModel,
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
  };
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.getData();
  }

  /* componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.getData();
    }
  } */

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
    // eslint-disable-next-line no-redeclare
    console.log("detail", this.props.detail);
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
        <List {...this.props} />
      </Spin>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
