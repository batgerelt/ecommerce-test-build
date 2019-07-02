import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Spin } from "antd";
import List from "./list";
import { Loader } from "../../components";

class Page extends React.Component {
  state = {};

  render() {
    return <List {...this.props} />;
  }
}

export default Page;
