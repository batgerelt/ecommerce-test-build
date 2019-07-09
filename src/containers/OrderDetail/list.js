/* eslint-disable react/no-danger */
import React from "react";
import { Link } from "react-router-dom";
import { Slider } from "../../components";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className="section">
        <h1>hello</h1>
      </div>
    );
  }
}

export default List;
