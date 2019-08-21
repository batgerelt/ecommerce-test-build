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
      type: "warning",
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
    this.props.connectEpoint();
    MySwal.close();
  }

  render() {
    return (
      <div className="checkout-container msg-bank">
        <div className="card-content" style={{ textAlign: "center" }}>
          <div className="button-container">
            <strong>
              <p style={{ fontSize: '15px' }}>
                Та Имартын картаа 1 удаа холбосноор Ипойнт оноогоо ашиглах болон цуглуулах боломжтой. Мөн цуцлах боломжгүй тул зөв картаа холбоно уу.
              </p>
            </strong>
            <button
              className="btn btn-main"
              onClick={this.onSubmit}
              style={{
                hiteSpace: "initial",
                width: "auto",
                marginRight: "10px",
                backgroundColor: "#feb415",
              }}
            >
              <span className="text-uppercase" style={{ fontWeight: "normal" }}>
                ТИЙМ
              </span>
            </button>
            <button
              className="btn btn-dark"
              onClick={this.handleChangeAddress}
              style={{
                whiteSpace: "initial",
                width: "auto",
                backgroundColor: "#AAAAAA",
                border: "1px solid #AAAAAA",
              }}
            >
              <span className="text-uppercase">
                ҮГҮЙ
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SwalModals;
