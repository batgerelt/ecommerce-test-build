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
    attribute: true,
    comment: true,
    collection: true,
    category: true,
  };
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.getData();
    }
  }

  getData = () => {
    const { id } = this.props.match.params;
    this.props
      .getProductDetail({ skucd: id })
      .then(r => this.setState({ detail: false }));
    this.props
      .getProductRelational({ skucd: id })
      .then(r => this.setState({ relational: false }));
    this.props
      .getProductComment({ skucd: id })
      .then(r => this.setState({ comment: false }));

    this.props
      .getProductCollection({ skucd: id })
      .then(r => this.setState({ collection: false }));
    this.props
      .getProductAttribute({ skucd: id })
      .then(r => this.setState({ attribute: false }));
    this.props.getCategorys().then(r => this.setState({ category: false }));
  };

  render() {
    const {
      detail,
      relational,
      comment,
      collection,
      category,
      attribute,
    } = this.state;

    return (
      <Spin
        spinning={
          detail || relational || comment || collection || category || attribute
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
