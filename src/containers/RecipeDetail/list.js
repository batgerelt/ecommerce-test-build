/* eslint-disable react/no-danger */
import React from "react";
import { injectIntl, FormattedDate, FormattedMessage, defineMessages } from 'react-intl';
import { Avatar, message } from "antd";
import { Link } from "react-router-dom";
import { Slider } from "../../components";
import chef from "../../../src/scss/assets/images/demo/chef.png";
import time from "../../../src/scss/assets/images/demo/time.png";
import smile from "../../../src/scss/assets/images/demo/smile.png";

const formatter = new Intl.NumberFormat("en-US");

class List extends React.Component {
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
      // const date = recipe.insymd.split("T")[0].split("-");
      return (
        <div>
          <h4 className="title">
            <span>{recipe.recipenm}</span>
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
              sliderData={recipe.images}
              params={sliderParams}
              elContainer={"images"}
              contain
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

  handleIncrementClick = async (product) => {
    try {
      const { intl } = this.props;

      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: product.cd,
          qty: product.saleminqty || 1,
          iscart: 0,
        });
        if (!result.payload.success) {
          const messages = defineMessages({
            error: {
              id: result.payload.code,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: result.payload.data.values[0],
            qty: result.payload.data.values[1],
          }));
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);

        const updated = this.props.products.find(prod => prod.cd === product.cd);

        if (updated && updated.error !== undefined) {
          const messages = defineMessages({
            error: {
              id: updated.error,
            },
          });

          message.warning(intl.formatMessage(messages.error, {
            name: updated.name,
            qty: updated.qty,
          }));
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

      if (this.props.isLogged) {
        const result = await this.props.incrementRecipeProductsRemotely({
          recipeid: this.props.match.params.id,
        });
        if (!result.payload.success) {
          return message.warning(intl.formatMessage({ id: result.payload.code }));
        }
        if (result.payload.data.fail.length > 0) {
          result.payload.data.fail.forEach((msg) => {
            const messages = defineMessages({
              error: {
                id: msg.code,
              },
            });

            message.warning(intl.formatMessage(messages.error, {
              name: msg.value.name,
              qty: msg.value.salemaxqty,
            }));
          });
        }
      } else {
        products = products.map(prod => ({
          ...prod,
          insymd: Date.now(),
        }));
        this.props.incrementRecipeProductsLocally(products);

        products.forEach((product) => {
          const updated = this.props.products.find(prod => prod.cd === product.cd);

          if (updated && updated.error !== undefined) {
            const messages = defineMessages({
              error: {
                id: updated.error,
              },
            });

            message.warning(intl.formatMessage(messages.error, {
              name: updated.name,
              qty: updated.qty,
            }));
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderProd = () => {
    try {
      const { lang } = this.props;
      const products = this.props.recipeProducts;
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
            <div className="info-container flex-space">
              <Link to={item.route ? item.route : ""}>
                <strong>
                  <span>{lang === "mn" ? item.name : item.name_en}</span>
                </strong>
                <p>
                  <FormattedMessage id="recipeDetail.recipe.product.label.price" />:{" "}
                  {formatter.format(item.price)}₮
                </p>
              </Link>
              <div className="action">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => this.handleIncrementClick(item)}
                >
                  <i
                    className="fa fa-cart-plus"
                    aria-hidden="true"
                    style={{ fontSize: "1.2rem" }}
                  />
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
          <ul className="list-unstyled">{this.renderProd()}</ul>
          <div className="more-link text-center">
            <div className="pack-price">
              <p className="text flex-this end">
                <span style={{ fontSize: "1.6rem" }}>
                  <FormattedMessage id="shared.sidebar.label.price" />:
                </span>
                <strong>{formatter.format(total)}₮</strong>
              </p>
              <button
                type="button"
                className="btn btn-main"
                onClick={() => this.handleIncrementAllClick(products)}
              >
                <i
                  className="fa fa-cart-plus"
                  aria-hidden="true"
                  style={{ fontSize: "1.2rem" }}
                />{" "}
                <span className="text-uppercase"><FormattedMessage id="shared.sidebar.button.addToCart" /></span>
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
          <div className="row row10">
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={chef} /> {lang === "mn" ? recipe.madeoflvlText : recipe.madeoflvlText_en}
              </p>
            </div>
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={time} /> {lang === "mn" ? recipe.time : recipe.time_en}
              </p>
            </div>
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={smile} />
                {/* {recipe.humancnt} хүний порц */}
                <FormattedMessage
                  id="recipeDetail.icons.foodSize"
                  defaultMessage="{people} хүний орц"
                  values={{
                    people: recipe.humancnt,
                  }}
                />
              </p>
            </div>
          </div>
          <div className="row row10">
            <div className="col-md-6">
              <p className="title"><FormattedMessage id="recipeDetail.recipe.title.ingredient" /></p>
              <div className="row row10">{this.renderIngredients()}</div>
            </div>
            <div className="col-md-6">
              <p className="title"><FormattedMessage id="recipeDetail.recipe.title.seasoning" /></p>
              {this.renderSpices()}
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
        <div className="col-md-6" key={index}>
          <p className="recipe-list-item">
            <span>#</span>
            {item}
          </p>
        </div>
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
        <div className="col-md-6" key={index}>
          <p className="recipe-list-item">
            <span>#</span>
            {item}
          </p>
        </div>
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
          <h4 className="title" style={{ textTransform: "uppercase" }}>
            <span><FormattedMessage id="recipeDetail.suggestion.title" /></span>
          </h4>
          <div dangerouslySetInnerHTML={{
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
      console.log('steps: ', steps);
      return steps.map((step, index) => (
        <div key={index}>
          <div className="row row10">
            <div className="col-md-4">
              <div
                style={{
                  backgroundImage: `url(${process.env.IMAGE + step.imgnm})`,
                  backgroundSize: "cover",
                  width: "100%",
                  height: "200px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              />
            </div>
            <div className="col-md-8">
              <h4><FormattedMessage id="recipeDetail.label.step" /> {++index}</h4>
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
    return (
      <div className="section">
        <div className="container pad10">
          <div className="e-breadcrumb">{this.renderRoot()}</div>
          <div className="product-detail-page">
            <div className="row row10">
              <div className="col-md-8 pad10">
                {this.renderTitleDate()}
                <div className="food-recipe-detail">
                  {this.renderSlider()}
                  {this.renderRecipe()}
                  <hr />
                  {this.renderCk()}
                  <br />
                  <div>
                    <h4
                      className="title"
                      style={{
                        textTransform: "uppercase",
                        marginBottom: "20px",
                      }}
                    >
                      <span><FormattedMessage id="recipeDetail.instruction.title" /></span>
                    </h4>
                    {this.renderSteps()}
                  </div>
                </div>
              </div>
              <div className="col-md-4 pad10">
                <div className="product-plus">
                  {this.renderDelivery()}
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
