import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

function DeliveryInfo({ intl: { locale }, info }) {
  return (
    <div className="block product-delivery">
      <p className="title">
        <strong>
          <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
        </strong>
      </p>
      <p className="text">
        <span>
          {locale === "mn" ? info.deliverytxt : info.deliverytxt_en}
        </span>
      </p>
    </div>
  );
}

export default injectIntl(DeliveryInfo);
