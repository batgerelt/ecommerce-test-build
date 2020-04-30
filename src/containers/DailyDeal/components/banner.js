/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class Banner extends Component {
  state = {
    time: 60,
    sec: '',
    secaraw: '',

    min: '',
    minaraw: '',
  }
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    setInterval(() => {
      // this.setState({
      //   time: this.state.time - 1,
      //   sec: `num${Math.floor(Math.floor(this.state.time % 60) / 10)}`,
      //   secM: `num${Math.floor(Math.floor(this.state.time % 60) % 10)}`,
      // });
      // console.log(Math.floor(3 % 5));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval();
  }

  onFinish = () => { }

  render() {
    return (
      <div className="sub_contents" style={{ width: "768px !important" }}>
        {/* <img src="http://ui.ssgcdn.com/ui/em/img/emall_obanjang/img_top_lc.png" alt="picture" style={{ width: "100% !important", height: "auto" }} /> */}
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
      </div >
    );
  }
}

export default injectIntl(Banner);
