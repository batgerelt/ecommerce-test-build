/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedDate, FormattedMessage, defineMessages } from 'react-intl';
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import Products from "./products";
import { Slider, Notification } from "../../components";
import chef from "../../../src/scss/assets/images/demo/chef.png";
import time from "../../../src/scss/assets/images/demo/time.png";
import smile from "../../../src/scss/assets/images/demo/smile.png";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
  state = {
    loading: false,
  }
  renderRoot = () => {
    try {
      const { recipe } = this.props;
      return (
        <ul className="list-unstyled">
          <li>
            <Link to="">
              <span><FormattedMessage id="recipeDetail.breadcrumb.home" /></span>
            </Link>
          </li>
          <li>
            <Link to="/recipe">
              <span><FormattedMessage id="recipeDetail.breadcrumb.recipe" /></span>
            </Link>
          </li>
          <li>
            <span>{this.props.lang === "mn" ? recipe.recipenm : recipe.recipenm_en}</span>
          </li>
        </ul>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  renderTitleDate = () => {
    try {
      const { recipe } = this.props;
      return (
        <div>
          <h4 className="title">
            <span>{this.props.lang === "mn" ? recipe.recipenm : recipe.recipenm_en}</span>
          </h4>
          <p className="date">
            <FormattedMessage
              id="recipeDetail.date"
              defaultMessage="{year}.{month}.{day}"
              values={{
                year: <FormattedDate value={new Date(recipe.insymd)} year="numeric" />,
                month: <FormattedDate value={new Date(recipe.insymd)} month="2-digit" />,
                day: <FormattedDate value={new Date(recipe.insymd)} day="2-digit" />,
              }}
            />
            {/* <span>{`${date[0]} оны ${date[1]} сарын ${date[2]}`}</span> */}
          </p>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderSlider = () => {
    try {
      const { recipe } = this.props;
      const sliderParams = {
        spaceBetween: 0,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
      };
      return (
        <div className="content">
          <div className="main-slide">
            <Slider
              ratio="1:3x2"
              isRecipeDetail
              sliderData={recipe.images}
              params={sliderParams}
              elContainer={"images"}
            />
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderDelivery = () => {
    try {
      const { recipe, lang } = this.props;
      return (
        <div className="block product-delivery">
          <p className="title">
            {/* <strong>Хүргэлтийн мэдээлэл</strong> */}
            <strong>
              <FormattedMessage id="shared.sidebar.title.deliveryInfo" />
            </strong>
          </p>
          <p className="text">
            <span>{lang === "mn" ? recipe.deliverytxt : recipe.deliverytxt_en}</span>
          </p>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderIcons = () => {
    try {
      const { recipe, lang } = this.props;
      return recipe && (
        <div className="block product-delivery icons">
          <div className="row row10">
            <div className="col">
              <Avatar size="small" src={chef} />
              <br />
              {lang === "mn" ? recipe.madeoflvlText : recipe.madeoflvlText_en}
            </div>
            <div className="col">
              <Avatar size="small" src={time} /><br />
              {lang === "mn" ? recipe.time : recipe.time_en}
            </div>
            <div className="col">
              <Avatar size="small" src={smile} /><br />
              <FormattedMessage
                id="recipeDetail.icons.foodSize"
                defaultMessage="{people} хүний орц"
                values={{
                  people: recipe.humancnt,
                }}
              />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  handleIncrementClick = async (product) => {
    try {
      const { intl } = this.props;

      if (localStorage.getItem('emartmall_token') !== null) {
        this.setState({ loading: true });
        const result = await this.props.incrementProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: product.skucd,
          qty: product.addminqty || 1,
          iscart: 0,
        });
        this.setState({ loading: false });
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
              text={intl.formatMessage(
                messages.error, {
                name: result.payload.data.values[1],
                qty: result.payload.data.values[2],
              },
              )}
            />,
          });
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);

        const updated = this.props.products.find(prod => prod.skucd === product.skucd);

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
              text={intl.formatMessage(
                messages.error, {
                name: updated.title,
                qty: updated.qty,
              },
              )}
            />,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // eslint-disable-next-line consistent-return
  handleIncrementAllClick = async (products) => {
    try {
      const { intl } = this.props;

      if (this.props.isLoggedIn) {
        this.setState({ loading: true });
        const result = await this.props.incrementRecipeProductsRemotely({
          recipeid: this.props.match.params.id,
        });
        this.setState({ loading: false });
        if (!result.payload.success) {
          return store.addNotification({
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
              text={intl.formatMessage({ id: result.payload.code })}
            />,
          });
        }
        if (result.payload.data.fail.length > 0) {
          const names = [];

          result.payload.data.fail.forEach((failed) => {
            names.push(failed.values[1]);
          });

          if (names.length > 0) {
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
                text={intl.formatMessage({ id: "206" }, { names: names.join(", "), qty: result.payload.data.qty })}
              />,
            });
          }
        }
      } else {
        products = products.map(prod => ({
          ...prod,
          insymd: Date.now(),
        }));
        this.props.incrementRecipeProductsLocally(products);

        const names = [];

        products.forEach((product) => {
          const updated = this.props.products.find(prod => prod.skucd === product.skucd);

          if (updated && updated.error !== undefined) {
            const name = intl.locale === "mn" ? updated.title : updated.title_en;

            names.push(name);
          }
        });

        if (names.length > 0) {
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
              text={intl.formatMessage({ id: "206" }, { names: names.join(", "), qty: products.length - names.length })}
            />,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderProd = () => {
    try {
      const { lang } = this.props;
      const products = this.props.recipeProducts;
      const { loading } = this.state;
      return products.map((item, index) => (
        <li key={index}>
          <div className="single flex-this">
            <div className="image-container">
              <Link to={item.route ? item.route : ""}>
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(${process.env.IMAGE + item.img})`,
                  }}
                />
              </Link>
            </div>
            <div className="info-container flex-space info-price-container recipe-products">
              <Link to={item.route ? item.route : ""}>
                <span className="recipe-product-title">
                  {lang === "mn" ? item.title : item.title_en}
                </span>
                <span className="recipe-product-price price">
                  {item.pricetag && (
                    <span className="pricetag">
                      {lang === "mn" ? item.pricetag : item.pricetag_en}
                    </span>
                  )}
                  <span className="current">
                    <small className="sale" style={{ marginRight: '5px', textDecoration: 'line-through' }}>
                      {
                        item.discountprice !== 0 ?
                          `${formatter.format(item.price)}₮` : null
                      }
                    </small>
                    {formatter.format(item.discountprice !== 0 ? item.discountprice : item.price)}₮
                  </span>
                </span>
              </Link>
              <div className="action">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => this.handleIncrementClick(item)}
                >
                  <i className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
                  {" "}
                </button>
              </div>
            </div>
          </div>
        </li>
      ));
    } catch (error) {
      return null;
    }
  };

  renderProducts = () => {
    const products = this.props.recipeProducts;
    const { loading } = this.state;
    const total =
      products &&
      products.length > 0 &&
      products.reduce((acc, cur) => acc + cur.price, 0);
    try {
      return (
        <div className="block product-suggest">
          <p className="title">
            <strong>
              <FormattedMessage id="shared.sidebar.title.recipeProducts" />
            </strong>
          </p>
          <ul className="list-unstyled">
            {products.map((item, index) => (
              <Products item={item} key={index} data={this.props.data} incrementProductRemotely={this.props.incrementProductRemotely} incrementProductLocally={this.props.incrementProductLocally} />
            ))}
          </ul>
          <div className="more-link text-center">
            <div className="pack-price">
              {/* <p className="text flex-this end">
                <span style={{ fontSize: "1.6rem" }}>
                  <FormattedMessage id="recipeDetail.recipe.product.label.price" />:
                </span>
                <strong>{formatter.format(total)}₮</strong>
              </p> */}
              <button
                type="button"
                disabled={loading}
                className="btn btn-main"
                onClick={() => this.handleIncrementAllClick(products)}
              >
                <i className={`fa ${loading ? "fa-spin" : "fa-cart-plus"}`} aria-hidden="true" style={{ fontSize: "1.2rem" }} />
                {" "}
                <span className="text-uppercase">
                  <FormattedMessage id="shared.sidebar.button.addToCart" />
                </span>
              </button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderRecipe = () => {
    try {
      const { recipe, lang } = this.props;
      return (
        <div>
          <div className="row row10 recipes-container">
            <div className="col-md-6 recipes">
              <p className="title">
                <FormattedMessage id="recipeDetail.recipe.title.ingredient" />
              </p>
              <ul>{this.renderIngredients()}</ul>
            </div>
            <div className="col-md-6 seasons">
              <p className="title">
                <span>
                  <FormattedMessage id="recipeDetail.recipe.title.seasoning" />
                </span>
              </p>

              <ul>{this.renderSpices()}</ul>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderSpices = () => {
    try {
      const { recipe, lang } = this.props;
      const spices = lang === "mn" ? recipe.spices : recipe.spices_en;
      return spices.map((item, index) => (
        <li className="recipe-list-item" key={index}>
          <span>#</span>
          {item}
        </li>
      ));
    } catch (error) {
      return null;
    }
  };

  renderIngredients = () => {
    try {
      const { recipe, lang } = this.props;
      const ingredients = lang === "mn" ? recipe.ingredients : recipe.ingredients_en;
      return ingredients.map((item, index) => (
        <li className="recipe-list-item" key={index}>
          <span>#</span>
          {item}
        </li>
      ));
    } catch (error) {
      return null;
    }
  };

  renderCk = () => {
    try {
      const { recipe, lang } = this.props;
      return (
        <div className="ck-editor">
          <h4 className="title">
            <FormattedMessage id="recipeDetail.suggestion.title" />
          </h4>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: lang === "mn" ? recipe.description : recipe.description_en,
            }}
          />
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderSteps = () => {
    try {
      const { steps, lang } = this.props;
      return steps.map((step, index) => (
        <div key={index}>
          <div className="row row10" style={{ alignItems: "initial" }}>
            <div className="col-sm-6 col-md-4 image-container fill">
              <div
                style={{
                  backgroundImage: `url(${process.env.IMAGE + step.imgnm})`,
                  backgroundSize: "cover",
                  width: "100%",
                  height: "200px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div className="col-sm-6 col-md-8">
              <h4 className="step-title">
                <ul className="circle">
                  <li>
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      <FormattedMessage id="recipeDetail.label.step" />. {++index}
                    </span>
                  </li>
                </ul>
              </h4>
              {lang === "mn" ? step.description : step.description_en}
              <p />
            </div>
          </div>
        </div>
      ));
    } catch (error) {
      return null;
    }
  };

  render() {
    const { steps } = this.props;
    return (
      <div className="section">
        <div className="container pad10">
          <div className="e-breadcrumb">
            {this.props.recipe === null ? null : this.renderRoot()}
          </div>
          <div className="product-detail-page recipe-detail">
            <div className="row">
              <div className="col-lg-8">
                {this.renderTitleDate()}
                <div className="food-recipe-detail">
                  {this.renderSlider()}
                  {this.renderRecipe()}
                  <hr />
                  {this.renderCk()}
                  {
                    steps.length !== 0 ?
                      <div>
                        <h4 className="title">
                          <FormattedMessage id="recipeDetail.instruction.title" />
                        </h4>
                        {this.renderSteps()}
                      </div>
                      : null
                  }
                </div>
              </div>
              <div className="col-lg-4">
                <div className="product-plus">
                  {this.renderDelivery()}
                  {this.renderIcons()}
                  {this.renderProducts()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(List);
