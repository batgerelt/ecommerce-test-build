/* eslint-disable radix */
import React from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { Slider } from "antd";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

class FilterSet extends React.Component {
  state = { isOpened: true };

  toggleCollapse = (e) => {
    e.preventDefault();
    this.setState({ isOpened: !this.state.isOpened });
  };

  render() {
    const attr = this.props.data;

    switch (attr.type) {
      case "COLOR":
        return (
          <div key={attr.type}>
            <Link
              to=""
              className="collapse-title"
              onClick={this.toggleCollapse}
            >
              {attr.attributes[0].name}
            </Link>
            <Collapse isOpened={this.state.isOpened}>
              <div className="collapse show" id="collapseThree">
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {attr.attributes[0].values.map(val => (
                      <Checkbox
                        key={val.valueid}
                        onChange={this.props.onAttributeChange}
                        value={val.valueid}
                        style={{
                            color: val.valuecd,
                            width: 25,
                            height: 25,
                          }}
                        icon={
                          <CheckBoxOutlineBlankIcon
                            style={{ fontSize: 20 }}
                          />
                          }
                        checkedIcon={
                          <CheckBoxIcon style={{ fontSize: 20 }} />
                          }
                      />
                      ))}
                  </ul>
                </div>
              </div>
            </Collapse>
          </div>
        );
      // case "BRAND":
      case "PRICE":
        const formatter = new Intl.NumberFormat("en-US");

        let tempMin = attr.attributes[0].values.find(
          val => val.valuecd === "MIN",
        );
        tempMin = tempMin.valuename
          ? tempMin.valuename
          : tempMin.valueid.substring(3);
        let tempMax = attr.attributes[0].values.find(
          val => val.valuecd === "MAX",
        );
        tempMax = tempMax.valuename
          ? tempMax.valuename
          : tempMax.valueid.substring(3);

        const min = tempMin ? parseInt(tempMin) : 0;
        const max = tempMax ? parseInt(tempMax) : 0;

        const marks = {
          [min]: {
            label: <strong>{formatter.format(min)}₮</strong>,
          },
          [max]: {
            label: <strong>{formatter.format(max)}₮</strong>,
          },
        };

        return (
          <div key={attr.type}>
            <Link
              to=""
              className="collapse-title"
              onClick={this.toggleCollapse}
            >
              {attr.attributes[0].name}
            </Link>
            <Collapse isOpened={this.state.isOpened}>
              <Slider
                range
                // defaultValue={[this.props.minPrice, this.props.maxPrice]}
                min={min}
                max={max}
                marks={marks}
                onAfterChange={this.props.onPriceAfterChange}
                style={{ width: "90%" }}
              />
            </Collapse>
          </div>
        );
      default:
        const list = attr.attributes.map((attribute, index) => (
          <div key={index}>
            <Link
              to=""
              onClick={this.toggleCollapse}
              className="collapse-title"
              data-toggle="collapse"
              role="button"
              aria-expanded="true"
              aria-controls="collapseExample"
            >
              {attribute.name}
            </Link>
            <Collapse isOpened={this.state.isOpened}>
              <div className="collapse show" id="collapseThree">
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {attribute.values.map((val, index) => (
                      <li key={index}>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`checkbox${val.valueid}${index}`}
                            onChange={this.props.onAttributeChange}
                            value={val.valueid}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`checkbox${val.valueid}${index}`}
                          >
                            {val.valuename}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Collapse>
          </div>
        ));

        return <div key={attr.type}>{list}</div>;
    }
  }
}

export default FilterSet;
