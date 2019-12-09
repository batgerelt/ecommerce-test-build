import React from 'react';
import { FormattedMessage } from 'react-intl';

import SimilarProduct from './SimilarProduct';

function SimilarProductList({ products }) {
  return products && (
    <div className="block product-suggest similar-products">
      <p className="title">
        <FormattedMessage id="shared.sidebar.title.similarProducts" />
      </p>

      {products && (
        <ul className="list-unstyled">
          {
            products.map(
              product => (
                <li key={product.skucd}>
                  <SimilarProduct product={product} />
                </li>
              ),
            )
          }
        </ul>
      )}
    </div>
  );
}

export default SimilarProductList;
