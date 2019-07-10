/* eslint-disable react/no-danger */
import React from "react";
import { Link } from "react-router-dom";
import { message } from "antd";

class List extends React.Component {
  state = { message: [] };
  componentWillMount() {
    this.props.confirm({ key: this.props.match.params.key }).then((res) => {
      this.setState({ message: res.payload });
    });
  }
  renderSuccessTrue() {
    return (
      <div>
        <h3>Баталгаажуулалт амжилттай</h3>
        <p>
          Та өөрийн бүртгүүлсэн хаягаараа нэвтрэн орж худалдан авалт хийх
          боломжтой
        </p>
        <p>Манай системийн хэрэглэгч болсон танд баярлалаа!</p>
      </div>
    );
  }

  renderSuccessFalse() {
    return (
      <div>
        <h3>Баталгаажуулалт амжилтгүй</h3>
        <p>{this.state.message.data}</p>
      </div>
    );
  }
  render() {
    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10" />
          <div className="top-container">
            <div className="section">
              <div className="col-md-12">
                <center>
                  <div
                    className="logo"
                    style={{ width: "15%", marginBottom: "50px" }}
                  >
                    {/* <img
                      style={{ width: "100%" }}
                      alt="logo"
                      src={IMAGE + staticInfo.logopath}
                    /> */}
                  </div>
                  {this.state.message.success
                    ? this.renderSuccessTrue()
                    : this.renderSuccessFalse()}
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
