/* eslint-disable react/require-default-props */
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Swiper from '@eredessil/react-id-swiper';
import styles from "./styles.less";

class Slider extends React.Component {
  renderRepice = () => {
    try {
      return this.props.data.map((item, index) => (
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
    const { data } = this.props;

    try {
      return data.map((item, index) => {
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
        // style={{ background: `url(${process.env.IMAGE + item.imgnm})` }}
        return (
          <div key={index}>
            <div className="background-cover" style={{ backgroundImage: `url(${process.env.IMAGE + item.imgnm})` }}>
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
      this.props.data.length !== 0 && (
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
  data: PropTypes.array.isRequired,
  elContainer: PropTypes.string.isRequired,
};

export default Slider;
