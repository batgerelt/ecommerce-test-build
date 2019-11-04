import React, { Component } from 'react';
import { Icon } from "antd";

import styles from "./styles.less";

class index extends Component {
  renderContent = () => {
    try {
      const { type, text } = this.props;

      if (type === "success") {
        return (
          <div className="success">
            <div className="icon">
              <Icon type="check-circle" theme="filled" />
            </div>

            <div className="content">
              <p>{text}</p>
            </div>
          </div>
        );
      } else if (type === "warning") {
        return (
          <div className="warning">
            <div className="icon">
              <Icon type="exclamation-circle" theme="filled" />
            </div>

            <div className="content">
              <p>{text}</p>
            </div>
          </div>
        );
      }

      return (
        <div className="info">
          <div className="icon">
            <Icon type="info-circle" theme="filled" />
          </div>

          <div className="content">
            <p>{text}</p>
          </div>
        </div>
      );
    } catch (error) {
      return console.log('error: ', error);
    }
  }

  render() {
    try {
      return (
        <div className={styles.notification}>
          {this.renderContent()}
        </div>
      );
    } catch (error) {
      return console.log('error: ', error);
    }
  }
}

export default index;
