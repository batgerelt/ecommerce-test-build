/* eslint-disable react/require-default-props */
import React from "react";
import Swiper from "react-id-swiper";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./styles.less";

class Slider extends React.Component {
  render() {
    try {
      let repice = this.props.data.map((item, index) => (
        <div
          style={{ backgroundImage: `url(${process.env.IMAGE + item.imgnm})` }}
          key={index}
        />
      ));
      let indents = this.props.data.map((item, index) => {
        const container = (
          <div key={index} className="container pad10">
            <div className="slide-container">
              <div className="slide-content text-uppercase">
                {item && item.isshownm !== 0 && (
                  <div>
                    <h2 className="title">{item.bannernm}</h2>
                    <p className="text">{item.description}</p>
                  </div>
                )}
                {item && item.link && (
                  <Link to={item.link} className="btn btn-main" target="_blank">
                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                    <span className="text-uppercase">
                      {item.btntext && item.btntext.trim()
                        ? item.btntext
                        : "Дэлгэрэнгүй"}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );

        return (
          <div key={index}>
            <img alt={item.imgnm} src={process.env.IMAGE + item.imgnm} className={styles.brandImg} />
            {item.brandid ? (
              <Link to={item.brandid ? `/brand/${item.brandid}` : ""}>
                {container}
              </Link>
            ) : (
              container
            )}
          </div>
        );
      });

      return (
        this.props.data.length !== 0 && (
          <Swiper
            {...this.props.params}
            shouldSwiperUpdate
            rebuildOnUpdate
            className={this.props.elContainer}
          >
            {this.props.type ? repice : indents}
          </Swiper>
        )
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

Slider.propTypes = {
  params: PropTypes.object,
  data: PropTypes.array.isRequired,
  elContainer: PropTypes.string.isRequired,
};

export default Slider;
