import React from 'react';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: -100,
    };
  }

  render() {
    return (
      <div className="d-none">
        <span>Example text here</span>
      </div>
    );
  }
}
