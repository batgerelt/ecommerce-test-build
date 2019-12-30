import React, { Component } from "react";
import { ElasticLabel } from "../";

const height = window.innerHeight < 575 ? '200px' : '238px';
class productDetail extends Component {
  render() {
    return (
      <span className="skeleton-box" style={{ height }} >
        <ElasticLabel {...this.props} />
      </span>
    );
  }
}

export default productDetail;
