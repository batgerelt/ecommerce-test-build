/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-extra-semi */
/* eslint-disable use-isnan */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable eol-last */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/newline-after-import */
import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col } from "antd";

class DeliveryPanel extends React.Component {
  state = {};

  render() {
    const { mainState, lang } = this.props;
    return (
      <Col span={24} style={{ marginBottom: '10px' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
          <div className="text d-flex delivery-info-message" style={{ padding: "0px 15px 0px 15px", borderRadius: "4px" }}>
            <i
              className="fa fa-info"
              aria-hidden="true"
            />
            <p className="text flex-this text-justify" style={{ fontSize: "13px" }}>{lang === 'mn' ? this.props.checkError(mainState.chosenDelivery.featuretxt) : this.checkError(mainState.chosenDelivery.featuretxt_en)}</p>
          </div>
        </Col>
      </Col>
    );
  }
}

export default injectIntl(Form.create({ name: "deliverypanel" })(DeliveryPanel));