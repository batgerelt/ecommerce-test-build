import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import {
  Category as CategoryModel,
  Filter as FilterModel,
  Cart as CartModel,
  Auth as AuthModel,
  Product as ProductModel,
} from "../../models";
import List from "./list";
import { Loader } from "../../components";
import { LoginModal } from "../../components/Login";

const mapStateToProps = state => ({
  ...state.category,
  ...state.filter,
  ...state.cart,
  ...state.auth,
  ...state.product,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      ...CategoryModel,
      ...FilterModel,
      ...CartModel,
      ...AuthModel,
      ...ProductModel,
    },
    dispatch,
  ),
});

class Page extends React.Component {
  state = { isloading: true, isloadingCat: true };

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      this.setState({
        isloading: true, isloadingCat: true,
      }, () => {
        this.getData();
      });
    }
  }


  getData = () => {
    this.setState({ isloading: true });
    this.props.getCategoryInfo({ id: this.props.match.params.id }).then((res) => { this.setState({ isloadingCat: false }); });
    this.props.categoryFilter({
      body: {
        catid: this.props.match.params.id,
        parameters: [],
        minprice: 0,
        maxprice: 0,
        ordercol: "price_asc",
        rowcount: 20,
        startswith: 0,
      },
    }).then((res) => {
      this.setState({ isloading: false });
    });
  }

  render() {
    const { isloading, isloadingCat } = this.state;
    return (
      <Spin
        spinning={isloadingCat}
        indicator={<Loader />}
      >
        <List {...this.props} {...this} id={this.props.match.params.id} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </Spin>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
