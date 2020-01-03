import React, { Component } from 'react';
import Slider from "@eredessil/react-id-swiper";
import bannerd0 from "./assets/banner-d-0.jpg";
import bannerd1 from "./assets/banner-d-1.gif";
import bannerd2 from "./assets/banner-d-2.gif";
import bannerd3 from "./assets/banner-d-3.gif";
import bannerd4 from "./assets/banner-d-4.gif";

import bannerm0 from "./assets/banner-m-0.jpg";
import bannerm1 from "./assets/banner-m-1.gif";
import bannerm2 from "./assets/banner-m-2.gif";
import bannerm3 from "./assets/banner-m-3.gif";
import bannerm4 from "./assets/banner-m-4.gif";

const content = [
  { title: "", imgd: bannerd0, imgm: bannerm0 },
  { title: "", imgd: bannerd1, imgm: bannerm1 },
  { title: "", imgd: bannerd4, imgm: bannerm4 },
  { title: "", imgd: bannerd3, imgm: bannerm3 },
  { title: "", imgd: bannerd2, imgm: bannerm2 },
];

const sliderParams = {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
  spaceBetween: 0,
};

class homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const { width } = this.state;
    return (
      <React.Fragment>
        <div className="coming-soon-page emart-container">
          <Slider {...sliderParams}>
            {content.map((article, index) => (
              <img alt={index} src={width >= 750 ? article.imgd : article.imgm} className="slider-content" />
            ))}
          </Slider>
        </div>
      </React.Fragment>
    );
  }
}

export default homepage;
