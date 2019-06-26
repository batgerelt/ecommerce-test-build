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
    detail: true,
    relational: true,
    rate: true,
    comment: true,
    detailimg: true,
    collection: true,
  };
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props
      .getProductDetail({ skucd: id })
      .then(r => this.setState({ detail: false }));
    this.props
      .getProductRelational({ skucd: id })
      .then(r => this.setState({ relational: false }));
    this.props
      .getProductRate({ skucd: id })
      .then(r => this.setState({ rate: false }));
    this.props
      .getProductComment({ skucd: id })
      .then(r => this.setState({ comment: false }));
    this.props
      .getProductDetailimg({ skucd: id })
      .then(r => this.setState({ detailimg: false }));
    this.props
      .getProductCollection({ skucd: id })
      .then(r => this.setState({ collection: false }));
  }

  render() {
    const {
      detail,
      relational,
      rate,
      comment,
      detailimg,
      collection,
    } = this.state;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin
          spinning={
            detail || relational || rate || comment || detailimg || collection
          }
          indicator={<Loader />}
        >
          <List {...this.props} />
        </Spin>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
