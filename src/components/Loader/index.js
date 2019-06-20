import React from "react";
import ReactSVG from "react-svg";

import { loader } from "../../assets";

class Component extends React.Component {
  render() {
    return <ReactSVG src={loader} />;
  }
}

export default Component;
