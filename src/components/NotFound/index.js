import React from "react";

class Component extends React.Component {
  render() {
    return (
      <div className="section">
        <div className="container">
          <div className="row page-loader" style={{ minHeight: `${window.innerHeight - 443}px` }}>
            Бараа олдсонгүй
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
