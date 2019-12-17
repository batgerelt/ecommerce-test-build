import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

import { CARD_LIST_TYPES, WIDGET_SLUGS } from "../../utils/Consts";
import { CardList } from "../";

import "./Widget.css";

class Widget extends React.Component {
  render() {
    const { widgetData } = this.props;
    const lang = this.props.intl.locale;
    if (!widgetData) {
      return null;
    }

    let subtitle = null;
    if (widgetData.subtitle) {
      subtitle = (
        <p className="text">
          {widgetData.icon ? widgetData.icon : null} {lang === "mn" ? widgetData.subtitle : widgetData.subtitle_en}
        </p>
      );
    }

    let cardList = null;
    if (widgetData.slug === WIDGET_SLUGS.recipe) {
      cardList = (
        <CardList
          cardListType={CARD_LIST_TYPES.vertical}
          items={widgetData.items}
          cardsInCol={2}
          {...this.props}
        />
      );
    } else {
      cardList = (
        <CardList
          cardListType={CARD_LIST_TYPES.horizontal}
          items={widgetData.items}
          seq={widgetData.type}
          {...this.props}
        />
      );
    }

    return (
      <div className="section">
        <div className="container pad10">
          <h1 className="title">
            <span className="text-uppercase">{lang === "mn" ? widgetData.name : widgetData.name_en}</span>
            {subtitle}
            {widgetData.interval ? widgetData.interval : ""}
          </h1>
          {cardList}
          <div className="more-link text-center" >
            <Button>
              <Link
                to={widgetData.link ? widgetData.link : ""}
                className="btn btn-border"
              >
                <span className="text text-uppercase">{widgetData.readMore}</span>
              </Link>
            </Button>
          </div>
          <div style={{ height: "30px", width: "100%" }} />
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default Widget;
