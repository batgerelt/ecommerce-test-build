/* eslint-disable react/no-danger */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import { message, Button } from "antd";

class List extends React.Component {
  state = { message: [] };

  handleLogin = () => {
    this.props.LoginModal.handleLoginModal();
  }

  renderSuccessTrue() {
    return (
      <div>
        <h3>Баталгаажуулалт амжилттай</h3>
        <p>
          Та өөрийн бүртгүүлсэн хаягаараа нэвтрэн орж худалдан авалтаа хийх
          боломжтой
        </p>
        <p>Манай системийн хэрэглэгч болсон танд баярлалаа!</p>
        <Button className="btn btn-black text-uppercase" onClick={this.handleLogin}>нэвтрэх</Button>
      </div>
    );
  }

  renderSuccessFalse() {
    return <Redirect to="/" />;
  }

  renderConfirm = () => {
    try {
      const { confirms } = this.props;
      console.log(confirms.success);
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
                    <img
                      style={{ width: "100%" }}
                      alt="logo"
                      src="http://test.emart.urto.mn/Uploads/Products/emartMallLogo.png"
                    />
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
