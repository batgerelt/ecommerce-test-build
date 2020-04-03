/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-lonely-if */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { Fragment } from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Rate } from "antd";
import { store } from 'react-notifications-component';
import Button from "@material-ui/core/Button";
import { Label, ElasticLabel, Notification } from "..";
import { CARD_TYPES, LABEL_TYPES } from "../../utils/Consts";

const formatter = new Intl.NumberFormat("en-US");

class Card extends React.Component {
  state = {
    changeHeart: false,
    loading: false,
  };

  render() {
    return (
      <div
        className="col-md-4"
        style={{
          height: "20px", backgroundColor: "pink", padding: "5px",
        }}
      >product {this.props.index}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

Card.propTypes = {
  shape: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  isLastInRow: PropTypes.bool,
  className: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps)(Card));
