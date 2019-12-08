/* eslint-disable react/no-danger */
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from "antd";

import { Static as StaticModel } from "../../models";
import { Loader } from "../../components";

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
          className="ck-editor static-page"
          style={{
            backgroundColor: staticpage.color,
          }}
        >
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
    const { isLoadingStaticpage } = this.props;

    return (
      <Spin indicator={<Loader />} spinning={isLoadingStaticpage}>
        <div className="static-container">
          <div className="container pad10">
            {this.renderContent()}
          </div>
        </div>
      </Spin>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Page));
