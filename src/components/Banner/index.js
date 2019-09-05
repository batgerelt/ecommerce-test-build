/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable react/jsx-no-target-blank */
// 179700
import React from "react";
import PropTypes from "prop-types";
import { test } from "../../scss/assets/images/demo/1.jpg";

class Banner extends React.Component {
  getImageBorderColor = (url, x, y) => {
    /* let img = new Image();
    img.src = url;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    // context.drawImage(img, 0, 0, img.width, img.height);
    console.log(img, url); */
    // return context.getImageData(x, y, 1, 1).data;
  }

  componentDidMount() {
    /*  const { data } = this.props;
     const selected = data.length === undefined ? data : data[Math.floor(Math.random() * data.length)];
     console.log(process.env.IMAGE + selected.imgnm);
     const canvas = document.createElement('canvas');
     const context = canvas.getContext('2d');
     const img = new Image();
     img.crossOrigin = "Anonymous";
     img.onload = () => {
       context.drawImage(img, 0, 0, 100, 100);
       URL.revokeObjectURL(img.src);
       console.log(context.getImageData(0, 0, 100, 100).data);
     };
     img.src = process.env.IMAGE + selected.imgnm; */
  }

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
