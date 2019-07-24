import React from "react";
import { connect } from "react-redux";
import { Collapse, Tabs, Divider, Button, message } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
      console.log(res.payload);
      if (res.payload.success) {
        message.success(res.payload.message);
        /* if (!res.payload.data) {
                  message.warning(res.payload.message);
                  console.log("clear");
                  localStorage.removeItem("username");
                  this.props.logout();
                  this.props.clearLocally();
                } */
      }
      MySwal.close();
    });
  }

  render() {
    return (
      <div className="checkout-container msg-bank">
        <div className="card-content" style={{ textAlign: "center" }}>
          <div className="button-container">
            <p style={{ fontSize: '14px' }}>Та имэйл хаягаа шинэчлэх тохиолдолд шинэ имэйл хаягаараа баталгаажуулалт хийхийг анхаарна уу</p>
            <button className="btn btn-main" onClick={this.onSubmit} style={{ whiteSpace: "initial", width: "23em", marginBottom: "0.75em" }}>
              <span className="text-uppercase" style={{ fontWeight: "normal" }}>ИМэйл хаяг шинэчлэх</span>
            </button>
            <button className="btn btn-dark" onClick={this.handleChangeAddress} style={{ whiteSpace: "initial", width: "23em", marginBottom: "0.75em" }}>
              <span className="text-uppercase">Болих</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SwalModals;
