import React from "react";
import { Divider } from "antd";

class Component extends React.Component {
  state = {};

  render() {
    console.log("Профайл хуудас", this.props);
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Профайл хуудас</span>
          </p>
          <div className="user-profile-contain">
            <div className="row row10">
              <div className="col-md-12">
                <p>Имарт карт</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
