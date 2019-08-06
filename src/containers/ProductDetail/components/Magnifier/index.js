import React from "react";
import PropTypes from "prop-types";
import ReactImageMagnify from "react-image-magnify";

import "./index.css";

class Magnifier extends React.Component {
  render() {
    const { smallImage, largeImage } = this.props;

    return (
      <ReactImageMagnify
        {...{
          smallImage: {
            isFluidWidth: true,
            src: process.env.IMAGE + smallImage,
            sizes: "(min-width: 780px) 100vw, (max-width: 1200px) 30vw, 360px",
          },
          largeImage: {
            src: process.env.IMAGE + largeImage,
            width: 1800,
            height: 1800,
          },
          enlargedImageContainerDimensions: {
            width: "250%",
            height: "200%",
          },
        }}
        className="image-magnify"
        style={{ zIndex: 15, objectFit: 'contain' }}
      />
    );
  }
}

Magnifier.propTypes = {
  smallImage: PropTypes.string.isRequired,
  largeImage: PropTypes.string.isRequired,
};

export default Magnifier;
