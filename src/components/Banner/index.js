/* eslint-disable no-multi-spaces */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable react/jsx-no-target-blank */
// 179700
import React from "react";

class Banner extends React.Component {
  state = { width: window.innerWidth }
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

  render() {
    try {
      const { data } = this.props;
      const { width } = this.state;
      const selected = data.length === undefined ? data : data[0];
      // this.getImageColor(process.env.IMAGE + selected.imgnm);
      return (
        <div className="d-flex" style={{ height: `${width < 767 ? '200px' : 'auto'}` }}>
          <span className="page_header_banner_left" style={{ backgroundColor: selected.lcolor }} />
          <div className="container m-0 p-0">
            <a href={selected.link ? selected.link : "#"} target="_blank">
              <img
                id="banner-image-id"
                alt="banner"
                src={process.env.IMAGE + (width < 767 ?  selected.mobimgnm : selected.imgnm)}
                className="img-fluid middle-panner"
              />
            </a>
          </div>
          <span className="page_header_banner_rigth" style={{ backgroundColor: selected.rcolor }} />
        </div>
      );
    } catch (error) {
      return null;
    }
  }
}

export default Banner;
