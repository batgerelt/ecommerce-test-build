/* eslint-disable react/no-danger */
import React from 'react';
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
      const { staticpage } = this.props;

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
            <center>{staticpage.name}</center>
          </h5>
          <div dangerouslySetInnerHTML={{ __html: staticpage.description }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Page);
