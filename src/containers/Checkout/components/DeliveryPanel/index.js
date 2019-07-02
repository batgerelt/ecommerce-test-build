import React from "react";
import { connect } from "react-redux";
import { Icon, Tabs, Input, Form, Select, DatePicker } from "antd";
import api from "../../api";
import moment from "moment";

import { FormInput } from "../../components/masked-input";

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const formatter = new Intl.NumberFormat("en-US");

@connect(mapStateToProps)
class DeliveryPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAddress: [],
      addresstype: "edit",
      userInfo: [],
      userAddress: [],
      epointcard: null,
    };
  }

  deliveryInfo = () => (
    <div className="title-container flex-space">
      <h5 className="title">
        <a className="flex-this">
          <i className="fa fa-credit-card" aria-hidden="true" />
          <span>Хүргэлтийн төрөл</span>
        </a>
      </h5>
    </div>
  );

  render() {
    const { getFieldDecorator } = this.props.form;
    const style = {
      color: "#feb415",
    };
    return (
      <Tabs
        onChange={e => changeTab(e, this.props.form)}
        defaultActiveKey="1"
      />
    );
  }
}

export default Form.create({ name: "checkoutdelivery" })(DeliveryPanel);
