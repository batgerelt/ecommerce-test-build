/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message, notification, Col } from "antd";
import KrillInput from "../../../../components/Input/KrillInput";

class OrganizationTab extends React.Component {
  state = {
    connected: false,
  };

  checkOrgValue = (e) => {
    let value = this.props.form.getFieldsValue(["regno"]);
    if (value.regno === undefined || value.regno === "") {
      return true;
    }
    return false;
  }

  edit = (e) => {
    e.preventDefault();
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ regno: "" });
    this.props.setOrganizationData([]);
    this.props.changeCompanyInfo(null);
    this.setState({ connected: false });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { setFieldsValue, validateFields } = this.props.form;
    const { intl } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.props.getCompanyInfo({ regno: values.regno }).then((res) => {
          if (res.payload.success) {
            if (res.payload.data.name !== "") {
              let value = { regno: values.regno, name: res.payload.data.name };
              this.props.setOrganizationData(value);
              setFieldsValue({ regno: res.payload.data.name });
              this.props.changeCompanyInfo(value);
              this.setState({ connected: true });
            } else {
              notification.warning({
                message: intl.formatMessage({ id: "checkout.extra.organization.info" }),
                duration: 3,
              });
            }
          }
        });
      }
    });
  }

  renderForm = () => {
    const { intl } = this.props;
    const { connected } = this.state;
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form>
          <div className="row row10 checkoutFormContainer">
            <Col span={24} className="org-container padd10">
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10" />
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
                <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                  <div className="form-group">
                    <Form.Item>
                      {getFieldDecorator("regno", {
                        rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.company.regNo.validation.required" }) }],
                      })(
                        <KrillInput
                          size="large"
                          autoComplete="new-password"
                          type="text"
                          placeholder={intl.formatMessage({ id: "shared.form.company.regNo.placeholder" })}
                          disabled={connected}
                          className="col-md-12"
                          style={{ paddingLeft: '10px' }}
                        />,
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8} className="padd10">
                  {
                    !connected ?
                      <button className="second-btn btn btn-dark col-md-12" onClick={this.onSubmit}><FormattedMessage id="shared.form.button.connect" /></button> :
                      <button className="second-btn btn btn-dark col-md-12" onClick={this.edit}><FormattedMessage id="shared.form.button.edit" /></button>
                  }
                </Col>
              </Col>
            </Col>
          </div>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderForm();
  }
}

export default injectIntl(Form.create({ name: "organization" })(OrganizationTab));
