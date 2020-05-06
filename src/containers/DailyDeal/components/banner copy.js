/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class Banner extends Component {
  state = {
    timeInSeconds: 3620,

    hourd: "num0",
    hour: "num0",
    mind: "num0",
    minutes: "num0",
    secd: "num0",
    seconds: "num0",
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    setInterval(() => {
      this.conTime(this.state.timeInSeconds < 0 ? 0 : this.state.timeInSeconds);
      this.setState({ timeInSeconds: this.state.timeInSeconds - 1 });
    }, 1000);
  }

  conTime = (time) => {
    let d = Number(time);
    let hh = 0;
    let mm = 0;
    let ss = 0;
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    if (h < 10) {
      hh = 0;
    } else {
      hh = Math.floor(h / 10);
      h = Math.floor(h % 10);
    }
    if (m < 10) {
      ss = 0;
    } else {
      mm = Math.floor(m / 10);
      m = Math.floor(m % 10);
    }
    if (s < 10) {
      ss = 0;
    } else {
      ss = Math.floor(s / 10);
      s = Math.floor(s % 10);
    }
    this.setState({
      secd: `num${ss}`,
      seconds: `num${s}`,
      mind: `num${mm}`,
      minutes: `num${m}`,
      hourd: `num${hh}`,
      hour: `num${h}`,
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  onFinish = () => { }

  render() {
    return (
      <div className="sub_contents" tyle={{ width: "768px !important" }}>
        <div id="bg_sub" className="bg_obanjang" />
        <div className="header_obanjang notranslate" style={{ display: "block" }} >
          <div className="time_counter">
            <em className={this.state.hourd} />
            <em className={this.state.hour} />

            <em className="color" />

            <em className={this.state.mind} />
            <em className={this.state.minutes} />

            <em className="color" />

            <em className={this.state.secd} />
            <em className={this.state.seconds} />

          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Banner);
/* <div className="sub_contents" style={{ width: "768px !important" }}>
        <div id="bg_sub" className="bg_obanjang" />
        <div className="header_obanjang notranslate" style={{ display: "block" }}>
          <div className="time_counter">
            <em className="num0" />
            <em className="num0" />

            <em className="color" />

            <em className="num0" />
            <em className="num0" />

            <em className="color" />

            <em className="num0" />
            <em className="num0" />
          </div>
        </div>
      </div > */
/* <div className="sub_contents" style={{ width: "768px !important" }}>
        <div id="bg_sub_mobile" className="bg_obanjang_mobile" />
        <div className="header_obanjang_mobile" style={{ display: "block" }} >
          <div className="time_counter_mobile">
            <em className="num0" />
            <em className="num0" />
          </div>
        </div>
      </div> */
