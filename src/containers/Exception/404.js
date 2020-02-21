import React, { Component } from 'react';
import emptyCart from "../../scss/assets/icon/not-found.jpg";

class SearchNotFound extends Component {
  componentWillMount() {
    /* if (this.props.match.url.slice(0, 3) === "/s/") {
      window.location.reload();
    } */
  }
  render() {
    return (
      <div className="search-not-found">
        <div className="text-center">
          <img src={emptyCart} alt="not-found" width={150} />
          <span>
            <p>Уучлаарай хуудас олдсонгүй</p>
            <p>Та үндсэн цэсрүү буцна уу!</p>
          </span>
        </div>
      </div>
    );
  }
}

export default SearchNotFound;
