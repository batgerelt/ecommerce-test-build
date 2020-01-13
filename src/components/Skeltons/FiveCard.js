import React, { Component } from "react";
import { ElasticLabel } from "../";

const height = window.innerWidth < 575 ? '180px' : '232px';
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
