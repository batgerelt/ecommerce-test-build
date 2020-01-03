import React, { Component } from "react";

class notfound extends Component {
  render() {
    const { history } = this.props;
    return (
      <div className="page-center">
        {/* <img src="http://10.0.0.22:8877/Resource/banner/a2318abe-01f1-4295-a94b-58a322d5b576.png" width={200} /> */}
        <h1>
          <span>page not found</span>
          <p onClick={() => history.push('/')} style={{ border: '1px solid #ededed' }}>Go back</p>
        </h1>
      </div>
    );
  }
}

export default notfound;
