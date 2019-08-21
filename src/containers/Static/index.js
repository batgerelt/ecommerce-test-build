/* eslint-disable react/no-danger */
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Static as StaticModel } from "../../models";

const mapStateToProps = state => ({
  ...state.staticcontent,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    ...StaticModel,
  }, dispatch),
});

class Page extends React.Component {
  /** Хуудсыг зурахад шаардагдах өгөгдлийг авах хүсэлтүүд */
  componentWillMount() {
    this.props.getStaticPage({ id: this.props.match.params.id });
  }

  renderContent = () => {
    try {
      const { staticpage, intl } = this.props;

      return (
        <div
          className="ck-editor"
          style={{
            minHeight: "700px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px 20px",
          }}
        >
          <h5 style={{ height: "50px" }}>
            <center>{intl.locale === "mn" ? staticpage.name : staticpage.name_en}</center>
          </h5>
          <div dangerouslySetInnerHTML={{
            __html: intl.locale === "mn"
              ? staticpage.description
              : staticpage.description_en,
          }}
          />
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return (
      <div className="section section-gray static">
        <div className="container pad10">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Page));
