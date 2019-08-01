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
  ...state.category,
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
  state = { loading: true };

  async componentWillMount() {
    const { id } = this.props.match.params;
    this.props.getProductDetail({ skucd: id }).then(r => this.setState({ loading: false }));

    this.getData();
  }

  async componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.setState({ loading: true });
      this.getData();
    }
  }

  getData = () => {
    const { id } = this.props.match.params;

    this.props.getProductRelational({ skucd: id });
    this.props.getProductComment({ skucd: id });
    this.props.getProductCollection({ skucd: id });
    this.props.getProductAttribute({ skucd: id });

    if (localStorage.getItem("auth") !== null) {
      this.props.getProductRate({ skucd: id });
      this.props.addViewList({ skucd: id });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin
        spinning={loading}
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
