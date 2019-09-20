/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable react/jsx-no-target-blank */
// 179700
import React from "react";

class Banner extends React.Component {
  getImageColor = (src) => {
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = src;
    // eslint-disable-next-line func-names
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      let data = context.getImageData(0, 0, width, height).data;
      console.log(data);
    };
  }

  render() {
    try {
      const { data } = this.props;
      const selected = data.length === undefined ? data : data[Math.floor(Math.random() * data.length)];
      this.getImageColor(process.env.IMAGE + selected.imgnm);
      console.log(process.env.IMAGE + selected.imgnm);
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
