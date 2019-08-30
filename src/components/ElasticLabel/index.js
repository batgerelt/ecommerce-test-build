/* eslint-disable indent */
/* eslint-disable no-unreachable */
import React, { Component } from "react";
import Style from "style-it";

class index extends Component {
  renderNew = (lang) => {
    try {
      const { tags, list, data } = this.props;
      const style = list
        ? `
        bottom: 35px; 
        margin: auto auto auto ${
        !data.isavailable
          ? data.salepercent !== 0
            ? "400px"
            : "450px"
          : data.salepercent !== 0
            ? "450px"
            : "500px"
        };
        `
        : `display: block;
        position: absolute;`;
      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
                ${style}
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
                background-color: ${
                tags.find(tag => tag.slug === "new") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "new").color
                };
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
                background-color: ${
                tags.find(tag => tag.slug === "new") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "new").color
                };
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
                  <small>
                    {lang === "mn" || lang === null
                      ? tags.find(tag => tag.slug === "new").name
                      : tags.find(tag => tag.slug === "new").nameen}
                  </small>
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
      const { data, tags, list } = this.props;
      const style = list
        ? `
        bottom: 35px; 
        margin: auto auto auto ${!data.isavailable ? "450px" : "500px"};
        `
        : `top: ${data.isnew ? "70px" : "15px"}`;

      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
                ${style}
              }
          `}
          <div className="label medium-image-magnify" style={{ zIndex: 100, top: list ? "70px" : "" }}>
            <Style>
              {`
              .text {
                position: relative;
                display: block;
                width: 46px;
                height: 30px;
                background-color: ${
                tags.find(tag => tag.slug === "discount") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "discount").color
                };
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
                background-color: ${
                tags.find(tag => tag.slug === "discount") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "discount").color
                };
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
              }
            `}
              <span className="text" style={{ top: list ? "55px" : "" }}>
                <div>
                  <strong>{data.salepercent}</strong>
                  <small>
                    {tags.find(tag => tag.slug === "discount") === undefined
                      ? ""
                      : tags.find(tag => tag.slug === "discount").name}
                  </small>
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

  renderSoldOut = (lang) => {
    try {
      const { data, tags, list } = this.props;
      const style = list
        ? `
        bottom: 35px; 
        margin: auto auto auto 500px`
        : `top: ${
        data.isnew
          ? data.salepercent !== 0
            ? "127px"
            : "70px"
          : data.salepercent !== 0
            ? "70px"
            : "15px"
        };`;
      return (
        <Style>
          {`
              .label {
                display: block;
                position: absolute;
                ${style}
              }
            `}
          <div className="label medium-image-magnify" style={{ zIndex: 100, top: list ? "125px" : "" }}>
            <Style>
              {`
              .text {
                position: relative;
                display: block;
                width: 46px;
                height: 30px;
                background-color: ${
                tags.find(tag => tag.slug === "sold_out") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "sold_out").color
                };
                text-align: center;
                font-size: ${"0.9"}rem;
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
                background-color: ${
                tags.find(tag => tag.slug === "sold_out") === undefined
                  ? ""
                  : tags.find(tag => tag.slug === "sold_out").color
                };
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
                font-size: ${"0.5"}rem;
                display: inline-block;
                margin-left: 1px;
                line-height: 1.4;
                letter-spacing: 0.2px;
                bottom: ${
                lang === "mn" || lang === null ? "4px" : "-3px"
                };
              }
             `}
              <span className="text" style={{ top: list ? "110px" : "" }}>
                <div>
                  <small>
                    {lang === "mn" || lang === null
                      ? tags.find(tag => tag.slug === "sold_out").name
                      : tags.find(tag => tag.slug === "sold_out").nameen}
                  </small>
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
        {data.isnew ? this.renderNew(localStorage.getItem("lang")) : null}
        {data.salepercent !== 0 ? this.renderSale(localStorage.getItem("lang")) : null}
        {!data.isavailable ? this.renderSoldOut(localStorage.getItem("lang")) : null}
      </div>
    );
  }
}

export default index;
