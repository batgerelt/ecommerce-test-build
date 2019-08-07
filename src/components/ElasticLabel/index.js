/* eslint-disable no-unreachable */
import React, { Component } from "react";
import Style from "style-it";

class index extends Component {
  renderNew = () => {
    try {
      const color = "green";
      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
              }
            `}
          <div className="label medium-image-magnify" style={{ zIndex: 100 }}>
            <Style>
              {`
              .text {
                position: relative;
                display: block;
                width: 46px;
                height: 30px;
                background-color: ${color};
                text-align: center;
                font-size: ${"1.7"}rem;
                color: white;
                letter-spacing: -1px;
                vertical-align: top;
                border-radius: 5px;
                z-index: 1;
                line-height: 30px;
              }
              .text:before, .text:after {
                z-index: 0;
                position: absolute;
                content: '';
                background-color: ${color};
                width: 26px;
                height: 26px;
                top: -11px;
                -webkit-transform: rotate(-45deg) skew(15deg, 15deg);
                -moz-transform: rotate(-45deg) skew(15deg, 15deg);
                -ms-transform: rotate(-45deg) skew(15deg, 15deg);
                -o-transform: rotate(-45deg) skew(15deg, 15deg);
                transform: rotate(-45deg) skew(15deg, 15deg);
                border-radius: 3px;
                left: 10px;
              }
              .text:after {
                top: 15px;
              }
              .text strong {
                font-weight: 400;
                position: relative;
                z-index: 1;
              }
              .text small {
                position: relative;
                z-index: 1;
                font-size: ${"0.7"}rem;
                display: inline-block;
                margin-left: 2px;
                line-height: 1.2;
                letter-spacing: 1px;
                bottom: 6px;
              }
            `}
              <span className="text">
                <div>
                  <small>{"ШИНЭ"}</small>
                </div>
              </span>
            </Style>
          </div>
        </Style>
      );
    } catch (error) {
      return console.log("error: ", error);
    }
  };

  renderSale = () => {
    try {
      const { data } = this.props;
      const color = "yellow";
      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
                top: 70px;
              }
            `}
          <div className="label medium-image-magnify" style={{ zIndex: 100 }}>
            <Style>
              {`
              .text {
                position: relative;
                display: block;
                width: 46px;
                height: 30px;
                background-color: ${color};
                text-align: center;
                font-size: ${"1.7"}rem;
                color: white;
                letter-spacing: -1px;
                vertical-align: top;
                border-radius: 5px;
                z-index: 1;
                line-height: 30px;
              }
              .text:before, .text:after {
                z-index: 0;
                position: absolute;
                content: '';
                background-color: ${color};
                width: 26px;
                height: 26px;
                top: -11px;
                -webkit-transform: rotate(-45deg) skew(15deg, 15deg);
                -moz-transform: rotate(-45deg) skew(15deg, 15deg);
                -ms-transform: rotate(-45deg) skew(15deg, 15deg);
                -o-transform: rotate(-45deg) skew(15deg, 15deg);
                transform: rotate(-45deg) skew(15deg, 15deg);
                border-radius: 3px;
                left: 10px;
              }
              .text:after {
                top: 15px;
              }
              .text strong {
                font-weight: 400;
                position: relative;
                z-index: 1;
              }
              .text small {
                position: relative;
                z-index: 1;
                font-size: ${"0.7"}rem;
                display: inline-block;
                margin-left: 2px;
                line-height: 1.2;
                letter-spacing: 1px;
                bottom: 6px;
              }
            `}
              <span className="text">
                <div>
                  <strong>{data.salepercent}</strong>
                  <small>%</small>
                </div>
              </span>
            </Style>
          </div>
        </Style>
      );
    } catch (error) {
      return console.log("error: ", error);
    }
  };

  renderUnavailable = () => {
    try {
      const { data } = this.props;
      const color = "black";
      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
                top: 127px;
              }
            `}
          <div className="label medium-image-magnify" style={{ zIndex: 100 }}>
            <Style>
              {`
              .text {
                position: relative;
                display: block;
                width: 46px;
                height: 30px;
                background-color: ${color};
                text-align: center;
                font-size: ${"1.7"}rem;
                color: white;
                letter-spacing: -1px;
                vertical-align: top;
                border-radius: 5px;
                z-index: 1;
                line-height: 30px;
              }
              .text:before, .text:after {
                z-index: 0;
                position: absolute;
                content: '';
                background-color: ${color};
                width: 26px;
                height: 26px;
                top: -11px;
                -webkit-transform: rotate(-45deg) skew(15deg, 15deg);
                -moz-transform: rotate(-45deg) skew(15deg, 15deg);
                -ms-transform: rotate(-45deg) skew(15deg, 15deg);
                -o-transform: rotate(-45deg) skew(15deg, 15deg);
                transform: rotate(-45deg) skew(15deg, 15deg);
                border-radius: 3px;
                left: 10px;
              }
              .text:after {
                top: 15px;
              }
              .text strong {
                font-weight: 400;
                position: relative;
                z-index: 1;
              }
              .text small {
                position: relative;
                z-index: 1;
                font-size: ${"0.7"}rem;
                display: inline-block;
                margin-left: 2px;
                line-height: 1.2;
                letter-spacing: 1px;
                bottom: 6px;
              }
            `}
              <span className="text">
                <div>
                  <small>ДУУССАН</small>
                </div>
              </span>
            </Style>
          </div>
        </Style>
      );
    } catch (error) {
      return console.log("error: ", error);
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div style={{ padding: "15px 8px" }}>
        {data.isnew ? this.renderNew() : null}
        {data.salepercent !== 0 ? this.renderSale() : null}
        {!data.isavailable ? this.renderUnavailable() : null}
      </div>
    );
  }
}

export default index;
