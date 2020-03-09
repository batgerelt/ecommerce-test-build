import React from "react";
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

class Component extends React.Component {
  render() {
    try {
      const { banner } = this.props;
      const { locale } = this.props.intl;
      if (banner) {
        const imgnm = window.innerWidth < 576 ? (locale === "mn" ? banner[0].mobimgnm : banner[0].mobimgnm_en) : (locale === "mn" ? banner[0].imgnm : banner[0].imgnm_en);

        return (
          <React.Fragment>
            <div className="page_header_banner_container d-flex">
              <span className="page_header_banner_left" style={{ backgroundColor: banner[0].lcolor }} />
              <div className={`container mx-auto`} onClick={() => banner[0].link && window.open(banner[0].link)}><img src={process.env.IMAGE + imgnm} alt="banner" /></div>
              <span className="page_header_banner_rigth" style={{ backgroundColor: banner[0].rcolor }} />
            </div>
          </React.Fragment>
        );
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

Component.propTypes = {
  banner: PropTypes.array.isRequired,
};

export default injectIntl(Component);
