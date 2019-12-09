import React from 'react';

import { Slider } from "../../../components";

function PackageSlider({ images }) {
  const sliderParams = {
    spaceBetween: 0,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };

  return (
    <div className="content">
      <div className="main-slide">
        <Slider
          ratio="1:3x2"
          isPackageDetail
          sliderData={images}
          params={sliderParams}
          elContainer={"images"}
          contain
        />
      </div>
    </div>
  );
}

export default PackageSlider;
