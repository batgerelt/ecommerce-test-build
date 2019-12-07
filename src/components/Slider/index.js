/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/require-default-props */
import React from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Swiper from '@eredessil/react-id-swiper';
import windowSize from 'react-window-size';

class Slider extends React.Component {
  state = { width: 0 }
  changeScreen = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  componentDidMount() {
    window.addEventListener('resize', this.changeScreen);
    this.changeScreen();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.changeScreen);
  }

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
    const { width } = this.state;
    const {
      sliderData, intl, windowWidth, ratio, isRecipeDetail, isPackageDetail,
    } = this.props;
    const lang = intl.locale;

    const slideCount = ratio.split(":")[0];
    const slideRatio = ratio.split(":")[1];
    const widthRatio = slideRatio.split("x")[0];
    const heightRatio = slideRatio.split("x")[1];

    let sliderHeight;

    if (isRecipeDetail) {
      if (windowWidth >= 1200) {
        sliderHeight = Math.round(((1200 - 60) * (2 / 3)) * (heightRatio / widthRatio));
      } else if (windowWidth >= 992) {
        sliderHeight = Math.round(((992 - 60) * (2 / 3)) * (heightRatio / widthRatio));
      } else if (windowWidth >= 568) {
        sliderHeight = Math.round((568 - 30) * (heightRatio / widthRatio));
      } else {
        sliderHeight = Math.round((windowWidth - 30) * (heightRatio / widthRatio));
      }
    } else if (isPackageDetail) {
      if (windowWidth >= 1200) {
        sliderHeight = Math.round(((1200 - 40) * (3 / 4)) * (heightRatio / widthRatio));
      } else if (windowWidth >= 992) {
        sliderHeight = Math.round(((992 - 40) * (3 / 4)) * (heightRatio / widthRatio));
      } else if (windowWidth >= 568) {
        sliderHeight = Math.round(((568 - 20) * (3 / 4)) * (heightRatio / widthRatio));
      } else {
        sliderHeight = Math.round((windowWidth - 20) * (heightRatio / widthRatio));
      }
    } else {
      sliderHeight = Math.round(((windowWidth - (this.props.isMain ? 0 : 20)) / slideCount) * (heightRatio / widthRatio));
    }

    try {
      return sliderData.map((item, index) => {
        const container = (
          <div key={index} className="container pad10">
            {
              item && item.link ? (
                <a href={item && item.link ? item.link : '#'} target={item && item.link ? "_blank" : ''}>
                  <div className="slide-container">
                    <div className="slide-content text-uppercase">
                      {item && item.isshownm !== 0 && (
                        <div>
                          <h2 className="title">
                            {lang === "mn" ? item.bannernm : item.bannernm_en}
                          </h2>
                          <p className="text">
                            {lang === "mn" ? item.description : item.description_en}
                          </p>
                        </div>
                      )}
                      {item && item.link && (
                        <a href={item.link ? item.link : '#'} target="_blank" className="btn btn-main">
                          <i className="fa fa-long-arrow-right" aria-hidden="true" />
                          <span className="text-uppercase">
                            {item.btntext && item.btntext.trim()
                              ? lang === "mn" ? item.btntext : item.btntext_en
                              : intl.formatMessage({ id: "shared.form.button.more" })}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </a>
              ) : (
                <div className="slide-container">
                  <div className="slide-content text-uppercase">
                    {item && item.isshownm !== 0 && (
                      <div>
                        <h2 className="title">
                          {lang === "mn" ? item.bannernm : item.bannernm_en}
                        </h2>
                        <p className="text">
                          {lang === "mn" ? item.description : item.description_en}
                        </p>
                      </div>
                    )}
                    {item && item.link && (
                      <a href={item.link ? item.link : '#'} target="_blank" className="btn btn-main">
                        <i className="fa fa-long-arrow-right" aria-hidden="true" />
                        <span className="text-uppercase">
                          {item.btntext && item.btntext.trim()
                            ? lang === "mn" ? item.btntext : item.btntext_en
                            : intl.formatMessage({ id: "shared.form.button.more" })}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )
            }
          </div>
        );

        return (
          <div key={index} >
            <div
              className={this.props.contain ? "background-contain" : this.props.isMain ? 'background-cover-main' : 'background-cover'}
              style={{
                backgroundImage: `url(${process.env.IMAGE + (this.props.isMain ? (width < 767 ? item.mobimgnm : item.imgnm) : item.imgnm)})`,
                height: (this.props.isMain ? (width < 767 ? '300px' : sliderHeight + 100) : sliderHeight),
              }}
            >
              {
                item.brandid ? (
                  <Link
                    to={`/brand/${item.brandid}`}
                    onClick={() => this.handleDetail(item.brandid)}
                  >
                    {container}
                  </Link>
                ) : (
                    container
                  )
              }
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

export default windowSize(injectIntl(Slider));
