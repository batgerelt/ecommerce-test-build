import React, { Component } from "react";

class skelton extends Component {
  state = {};
  render() {
    return (
      <div className="section skeleton">
        <div className="container pad10">
          <div className="e-breadcrumb">
            <span className="skeleton-box rectangle col-md-2 mr-1" />
            <span className="skeleton-box rectangle col-md-2 mr-1" />
            <span className="skeleton-box rectangle col-md-2 mr-1" />
          </div>

          <div className="product-detail-page col-md-12 col-md-12 col-lg-12 p-0 d-flex">
            <div className="col-md-3 p-0 mr-1">
              {/* барааны үндсэн зураг */}
              <li>
                <span className="skeleton-box rectangle fill" style={{ height: "300px" }} />
              </li>

              <span className="skeleton-box rectangle col-md-2 mr-1" style={{ height: '40px' }} />
              <span className="skeleton-box rectangle col-md-2 mr-1" style={{ height: '40px' }} />
            </div>

            {/* барааны мэдээлэл */}
            <div className="col-md-6 p-0 mr-1">
              <li><span className="skeleton-box rectangle col-md-8 mr-1" /></li>
              <li><span className="skeleton-box rectangle col-md-11 mr-1" /></li>
              <li><span className="skeleton-box rectangle col-md-3 mr-1" /></li>
              <li><span className="skeleton-box rectangle col-md-8 mr-1" /></li>
              <li><span className="skeleton-box rectangle col-md-5 mr-1" /></li>
              <li><span className="skeleton-box rectangle col-md-11 mr-1" /></li>

            </div>

            {/* хүргэлтийн мэдээлэл */}
            <div className="col-md-3 p-0 mr-1">
              <span className="skeleton-box rectangle fill" style={{ height: "80px" }} />
            </div>
          </div>

          {/* ижил бараа */}
          <div className="col-md-12 col-md-12 col-lg-12 p-0 d-flex mt-5">
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />

            </div>
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />
            </div>
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />
            </div>
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />
            </div>
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />
            </div>
            <div className="col-md-2 pl-0">
              <span className="skeleton-box rectangle fill" style={{ height: "160px" }} />
              <span className="skeleton-box rectangle quarter-to" />
              <span className="skeleton-box rectangle half" />
              <span className="skeleton-box rectangle fill" />
            </div>
          </div>

          {/* танилцуулга */}
          <div className="col-md-12 col-md-12 col-lg-12 p-0 mt-5">
            <span className="skeleton-box list-item rectangle quarter-to" />
            <span className="skeleton-box list-item rectangle half" />
            <span className="skeleton-box list-item rectangle fill" />
            <span className="skeleton-box list-item rectangle quarter-to" />
            <span className="skeleton-box list-item rectangle half-past" />
            <span className="skeleton-box list-item rectangle fill" />
          </div>
        </div>
      </div>
    );
  }
}

export default skelton;
