/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import PropTypes from "prop-types";

class Banner extends React.Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    // const selected = data[Math.floor(Math.random() * data.length)];

    if (data) {
      return (
        <div className="banner-container">
          <span style={{ backgroundImage: `url(${process.env.IMAGE + data.imgnm})` }} />
          <div className="container pad10">
            <a href={data.link ? data.link : "#"} target="_blank">
              <img
                alt="banner"
                src={process.env.IMAGE + data.imgnm}
                className="img-fluid"
              />
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="banner-container">
        <span />
        <div className="container pad10" />
      </div>
    );
  }
}

Banner.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Banner;
