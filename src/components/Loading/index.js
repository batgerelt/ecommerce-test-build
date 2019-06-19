import React from "react";
import ReactSVG from "react-svg";
import loader from "../../assets/images/loading.svg";

export default class Component extends React.Component {
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}>
        <ReactSVG src={loader} />
      </div>
    );
  }
}
