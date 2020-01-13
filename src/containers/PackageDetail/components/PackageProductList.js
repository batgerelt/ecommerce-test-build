/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { store } from 'react-notifications-component';

import { Notification } from "../../../components";
import { Cart as CartModel } from '../../../models';
import PackageProduct from './PackageProduct';
import TotalPrice from './TotalPrice';

function PackageProductList({
  id,
  intl,
  intl: { formatMessage },
  products,
  increaseProductsByQtyLocally,
  increaseProductsByQtyRemotely,
  increasePackageProductsByQtyLocally,
}) {
  const [loading, setLoading] = useState(false);
  const [packageProducts, setPackageProducts] = useState([]);

  useEffect(() => {
    const prods = products.map((product) => {
      if (!product.qty) {
        product.qty = product.addminqty;
      }

      return product;
    });

    setPackageProducts(prods);
  }, [products]);

  const renderNotification = ({
    code, name = '', names = '', qty = 0,
  }) => {
    const messages = defineMessages({
      warning: { id: code },
    });

    let params = {};

    if (name) {
      params = { ...params, name };
    }

    if (names) {
      params = { ...params, names };
    }

    if (qty) {
      params = { ...params, qty };
    }

    store.addNotification({
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: false,
      },
      content: (
        <Notification
          type="warning"
          text={formatMessage(messages.warning, params)}
        />
      ),
    });
  };

  const handleQtyChange = (skucd, qty) => {
    let found = packageProducts.find(
      product => product.skucd === skucd,
    );

    if (found) {
      let index = packageProducts.findIndex(
        product => product.skucd === skucd,
      );

      if (index !== -1) {
        let prods = [...packageProducts];
        prods[index] = { ...found, qty };
        setPackageProducts(prods);
      }
    }
  };

  const handleAddToCartClick = async () => {
    if (localStorage.getItem('auth')) {
      setLoading(true);

      const {
        payload: { code, data, success },
      } = await increaseProductsByQtyRemotely({
        body: packageProducts.map(prod => ({
          skucd: prod.skucd,
          qty: prod.qty,
        })),
      });

      setLoading(false);

      if (!success) {
        return renderNotification(code);
      }

      if (data && data.fail) {
        const names = [];

        data.fail.forEach((failed) => {
          names.push(failed.values[1]);
        });

        if (names.length > 0) {
          renderNotification({
            code: '205',
            names: names.join(", "),
            qty: data.items.length - data.fail.length,
          });
        }
      }
    } else {
      const prods = packageProducts.filter(prod => prod.qty > 0);

      const { payload } = await increasePackageProductsByQtyLocally(prods);
      const errors = payload.filter(prod => prod.id === parseInt(id, 10));
      console.log('errors: ', errors);
      if (errors) {
        const names = errors.map(err => err.title);
        console.log('names: ', names);
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification
            type="warning"
            text={intl.formatMessage(
              { id: "205" },
              {
                names: names.join(", "),
                qty: products.length - errors.length,
              },
            )}
          />,
        });
      }
    }
  };

  return (
    <div className="pack-product-container">
      <div className="pack-list">
        <div className="row row10">
          <div className="col-lg-8 pad10">
            <ul className="list-unstyled">
              {packageProducts && packageProducts.map(product => (
                <li className="flex-this" key={product.skucd}>
                  <PackageProduct
                    product={product}
                    onQtyChange={handleQtyChange}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4 pad10">
            <div className="pack-price">
              <p className="text flex-this end">
                <span style={{ fontSize: "1.6rem" }}>
                  <FormattedMessage id="packageDetail.label.price" />:{" "}
                </span>
                <strong>
                  {packageProducts && (
                    <TotalPrice products={packageProducts} />
                  )}
                </strong>
              </p>
              <button
                type="button"
                disabled={loading}
                className="btn btn-main"
                onClick={handleAddToCartClick}
              >
                <i
                  className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`}
                  aria-hidden="true"
                />{" "}
                <span className="text-uppercase">
                  <FormattedMessage id="packageDetail.button.addToCart" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="info-container">
        <span>
          <i>
            <FormattedMessage id="packageDetail.info" />
          </i>
        </span>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    increaseProductsByQtyLocally: CartModel.increaseProductsByQtyLocally,
    increaseProductsByQtyRemotely: CartModel.increaseProductsByQtyRemotely,
    increasePackageProductsByQtyLocally: CartModel.increasePackageProductsByQtyLocally,
  }, dispatch),
});

export default connect(
  null,
  mapDispatchToProps,
)(injectIntl(PackageProductList));
