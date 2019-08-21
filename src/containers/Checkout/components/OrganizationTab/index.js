/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Form, Button, message } from "antd";

class OrganizationTab extends React.Component {
  state = {
    connected: false,
    loading: false,
    companyInfo: null,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() {
    const { state } = this.props;
    const { setFieldsValue } = this.props.form;
    this.props.onRef(this);
    if (state.companyInfo !== null) {
      setFieldsValue({ regno: state.companyInfo.name });
      this.setState({ companyInfo: state.companyInfo, connected: true });
    }
  }

  checkOrgValue = (e) => {
    let value = this.props.form.getFieldsValue(["regno"]);
    if (value.regno === undefined || value.regno === "") {
      return true;
    }
    return false;
  }

  edit = (e) => {
    const { setFieldsValue } = this.props.form;
    const { DeliveryInfo } = this.props;
    setFieldsValue({ regno: "" });
    DeliveryInfo.setOrganizationData([]);
    this.setState({ companyInfo: null, connected: false, loading: false });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { setFieldsValue, validateFields } = this.props.form;
    const { DeliveryInfo } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.props.getCompanyInfo({ regno: values.regno }).then((res) => {
          this.setState({ loading: false });
          if (res.payload.success) {
            if (res.payload.data.name !== "") {
              let value = { regno: values.regno, name: res.payload.data.name };
              DeliveryInfo.setOrganizationData(value);
              setFieldsValue({ regno: res.payload.data.name });
              this.setState({ companyInfo: value, connected: true });
            } else {
              message.warning("Байгууллага олдсонгүй.");
            }
          }
        });
      }
    });
  }

  renderForm = () => {
    const { intl } = this.props;
    const { connected, loading } = this.state;
    try {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.onSubmit}>
          <div className="row row10 checkoutFormContainer">
            <div className="col-xl-6 pad10">
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("regno", {
                    rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.company.regNo.validation.required" }) }],
                  })(
                    <Input size="large" autoComplete="off" type="text" placeholder={intl.formatMessage({ id: "shared.form.company.regNo.placeholder" })} disabled={connected} className="col-md-12" />,
                  )}
                </Form.Item>
              </div>
            </div>
          </div>
          {
            !connected ?
              <Button loading={loading} className="btn btn-main solid" htmlType="submit"><FormattedMessage id="shared.form.button.connect" /></Button> :
              <Button loading={loading} className="btn btn-main solid" onClick={this.edit}><FormattedMessage id="shared.form.button.edit" /></Button>
          }
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
