import React from "react";
import Style from "style-it";
import PropTypes from "prop-types";

import { LABEL_TYPES } from "../../utils/Consts";

class Label extends React.Component {
  render() {
    const { type, data, seq } = this.props;

    if (!data) {
      return null;
    }

    let content = null;
    if (data.isPackage) {
      content = (
        <small>
          <span style={{ fontSize: "0.9rem" }}>
            {data.content ? data.content : ""}
          </span>
          <span>{data.text ? data.text : ""}</span>
        </small>
      );
    } else {
      content = (
        <div>
          {data.content !== undefined ? <strong>{data.content}</strong> : ""}
          <small>{data.text ? data.text : ""}</small>
        </div>
      );
    }

    let spacing = "";
    let topSpacing = 15;
    let rightSpacing = 200;
    if (type === LABEL_TYPES.vertical) {
      topSpacing += seq * 55;
      spacing = `
        left: 8px;
        top: ${topSpacing}px;
      `;
    } else {
      rightSpacing -= seq * 50;
      spacing = `
        top: 45px;
        left: auto;
        right: ${rightSpacing}px;
      `;
    }

    let color = data.color || "#f00";
    return (
      <Style>
        {`
          .label {
            display: block;
            position: absolute;
            ${spacing}
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
                font-size: ${data.content ? "1.5" : "1"}rem;
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
                font-size: ${data.text.length > 5 ? "0.5" : "0.7"}rem;
                display: inline-block;
                margin-left: 2px;
                line-height: 1.2;
                letter-spacing: 1px;
              }
            `}
            <span className="text">{content}</span>
          </Style>
        </div>
      </Style>
    );
  }
}

// Label.propTypes = {
//   type: PropTypes.number.isRequired,
//   data: PropTypes.object.isRequired,
//   seq: PropTypes.number,
// };

export default Label;
