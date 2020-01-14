/* eslint-disable no-loop-func */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class Breadcrumb extends Component {
  render() {
    try {
      const { product, categories } = this.props;
      let parentCats = [];
      let catId = product.catid;
      while (catId && catId !== 0) {
        const category = categories.find(cat => cat.id === catId);
        if (category) {
          parentCats.push(category);
          catId = category.parentid;
        } else {
          catId = undefined;
        }
      }
      if (parentCats.length) {
        parentCats = parentCats.reverse();
      }
      return (
        parentCats && (
          <div className="e-breadcrumb">
            <ul className="list-unstyled">
              {parentCats.map((parent, index) => (
                <li key={index}>
                  <Link to={parent.route ? parent.route : ""}>
                    <span>{this.props.lang === "mn" ? parent.name : parent.name_en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      );
    } catch (error) {
      return console.log(error);
    }
  }
}

Breadcrumb.propTypes = {
  product: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
};

export default Breadcrumb;
