import React from "react";
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import { Collapse, Tabs, Divider, Button, message } from "antd";
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
    this.props.updateMain({ body: this.props.param }).then((res) => {
      if (res.payload.success) {
        localStorage.removeItem("username");
        this.props.logout();
        this.props.clearLocally();
      }
      MySwal.close();
    });
  }

  render() {
    return (
      <div className="checkout-container msg-bank">
        <div className="card-content" style={{ textAlign: "center" }}>
          <div className="button-container">
            <p style={{ fontSize: '14px' }}>
              {intl.formatMessage({ id: "profile.userProfile.form.swal.text" })}
            </p>
            <button className="btn btn-main" onClick={this.onSubmit} style={{ whiteSpace: "initial", width: "23em", marginBottom: "0.75em" }}>
              <span className="text-uppercase" style={{ fontWeight: "normal" }}>
                {intl.formatMessage({ id: "profile.userProfile.form.swal.button.updateEmail" })}
              </span>
            </button>
            <button className="btn btn-dark" onClick={this.handleChangeAddress} style={{ whiteSpace: "initial", width: "23em", marginBottom: "0.75em" }}>
              <span className="text-uppercase">
                {intl.formatMessage({ id: "profile.userProfile.form.swal.button.cancel" })}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SwalModals;
