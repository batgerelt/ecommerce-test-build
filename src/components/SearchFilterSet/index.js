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

  renderCategory = () => {
    try {
      const { aggregations } = this.props;

      return (
        <div>
          <Link
            to=""
            onClick={this.toggleCollapse}
            className="collapse-title"
            data-toggle="collapse"
            role="button"
            aria-expanded="true"
            aria-controls="collapseExample"
          >
            {/* {attribute.name} */}
          </Link>
          <Collapse isOpened={this.state.isOpened}>
            <div className="collapse show" id="collapseThree">
              <div className="collapse-content">
                <ul className="list-unstyled">
                  {/* {attribute.values.map((val, index) => (
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
                    ))} */}
                </ul>
              </div>
            </div>
          </Collapse>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div>
        {this.renderCategory()}
      </div>
    );
  }
}

export default FilterSet;
