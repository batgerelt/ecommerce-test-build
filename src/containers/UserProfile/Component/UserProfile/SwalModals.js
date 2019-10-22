import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { message, notification, Col, Form, Input } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { intl } from '../../../../components/IntlGlobalProvider';

const MySwal = withReactContent(Swal);

class SwalModals extends React.Component {
  state = {};

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: false,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  componentWillMount() { }


  handleChangeAddress = () => {
    MySwal.close();
  }


  onSubmit = () => {
    let param = [];
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        param = {
          id: this.props.info.id,
          username: this.props.info.username,
          firstname: this.props.info.firstname,
          imgnm: this.props.info.imgnm,
          lastname: this.props.info.lastname,
          email: values.email,
          phonE1: this.props.info.phone1,
          phonE2: null,
          locid: this.props.main.locid,
          address: this.props.main.address,
          adrsid: this.props.main.id,
        };
        this.props.updateMain({ body: param }).then((res) => {
          if (res.payload.success) {
            localStorage.removeItem("username");
            notification.success({ message: intl.formatMessage({ id: "433" }), duration: 5 });
            MySwal.close();
          } else {
            message.warning(intl.formatMessage({ id: res.payload.code }));
          }
        }).catch(err => console.log(err));
      }
    });
  }

  render() {
    console.log(this.props);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="checkout-container msg-bank" style={{ padding: '0px !important' }}>
        <div className="card-content" style={{ textAlign: "center" }}>
          <div className="button-container">
            <Form>
              <Col span={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                  <span className="top-text">Имэйл хаяг</span>
                  <Form.Item>
                    {getFieldDecorator("mail", {
                      initialValue: this.props.info.email,
                    })(
                      <Input className="profile-custom-input" disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                  <span className="top-text">Шинэ имэйл хаяг</span>
                  <Form.Item>
                    {getFieldDecorator("email", {
                      rules: [{ required: true, message: "Имэйл хоосон байна.", type: "email" }],
                    })(
                      <Input className="profile-custom-input" />,
                    )}
                  </Form.Item>
                </Col>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                <p style={{ fontSize: '12px' }}>
                  {intl.formatMessage({ id: "profile.userProfile.form.swal.text" })}
                </p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pad10">
                  <button className="btn btn-main" onClick={this.onSubmit} style={{ width: "100%" }}>
                    <span style={{ fontWeight: "normal" }}>
                      {intl.formatMessage({ id: "profile.userProfile.form.swal.button.updateEmail" })}
                    </span>
                  </button>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pad10" >
                  <button className="btn btn-dark" onClick={this.handleChangeAddress} style={{ width: "100%" }}>
                    <span>
                      {intl.formatMessage({ id: "profile.userProfile.form.swal.button.cancel" })}
                    </span>
                  </button>
                </Col>
              </Col>
            </Form>
          </div>
        </div>
      </div >
    );
  }
}

export default Form.create({ name: "component" })(SwalModals);
