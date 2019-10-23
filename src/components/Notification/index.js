import React from 'react';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: -100,
    };
  }

  /* onShow = () => {
  } */

  render() {
    return (
      <div
        style={{
          backgroundColor: "#444",
          color: "white",
          padding: "16px",
          position: "absolute",
          top: "16",
          right: "16px",
          zIndex: "999",
          transition: "top 0.5s ease",
        }}
        className="d-none"
      >
        <span>Example text here</span>
      </div>
    );
  }
}
