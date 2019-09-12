/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable react/jsx-no-target-blank */
// 179700
import React from "react";

class Banner extends React.Component {
  render() {
    try {
      const { data } = this.props;
      const selected = data.length === undefined ? data : data[Math.floor(Math.random() * data.length)];

      return (
        <div className="banner-container">
          <span style={{ backgroundImage: `url(${process.env.IMAGE + selected.imgnm})` }} />
          <div className="container pad10">
            <a href={selected.link ? selected.link : "#"} target="_blank">
              <img
                id="banner-image-id"
                alt="banner"
                src={process.env.IMAGE + selected.imgnm}
                className="img-fluid"
              />
            </a>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }
}

export default Banner;
