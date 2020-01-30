import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginModal } from "../../components/Login";
import {
  Auth as AuthModel,
  Banner as BannerModel,
  Menu as MenuModel,
  Cart as CartModel,
  Search as SearchModel,
  New,
} from "../../models";
import List from "./list";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.banner,
  ...state.product,
  ...state.menu,
  ...state.cart,
  ...state.search,
  ...state.new,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...AuthModel,
    ...BannerModel,
    ...MenuModel,
    ...CartModel,
    ...SearchModel,
    ...New,
  }, dispatch),
});

class Page extends React.Component {
  state = { banner: { header: [], footer: [] } }
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.getNewMenu({});

    // Хандалт бүрт санамсаргүйгээр харуулж байгаа ба setState хийх үед солигдоод байсныг нь энд оруулав
    this.props.getNewBanner().then((res) => {
      if (res.payload.success) {
        const { banner } = this.state;

        banner.header = res.payload.data.header;
        banner.footer = res.payload.data.footer[Math.floor(Math.random() * res.payload.data.footer.length)];

        this.setState({ banner });
      }
    });
  }

  render() {
    return (
      <div>
        <List {...this.props} {...this} {...this.state} />
        <LoginModal onRef={ref => (this.LoginModal = ref)} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
