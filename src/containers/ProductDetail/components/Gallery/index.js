/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable radix */
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PropTypes from "prop-types";
import Lightbox from "react-images";

import Magnifier from "../Magnifier";
import Label from "../Label";
import { LABEL_TYPES } from "../../../../utils/Consts";

class Gallery extends Component {
  state = {
    isLightBoxOpen: false,
    current: 0,
  };

  handleThumbnailClick = (e) => {
    e.preventDefault();
    this.setState({ current: parseInt(e.target.parentElement.getAttribute("name")) });
  };

  handleImageClick = () => {
    this.setState({ isLightBoxOpen: true });
  };

  handleLightBoxThumbnailClick = (index) => {
    this.setState({ current: index });
  };

  handleLightBoxClose = () => {
    this.setState({ isLightBoxOpen: false });
  };

  handleLightBoxClickPrev = () => {
    this.setState({
      current: this.state.current > 0 ? this.state.current - 1 : 0,
    });
  };

  handleLightBoxClickNext = () => {
    this.setState({
      current:
        this.state.current < this.props.images.length - 1
          ? this.state.current + 1
          : this.props.images.length - 1,
    });
  };

  renderImages = () => this.props.images.map(image => ({
    src: `${process.env.IMAGE}${image.lrgimg}`,
  }))

  renderMagnify = () => {
    try {
      const { images } = this.props;
      const { current } = this.state;
      return (
        <Magnifier
          smallImage={images.length > current ? images[current].mdmimg : images[0].mdmimg}
          largeImage={images.length > current ? images[current].lrgimg : images[0].lrgimg}
        />
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    try {
      const { images, tags, intl } = this.props;
      const { current, isLightBoxOpen } = this.state;
      return (
        <div className="product-gallery">
          <div className="perimeter">
            <div className="image" onClick={this.handleImageClick}>
              {!!tags && !!tags.length && (
                <div style={{ position: "absolute", top: "5px", left: "15px" }}>
                  {tags.map((label, index) => (
                    <Label
                      key={index}
                      type={LABEL_TYPES.vertical}
                      data={label}
                      seq={index}
                    />
                  ))}
                </div>
              )}
              {this.renderMagnify()}
            </div>
          </div>

          {images && (
            <div className="thumbs">
              <ul className="list-inline">
                {images.map((image, index) => (
                  <li key={index} className="list-inline-item">
                    <a
                      className="image-container"
                      onClick={this.handleThumbnailClick}
                      name={index}
                    >
                      <img
                        alt={`image${index}`}
                        className={`image${index}`}
                        src={`${process.env.IMAGE}${image.mniimg}`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Lightbox
            images={this.renderImages()}
            currentImage={current}
            showThumbnails
            closeButtonTitle={intl.formatMessage({ id: "gallery.button.close" })}
            backdropClosesModal
            enableKeyboardInput
            imageCountSeparator={intl.formatMessage({ id: "gallery.label.from" })}
            isOpen={isLightBoxOpen}
            onClickPrev={this.handleLightBoxClickPrev}
            onClickNext={this.handleLightBoxClickNext}
            onClose={this.handleLightBoxClose}
            onClickThumbnail={this.handleLightBoxThumbnailClick}
          />
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
  tags: PropTypes.array,
};

export default injectIntl(Gallery);
