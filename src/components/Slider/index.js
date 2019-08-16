/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/require-default-props */
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Swiper from '@eredessil/react-id-swiper';
import styles from "./styles.less";

class Slider extends React.Component {
  renderRepice = () => {
    try {
      return this.props.sliderData.map((item, index) => (
        <div
          style={{ backgroundImage: `url(${process.env.IMAGE + item.imgnm})` }}
          key={index}
        />
      ));
    } catch (error) {
      return console.log(error);
    }
  };

  handleDetail = (id) => {
    this.props.searchProductBrand({ id });
  }

  renderIndents = () => {
    const { sliderData } = this.props;

    try {
      return sliderData.map((item, index) => {
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
                  <a href={item.link ? item.link : '#'} target="_blank" className="btn btn-main">
                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                    <span className="text-uppercase">
                      {item.btntext && item.btntext.trim()
                        ? item.btntext
                        : "Дэлгэрэнгүй"}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
        // style={{ background: `url(${process.env.IMAGE + item.imgnm})` }}
        return (
          <div key={index}>
            <div
              className={this.props.contain ? "background-contain" : "background-cover"}
              style={{ backgroundImage: `url(${process.env.IMAGE + item.imgnm})` }}
            >
              {item.brandid ? (
                <Link
                  to={`/brand/${item.brandid}`}
                  onClick={() => this.handleDetail(item.brandid)}
                  style={{ padding: '100%' }}
                >
                  {container}
                </Link>
              ) : (
                  container
                )}
            </div>
          </div>
        );
      });
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return (
      this.props.sliderData.length !== 0 && (
        <Swiper
          {...this.props.params}
          shouldSwiperUpdate
          rebuildOnUpdate
          className={this.props.elContainer}
        >
          {this.props.type ? this.renderRepice() : this.renderIndents()}
        </Swiper>
      )
    );
  }
}

Slider.propTypes = {
  params: PropTypes.object,
  sliderData: PropTypes.array.isRequired,
  elContainer: PropTypes.string.isRequired,
};

export default Slider;
