import React from 'react';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';

function PackageDate({ intl: { locale }, info }) {
  return (
    <div>
      <h4 className="title">
        <span>
          {locale === "mn" ? info.packagenm : info.packagenm_en}
        </span>
      </h4>
      <p className="date">
        <FormattedMessage
          id="packageDetail.date"
          defaultMessage="{year}.{month}.{day}"
          values={{
            year: (
              <FormattedDate
                value={new Date(info.insymd)}
                year="numeric"
              />
            ),
            month: (
              <FormattedDate
                value={new Date(info.insymd)}
                month="2-digit"
              />
            ),
            day: (
              <FormattedDate
                value={new Date(info.insymd)}
                day="2-digit"
              />
            ),
          }}
        />
      </p>
    </div>
  );
}

export default injectIntl(PackageDate);
