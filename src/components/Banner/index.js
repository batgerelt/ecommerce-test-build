/* eslint-disable react/jsx-no-target-blank */
// 179700
import React from "react";
import PropTypes from "prop-types";
import { test } from "../../scss/assets/images/demo/1.jpg";

class Banner extends React.Component {
  getImageBorderColor = (url, x, y) => {
    let img = new Image();
    img.src = test;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    console.log(context);
  }

  render() {
    try {
      const { data } = this.props;
      const selected = data.length === undefined ? data : data[Math.floor(Math.random() * data.length)];
      // this.getImageBorderColor(process.env.IMAGE + selected.imgnm, 1, 1);
      // console.log(this.getImageBorderColor(process.env.IMAGE + selected.imgnm, 1, 1), "test");
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
      return (
        <div className="banner-container">
          <span />
          <div className="container pad10" />
        </div>
      );
    }
  }
}

Banner.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Banner;
