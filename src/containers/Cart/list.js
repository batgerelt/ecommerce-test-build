/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable arrow-parens */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import React from "react";
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile } from "react-device-detect";
import { store } from 'react-notifications-component';
import ButtonGoogle from "@material-ui/core/Button";
import { Alert } from "antd";
import { Notification } from "../../components";

const formatter = new Intl.NumberFormat("en-US");

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.proceedRef = React.createRef();
    this.state = {
      count: 5,
      loading: false,
      tempProducts: [],
      shouldRedirect: false,
      showButton: true,
      isadd: { loading: false, index: null },
      ismin: { loading: false, index: null },
    };
  }

  componentDidMount() {
    const { products } = this.props;
    products.sort((a, b) => {
      if (typeof a.insymd === "string") {
        a.insymd = new Date(a.insymd).getTime();
      }

      if (typeof b.insymd === "string") {
        b.insymd = new Date(b.insymd).getTime();
      }

      return b.insymd - a.insymd;
    });

    this.setState({ tempProducts: products });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.products !== this.state.tempProducts) {
      this.setState({ tempProducts: this.props.products });
    }
  }

  changeQties = products => products.map((product) => {
    if (product.addminqty > 1) {
      product.qty /= product.addminqty;
    }

    return product;
  });

  // eslint-disable-next-line consistent-return
  handleConfirmClick = async () => {
    try {
      if (this.props.isLoggedIn) {
        this.setState({ loading: true });
        let result = await this.props.confirmCartRemotely();
        const { intl } = this.props;

        if (result.payload.success) {
          this.setState({ shouldRedirect: true });
        } else {
          if (result.payload.data.length > 0) {
            let reasons = [];
            result.payload.data.forEach(msg => (
              reasons.push(msg.values[1])
            ));
            if (reasons.length > 0) {
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 6000,
                  onScreen: false,
                },
                content: <Notification
                  type="warning"
                  title="Нөөц хүрэлцэхгүй байна."
                  text={intl.formatMessage(
                    { id: result.payload.code },
                    {
                      names: reasons.join(", "),
                    },
                  )}
                />,
              });
            }

            this.setState({ loading: false, shouldRedirect: false });
          }
        }
      } else {
        this.setState({ shouldRedirect: true });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  // eslint-disable-next-line consistent-return
  handleClearClick = async () => {
    const { intl } = this.props;

    if (this.props.isLoggedIn) {
      const result = await this.props.clearRemotely();

      if (!result.payload.success) {
        store.addNotification({
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
          content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
        });
      }
    } else {
      this.props.clearLocally();
    }
  };

  handleSaveClick = (e, product) => {
    e.preventDefault();
    if (this.props.isLoggedIn) {
      this.props.addWishList({ skucd: product.skucd || product.skucd }).then((res) => {
        if (res.payload.success) {
          setTimeout(() => {
            this.props.removeAddedWishColor();
          }, 500);
          this.props.getWish();
        }
      });
    } else {
      this.props.LoginModal.handleLoginModal();
    }
  };

  // eslint-disable-next-line consistent-return
  handleRemoveClick = product => async (e) => {
    e.preventDefault();

    const { intl } = this.props;
    let { products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);

    if (found) {
      if (this.props.isLoggedIn) {
        const result = await this.props.removeProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: found.skucd,
        });
        if (!result.payload.success) {
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification type="warning" text={intl.formatMessage({ id: result.payload.code })} />,
          });
        }
      } else {
        this.props.removeProductLocally(product);
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  handleInputKeyUp = product => async (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      this.proceedRef.current.focus();
    }
  };

  handleInputChange = product => async (e) => {
    const { tempProducts } = this.state;

    tempProducts.map(i => {
      if (i.skucd === product.skucd && e.target.value !== "") {
        i.qty = e.target.value;
      }
      return i;
    });


    this.setState({ tempProducts });
  };

  // eslint-disable-next-line consistent-return
  handleInputBlur = product => async (e) => {
    let { intl, products } = this.props;

    let found = products.find(prod => prod.skucd === product.skucd);

    if (found) {
      const qty = isNaN(e.target.value)
        ? found.addminqty
        : parseInt(e.target.value);
      found.qty = parseInt(qty, 10);

      if (this.props.isLoggedIn) {
        const result = await this.props.updateProductByQtyRemotely({
          skucd: found.skucd,
          qty: found.addminqty > 1 ? Math.round(found.qty / found.addminqty) * found.addminqty : found.qty,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />,
          });
        }
      } else {
        this.props.updateProductByQtyLocally(found);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: updated.title,
                qty: updated.qty,
              })}
            />,
          });
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }
  };

  // eslint-disable-next-line consistent-return
  handleIncrementClick = async (product, index) => {
    let { intl } = this.props;
    let { products } = this.props;
    let found = products.find(prod => prod.skucd === product.skucd);
    const { isadd } = this.state;
    isadd.loading = true;
    isadd.index = index;
    this.setState({ isadd });

    if (found) {
      if (this.props.isLoggedIn) {
        const result = await this.props.incrementProductRemotely({
          skucd: found.skucd,
          qty: found.qty + found.addminqty,
          iscart: 1,
        });

        if (result.payload && !result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />,
          });
        }
      } else {
        this.props.incrementProductLocally(found, true);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: updated.title,
                qty: updated.qty,
              })}
            />,
          });
        }
      }
    } else {
      if (this.props.isLoggedIn) {
        const result = await this.props.incrementProductRemotely({
          skucd: product.skucd,
          qty: product.addminqty || 1,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />,
          });
        }
      }
    }

    isadd.loading = false;
    this.setState({ isadd });
  };

  // eslint-disable-next-line consistent-return
  handleDecrementClick = async (product, index) => {
    let { intl } = this.props;
    let { products } = this.props;
    const { ismin } = this.state;
    ismin.loading = true;
    ismin.index = index;
    this.setState({ ismin });

    let found = products.find(prod => prod.skucd === product.skucd);
    if (found) {
      if (this.props.isLoggedIn) {
        // const productQty =
        //   found.qty - found.addminqty < found.addminqty
        //     ? found.addminqty
        //     : found.qty - found.addminqty;
        const result = await this.props.decrementProductRemotely({
          skucd: found.skucd,
          qty: found.qty - found.addminqty,
          iscart: 1,
        });

        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              })}
            />,
          });
        }
      } else {
        this.props.decrementProductLocally(found);

        const updated = this.props.products.find(prod => prod.skucd === found.skucd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });
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
              text={intl.formatMessage(messages.error, {
                name: updated.title,
                qty: updated.qty,
              })}
            />,
          });
        }
      }
    } else {
      throw new Error("Бараа олдсонгүй!");
    }

    ismin.loading = false;
    this.setState({ ismin });
  };

  seeMore = (e) => {
    e.preventDefault();
    const wishlistProducts = this.props.wish;
    this.props.getWishByCount({ count: 0 });
    this.setState({ showButton: false, count: wishlistProducts.length });
  }

  // eslint-disable-next-line arrow-parens
  renderUnitPrice = product => {
    if (product.discountprice || product.salepercent) {
      if (product.issalekg) {
        return (
          <p className="price">
            <span className="discount">
              {formatter.format(product.discountprice || product.currentprice)}₮
            </span>
            <span className="current">
              {formatter.format(product.price)}₮
            </span>
            <span className="pricetag">
              {product.pricetag}-н үнэ
            </span>
          </p>
        );
      }

      return (
        <p className="price">
          <span className="current">
            {formatter.format(product.saleminqty > 1
              ? product.currentprice / product.saleminqty
              : product.currentprice,
            )}₮
          </span>
          <span className="discount">
            {formatter.format(product.saleminqty > 1
              ? product.price / product.saleminqty
              : product.price,
            )}₮
          </span>
        </p>
      );
    }

    if (product.issalekg) {
      return (
        <p className="price">
          <span className="current">
            {formatter.format(product.currentprice)}₮
          </span>
          <span className="pricetag">
            {product.pricetag}-н үнэ
          </span>
        </p>
      );
    }

    return (
      <p className="price">
        <span className="current">
          {formatter.format(product.saleminqty > 1
            ? product.price / product.saleminqty
            : product.price,
          )}₮
        </span>
      </p>
    );
  };

  renderTotalQty = () => {
    const { products } = this.props;

    return products && products.reduce((acc, cur) => (
      parseInt(acc) + parseInt((cur.qty && cur.qty > 0 ? cur.qty : 0))
    ), 0);
  };

  renderTotalPrice = (product = null) => {
    if (product) {
      let { price } = product;

      if (product.addminqty > 1) {
        price = product.currentunitprice;

        if (product.salepercent && product.discountunitprice) {
          price = product.discountunitprice;
        }
      } else if (product.issalekg && product.currentprice) {
        price = product.currentprice;

        if (product.salepercent && product.discountprice) {
          price = product.discountprice;
        }
      } else if (product.salepercent && product.discountprice) {
        price = product.discountprice;
      }

      return (
        <span className="price total">
          <strong>{formatter.format(price * product.qty)}₮</strong>
        </span>
      );
    }

    const { products } = this.props;

    return (
      products &&
      products.reduce((acc, cur) => {
        let { price } = cur;

        if (cur.addminqty > 1) {
          price = cur.currentunitprice;

          if (cur.salepercent && cur.discountunitprice) {
            price = cur.discountunitprice;
          }
        } else if (cur.issalekg && cur.currentprice) {
          price = cur.currentprice;

          if (cur.salepercent && cur.discountprice) {
            price = cur.discountprice;
          }
        } else if (cur.salepercent && cur.discountprice) {
          price = cur.discountprice;
        }

        return acc + (price * (cur.qty ? cur.qty : 0));
      }, 0)
    );
  };

  renderWishlistProducts = () => {
    if (!this.props.isLoggedIn) {
      return null;
    }
    const wishlistProducts = this.props.wish;
    const lang = this.props.intl.locale;
    if (this.state.showButton) {
      return (
        wishlistProducts &&
        wishlistProducts.length > 0 && (
          <div className="block fav-products">
            <p className="title">
              <FormattedMessage id="shared.sidebar.title.wishlist" />
            </p>
            <ul className="list-unstyled">
              {wishlistProducts
                .slice(0, this.state.count)
                .map((wishlistProd, index) => (
                  <li
                    className="flex-this d-flex cart-wishlist-container"
                    key={index}
                  >
                    <div className="col-2 p-0">
                      <div className="image-container default">
                        <Link to={wishlistProd.route || ""}>
                          <span
                            className="image"
                            style={{ backgroundImage: `url(${process.env.IMAGE}${wishlistProd.img})` }}
                          />
                        </Link>
                      </div>
                    </div>
                    {/*  */}
                    <div className="col-8">
                      <div className="info-container">
                        <Link to={wishlistProd.route || ""}>
                          <div className="text">
                            <span>
                              {lang === "mn"
                                ? (wishlistProd.title.length > 50 ? `${wishlistProd.title.substring(0, 50)}...` : wishlistProd.title)
                                : wishlistProd.title_en.substring(0, 50)}
                            </span>
                            <strong>
                              {
                                formatter.format(wishlistProd.discountprice ?
                                  wishlistProd.discountprice || wishlistProd.currentprice
                                  : wishlistProd.price ? wishlistProd.price : 0,
                                )}
                              ₮
                            </strong>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/*  */}
                    <div className="col-2 cart-wishlist-btn info-container d-flex justify-content-center p-0">
                      <ButtonGoogle
                        className="action btn btn-link"
                        onClick={() => this.handleIncrementClick(wishlistProd)}
                      >
                        <i className="fa fa-cart-plus" aria-hidden="true" />
                      </ButtonGoogle>
                    </div>
                  </li>
                ))}
            </ul>
            {wishlistProducts.length <= 5 ? null : this.state.showButton ? (
              <Link
                to="#"
                className="btn btn-gray btn-block"
                onClick={e => this.seeMore(e)}
              >
                <span className="text-uppercase">
                  <FormattedMessage id="shared.sidebar.button.showAll" />
                </span>
              </Link>
            ) : null}
          </div>
        )
      );
    }
    return (
      wishlistProducts &&
      wishlistProducts.length > 0 && (
        <div className="block fav-products">
          <p className="title">
            <FormattedMessage id="shared.sidebar.title.wishlist" />
          </p>
          <ul className="list-unstyled">
            {wishlistProducts.map((wishlistProd, index) => (
              <li
                className="flex-this d-flex cart-wishlist-container"
                key={index}
              >
                <div className="col-2 p-0">
                  <div className="image-container default">
                    <Link to={wishlistProd.route || ""}>
                      <span
                        className="image"
                        style={{ backgroundImage: `url(${process.env.IMAGE}${wishlistProd.img})` }}
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-8">
                  <div className="info-container">
                    <Link to={wishlistProd.route || ""}>
                      <div className="text">
                        <span>
                          {lang === "mn"
                            ? (wishlistProd.title.length > 50 ? `${wishlistProd.title.substring(0, 50)}...` : wishlistProd.title)
                            : wishlistProd.title_en.substring(0, 50)}
                        </span>
                        <strong>
                          {
                            formatter.format(wishlistProd.discountprice ?
                              wishlistProd.discountprice || wishlistProd.currentprice
                              : wishlistProd.price ? wishlistProd.price : 0,
                            )}
                          ₮
                        </strong>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-2 cart-wishlist-btn info-container d-flex justify-content-center p-0">
                  <ButtonGoogle
                    className="action btn btn-link"
                    onClick={() => this.handleIncrementClick(wishlistProd)}
                  >
                    <i className="fa fa-cart-plus" aria-hidden="true" />
                  </ButtonGoogle>
                </div>
              </li>
            ))}
          </ul>
          {
            wishlistProducts.length <= 5 ? null : this.state.showButton ?
              <Link to="#" className="btn btn-gray btn-block" onClick={e => this.seeMore(e)}>
                <span className="text-uppercase">
                  <FormattedMessage id="shared.sidebar.button.showAll" />
                </span>
              </Link> : null
          }
        </div>
      )
    );
  };

  renderContent = () => {
    try {
      let products = this.state.tempProducts;
      const lang = this.props.intl.locale;
      const { isadd, ismin } = this.state;
      let content1;
      if (this.props.location.state !== undefined && this.props.location.state.isReturn) {
        content1 = (
          <div className="empty-cart">
            <FontAwesomeIcon icon={["fas", "money-bill-wave"]} />
            {this.props.location.state.return.payload.data.message}
          </div>
        );
      }
      let content = (
        <div>
          {content1}
          <div className="empty-cart">
            <FontAwesomeIcon icon={["fas", "shopping-basket"]} /> <FormattedMessage id="cart.info.empty" />
          </div>
        </div>
      );

      if (products && products.length > 0) {
        products = products.filter(product => product.qty);

        content = (
          <div>
            {content1}
            <table className="table table-borderless cart-table-container">
              <thead className="thead-light">
                <tr>
                  <th className="column-1">
                    <FormattedMessage id="cart.table.productName" />
                  </th>
                  <th className="column-2">
                    <FormattedMessage id="cart.table.unitPrice" />
                  </th>
                  <th className="column-3">
                    <FormattedMessage id="cart.table.count" />
                  </th>
                  <th className="column-4">
                    <p className="price total">
                      <FormattedMessage id="cart.table.price" />
                    </p>
                  </th>
                </tr>
              </thead>
              {products.map((prod, index) => {
                const title = lang === "mn" ? prod.title || prod.title : prod.title_en || prod.title_en;

                return (
                  <tbody key={index}>
                    <tr>
                      <td className="column-1">
                        <div className="flex-this">
                          <div className="image-container default">
                            <Link to={prod.route || `/productdetail/${prod.skucd}` || ""}>
                              <span
                                className="image"
                                style={{
                                  backgroundImage: `url(${process.env.IMAGE}${prod.img || prod.imgnm || prod.url || ""})`,
                                }}
                              />
                            </Link>
                          </div>
                          <div className="info-container">
                            <Link
                              to={prod.route || `/productdetail/${prod.skucd}` || ""}
                              style={{ color: "#6c757d" }}
                            >
                              <strong>{title && (title.length < 35 ? title : `${title.substring(0, 35)}...`)}</strong>
                              <span className="featured">
                                {lang === "mn"
                                  ? prod.featuretxt || prod.feature
                                  : prod.featuretxt_en || prod.feature_en
                                }
                              </span>
                            </Link>
                            {prod.availableqty <= 0 ? (
                              <div className="badge badge-dark">
                                {lang === "mn" ? "Дууссан" : "Sold out"}
                              </div>
                            ) : ""}
                          </div>
                        </div>
                      </td>
                      <td className="column-2">{this.renderUnitPrice(prod)}</td>
                      <td className="column-3">
                        <form onSubmit={e => { e.preventDefault(); }}>
                          <div className="input-group e-input-group">
                            <div className="input-group-prepend" id="button-addon4">
                              <button
                                onClick={() => this.handleDecrementClick(prod, index)}
                                className="btn"
                                type="button"
                              >
                                {ismin.loading && ismin.index === index ? <i className="fa fa-circle-o-notch fa-spin" /> : <i className="fa fa-minus" aria-hidden="true" />}
                              </button>
                            </div>
                            <input
                              ref={this.inputRef}
                              type="text"
                              className="form-control"
                              value={prod.qty}
                              name="productQty"
                              maxLength={5}
                              onKeyUp={this.handleInputKeyUp(prod)}
                              onChange={this.handleInputChange(prod)}
                              onBlur={this.handleInputBlur(prod)}
                            />
                            <div className="input-group-append" id="button-addon4">
                              <button
                                onClick={() => this.handleIncrementClick(prod, index)}
                                className="btn"
                                type="button"
                              >
                                {isadd.loading && isadd.index === index ? <i className="fa fa-circle-o-notch fa-spin" /> : <i className="fa fa-plus" aria-hidden="true" />}
                              </button>
                            </div>
                          </div>
                        </form>
                      </td>
                      <td className="column-4">
                        {this.renderTotalPrice(prod)}
                      </td>
                    </tr>
                    <tr className="table-action cart-footer">
                      <td colSpan="3" className="cart-deliveryinfo">
                        {/*
                          Хүргэлтийн мэдээллийг detail болон cart, ижил бараа наас нэмэх үед өөр өөр байгаа тул
                          доорх байдлаар шалгасан ба уг нь API дээр хийсэн бол
                        */}
                        {
                          prod.deliveryinfo !== null && prod.deliveryinfo !== undefined ? (
                            (prod.deliveryisshow === undefined || prod.deliveryisshow === 1) && prod.deliveryinfo !== "" ? (
                              <Alert
                                showIcon
                                description={lang === "mn" ? prod.deliveryinfo : prod.deliveryinfo_en}
                                type="info"
                              />
                            ) : null
                          ) : null
                        }
                      </td>
                      <td colSpan="4">
                        <div className="text-right single-action">
                          <ul className="list-unstyled d-f-center">
                            <li className="cart-footer-btn">
                              <ButtonGoogle
                                className={`${isMobile ? 'pl-0' : null} upper-first`}
                                onClick={e => this.handleSaveClick(e, prod)}
                              >
                                <i className="fa fa-heart" aria-hidden="true" />{" "}
                                <span >
                                  <FormattedMessage id="cart.table.button.save" />
                                </span>
                              </ButtonGoogle>
                            </li>
                            <li className="cart-footer-btn">
                              <ButtonGoogle onClick={this.handleRemoveClick(prod)} className={`${isMobile ? 'pl-0' : null}`}>
                                <i className="fa fa-times" aria-hidden="true" />{" "}
                                <span >
                                  <FormattedMessage id="cart.table.button.remove" />
                                </span>
                              </ButtonGoogle>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        );
      }

      return content;
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    const { products, staticinfo } = this.props;
    const { loading } = this.state;
    const lang = this.props.intl.locale;

    if (this.state.shouldRedirect) {
      return <Redirect to="/checkout" />;
    }

    return (
      <div className="section">
        <div className="container pad10">
          <div className="cart-container">
            <h1 className="title">
              <span className="text-uppercase">
                <FormattedMessage id="cart.title" />
              </span>
            </h1>
            <div className="row row10">
              <div className="col-xl-8 col-lg-8 pad10">
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-link pull-right upper-first btn-clear"
                      onClick={this.handleClearClick}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />{" "}
                      <span className="basket-clear">
                        <FormattedMessage id="cart.button.clear" />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="cart-table table-responsive" id="cart-table-wrapper">
                  {this.renderContent()}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 pad10">
                {/* <Affix offsetTop={170}> */}
                <div className="cart-info filter-sticky">
                  <div className="block cart-info-container">
                    {staticinfo && (
                      <p className="delivery">
                        <span className="title">
                          <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
                        </span>
                        <span>
                          {lang === "mn" ? staticinfo.deliverytxt : staticinfo.deliverytxt_en}
                        </span>
                      </p>
                    )}
                    <div className="total">
                      <p className="flex-space count">
                        <span>
                          <FormattedMessage id="cart.sidebar.label.total" />:{" "}
                        </span>
                        <span>
                          {parseInt(this.renderTotalQty())}<FormattedMessage id="cart.sidebar.label.unit" />
                        </span>
                      </p>
                      <p className="flex-space">
                        <span>
                          <FormattedMessage id="shared.sidebar.label.totalPrice" />:{" "}
                        </span>
                        <span>
                          {formatter.format(this.renderTotalPrice())}₮
                        </span>
                      </p>
                    </div>
                    <button
                      ref={this.proceedRef}
                      className={`btn btn-main btn-block${
                        products && products.length ? "" : " disabled"
                        }`}
                      onClick={() => this.handleConfirmClick()}
                      disabled={loading}
                    >
                      <i className={`fa ${loading ? "fa-spin" : null}`} aria-hidden="true" />
                      {" "}
                      <span className="text-uppercase">
                        <FormattedMessage id="shared.sidebar.button.proceed" />
                      </span>
                    </button>
                  </div>
                  {this.renderWishlistProducts()}
                </div>
                {/* </Affix> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Cart);
