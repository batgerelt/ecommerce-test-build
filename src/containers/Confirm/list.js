/* eslint-disable react/no-danger */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import { message } from "antd";

class List extends React.Component {
  state = { message: [] };

  renderSuccessTrue() {
    return (
      <div>
        <h3>Баталгаажуулалт амжилттай</h3>
        <p>
          Та өөрийн бүртгүүлсэн хаягаараа нэвтрэн орж худалдан авалтаа хийх
          боломжтой
        </p>
        <p>Манай системийн хэрэглэгч болсон танд баярлалаа!</p>
      </div>
    );
  }

  renderSuccessFalse() {
    return <Redirect to="/" />;
  }

  renderConfirm = () => {
    try {
      const { confirms } = this.props;
      if (confirms.success) {
        return this.renderSuccessTrue();
      }
      return this.renderSuccessFalse();
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    const { confirms } = this.props;
    console.log(this.props);
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
                  {confirms.length === 0 ? null : this.renderConfirm()}
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
