/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { store } from 'react-notifications-component';
import moment from 'moment';
import Button from "@material-ui/core/Button";

import { Notification } from "../../../components";
import { Cart as CartModel } from '../../../models';

function PackageProduct({
  intl: { locale, formatMessage },
  product,
  onQtyChange,
  products,
  increaseProductByQtyLocally,
  increaseProductByQtyRemotely,
}) {
  const formatter = new Intl.NumberFormat("en-US");

  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    setQty(product.addminqty);
  }, []);

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

  const handleAddToCartClick = async () => {
    if (localStorage.getItem('auth')) {
      setLoading(true);

      const {
        payload: { success, code, data },
      } = await increaseProductByQtyRemotely({
        skucd: product.skucd,
        qty,
        iscart: 0,
      });

      setLoading(false);

      if (!success) {
        renderNotification({
          code,
          name: data.values[1],
          qty: data.values[2],
        });
      }
    } else {
      if (!product.qty) {
        product.qty = product.addminqty;
      }

      if (product.qty > 0) {
        increaseProductByQtyLocally({
          ...product,
          qty: parseInt(qty, 10),
          insymd: moment(),
        });

        const updated = products.find(
          prod => prod.skucd === product.skucd,
        );

        if (updated && updated.error) {
          const { error, title, qty } = updated;

          renderNotification({
            code: error,
            name: title,
            qty,
          });
        }
      }
    }
  };

  const handleIncrementClick = () => {
    let productQty;
    let error;

    if (product.isgift) {
      productQty = qty + product.addminqty;
    } else if (product.availableqty > 0) {
      if (product.salemaxqty > 0) {
        if (qty + product.addminqty > product.salemaxqty) {
          productQty = product.addminqty > 1
            ? Math.floor(product.salemaxqty / product.addminqty) * product.addminqty
            : product.salemaxqty;
          error = "202";
        } else {
          productQty = qty + product.addminqty;
          error = null;
        }
      } else if (qty + product.addminqty > product.availableqty) {
        productQty = product.addminqty > 1
          ? Math.floor(product.availableqty / product.addminqty) * product.addminqty
          : product.availableqty;
        error = "202";
      } else {
        productQty = qty + product.addminqty;
        error = null;
      }
    } else {
      error = "200";
    }

    setQty(productQty);
    onQtyChange(product.skucd, productQty);

    if (error) {
      renderNotification({
        code: error,
        name: locale === 'mn' ? product.title : product.title_en,
        qty: productQty,
      });
    }
  };

  const handleDecrementClick = () => {
    let productQty;
    let error = null;

    if (qty - product.addminqty < 0) {
      productQty = 0;
    } else {
      productQty = qty - product.addminqty;
    }

    setQty(productQty);
    onQtyChange(product.skucd, productQty);

    if (error) {
      renderNotification({
        code: error,
        name: locale === 'mn' ? product.title : product.title_en,
        qty: productQty,
      });
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    let productQty;
    let error;

    if (product.isgift) {
      if (value < product.addminqty) {
        productQty = product.addminqty;
        error = '204';
      } else {
        productQty = parseInt(value, 10);
      }
    } else {
      if (value < product.addminqty) {
        productQty = product.addminqty;
        error = '204';
      } else {
        if (product.availableqty > 0) {
          if (product.salemaxqty > 0) {
            if (value > product.salemaxqty) {
              productQty = product.addminqty > 1
                ? Math.floor(product.salemaxqty / product.addminqty) * product.addminqty
                : product.salemaxqty;
              error = "202";
            } else {
              productQty = parseInt(value, 10);
              error = null;
            }
          } else if (value > product.availableqty) {
            productQty = product.addminqty > 1
              ? Math.floor(product.availableqty / product.addminqty) * product.addminqty
              : product.availableqty;
            error = "202";
          } else {
            productQty = parseInt(value, 10);
            error = null;
          }
        } else {
          error = "200";
        }
      }
    }

    setQty(productQty);
    onQtyChange(product.skucd, productQty);

    if (error) {
      renderNotification({
        code: error,
        name: locale === 'mn' ? product.title : product.title_en,
        qty: productQty,
      });
    }
  };

  return (
    <Fragment>
      <div className="image-container default">
        <Link to={product.route || ""}>
          <span
            className="image"
            style={{
              backgroundImage: `url(${process.env.IMAGE}${product.img})`,
            }}
          />
        </Link>
      </div>
      <div className="info-container">
        <div className="flex-space">
          <p className="text col-md-5 col-sm-5">
            <Link to={product.route || ""} style={{ color: "#666" }}>
              <span>
                {locale === "mn" ? product.title : product.title_en}
              </span>
              <strong>
                {formatter.format(product.saleminqty > 1
                  ? product.currentprice / product.saleminqty
                  : product.currentprice,
                )}₮
              </strong>
            </Link>
          </p>
          <form onSubmit={e => e.preventDefault()}>
            <div className="input-group e-input-group">
              <div className="input-group-prepend" id="button-addon4">
                <button
                  className="btn"
                  type="button"
                  style={{
                    color: "rgba(0,0,0,.5)",
                    textAlign: "center",
                    backgroundColor: "rgb(204, 204, 204)",
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    marginRight: "5px",
                  }}
                  onClick={handleDecrementClick}
                >
                  <i className="fa fa-minus" aria-hidden="true" />
                </button>
              </div>

              <input
                type="text"
                className="form-control"
                value={qty}
                name="productQty"
                maxLength={5}
                onChange={handleInputChange}
              />

              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn"
                  type="button"
                  style={{
                    color: "rgba(0,0,0,.5)",
                    textAlign: "center",
                    backgroundColor: "rgb(204, 204, 204)",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                    marginLeft: "5px",
                  }}
                  onClick={handleIncrementClick}
                >
                  <i className="fa fa-plus" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
          <div className="search-hover action">
            <Button
              onClick={handleAddToCartClick}
              disabled={loading}
            >
              <i
                className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const mapStateToProps = state => ({
  products: state.cart.products,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    increaseProductByQtyLocally: CartModel.increaseProductByQtyLocally,
    increaseProductByQtyRemotely: CartModel.increaseProductByQtyRemotely,
    incrementProductLocally: CartModel.incrementProductLocally,
    incrementProductRemotely: CartModel.incrementProductRemotely,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PackageProduct));
