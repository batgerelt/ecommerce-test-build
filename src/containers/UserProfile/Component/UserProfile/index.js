import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from "./list";
import {
  Auth as AuthModel,
  Profile as ProfileModel,
} from "../../../../models";

const mapStateToProps = state => ({
  ...state.auth,
  ...state.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    AuthModel,
    ...ProfileModel,
  }, dispatch),
});

class UserProfile extends React.Component {
  componentWillMount() {
    this.props.getUserInfo({ custid: this.props.data[0].info.customerInfo.id }).then((res) => {
      if (res.payload.success) {
        this.props.getDistrictLocation({ id: res.payload.data.main.provinceid });
        this.props.getCommmitteLocation({ provid: res.payload.data.main.provinceid, distid: res.payload.data.main.districtid });
      }
      this.props.getSystemLocation();
    });
    this.props.getCustomer({ custid: this.props.data[0].info.customerInfo.id });
  }
  render() {
    return <List {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
