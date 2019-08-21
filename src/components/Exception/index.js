import React, { createElement } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';

const Exception = ({
  className, linkElement = 'a', type, title, desc, img, actions, ...rest
}) => {
  const lang = localStorage.getItem("lang");
  const pageType = type in config ? type : '404';
  const clsString = classNames(styles.exception, className);
  return (
    <div className={clsString} {...rest}>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        {/* <div className={styles.desc}>{desc || config[pageType].desc}</div> */}
        <div className={styles.desc}>{desc || <FormattedMessage id="shared.404.description" />}</div>
        <div className={styles.actions}>
          {
            actions ||
            createElement(linkElement, {
              to: '/',
              href: '/',
            }, <Button type="primary"><FormattedMessage id="shared.404.button.backHome" /></Button>)
          }
        </div>
      </div>
    </div>
  );
};

Exception.defaultProps = {
  actions: undefined,
  img: undefined,
  desc: undefined,
  title: undefined,
  type: undefined,
  className: undefined,
  linkElement: undefined,
  copyright: undefined,
};

Exception.propTypes = {
  actions: PropTypes.node,
  img: PropTypes.string,
  desc: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  linkElement: PropTypes.func,
  copyright: PropTypes.string,
};

export default Exception;
