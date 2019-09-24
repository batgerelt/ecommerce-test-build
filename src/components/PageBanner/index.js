import React from "react";
import { injectIntl } from 'react-intl';

class PageHeader extends React.Component {
  state = {
    title: "",
    subtitle: "",
    banners: [],
    bgColor: "#feb415",
    selected: [],
  };

  componentWillMount() {
    this.setState({ ...this.props });
    this.setState({
      selected: this.props.banners[
        Math.floor(Math.random() * this.props.banners.length)
      ],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.banners.length !== nextProps.banners.length) {
      this.setState({
        selected: nextProps.banners[
          Math.floor(Math.random() * nextProps.banners.length)
        ],
      });
    }
  }

  changeLocation = () => {
    if (this.state.selected !== undefined) {
      window.open(
        this.state.selected.link ? this.state.selected.link : " ",
        this.state.selected ? "_blank" : " ",
      );
    }
  };

  renderContent = () => {
    try {
      const { title, subtitle, bgColor } = this.props;
      return (
        <div
          className="whole-page-title class container banner-pad"
          style={{
            backgroundImage: `url(${
              this.state.selected === undefined
                ? ""
                : process.env.IMAGE + this.state.selected.imgnm
              })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundSize: "50% 115px",
            backgroundColor: `${bgColor}`,
          }}
          onClick={this.changeLocation}
        >
          <div className="container">
            <div className="title-container flex-space">
              <h2>
                <span className="big">{title}</span>
                <strong>{subtitle}</strong>
              </h2>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    try {
      const { bgColor } = this.props;
      return (
        <div
          className="whole-page-title"
          style={{ padding: "0", backgroundColor: `${bgColor}` }}
        >
          {this.renderContent()}
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

export default injectIntl(PageHeader);
