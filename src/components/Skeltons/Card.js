import React, { Component } from "react";

class Card extends Component {
  render() {
    return (
      <div className="col-five pad10 col-md-3 col-6">
        <div className="single-product small-product">
          <div className="skeleton-box" style={{ height: '15rem' }} />
          <div className="info-container">
            <div className="skeleton-box" style={{ height: '1rem', width: '80%' }} />
            <div className="skeleton-box" style={{ height: '1rem' }} />
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
