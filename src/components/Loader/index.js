import React from "react";
import ReactSVG from "react-svg";
import { loader } from "../../assets";

class Component extends React.Component {
  render() {
    return <ReactSVG className="page-loader" style={{ minHeight: `${window.innerHeight - 443}px` }} src={loader} />;
  }
}

export default Component;
