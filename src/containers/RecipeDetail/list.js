/* eslint-disable react/no-danger */
import React from "react";
import { Avatar } from "antd";
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
              <span>Нүүр</span>
            </Link>
          </li>
          <li>
            <Link to="/recipe">
              <span>Хоолны жор</span>
            </Link>
          </li>
          <li>
            <span>{recipe === null ? null : recipe.recipenm}</span>
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
      const date = recipe.insymd.split("T")[0].split("-");
      return (
        <div>
          <h4 className="title">
            <span>{recipe.recipenm}</span>
          </h4>
          <p className="date">
            <span>{`${date[0]} оны ${date[1]} сарын ${date[2]}`}</span>
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
      const { recipe } = this.props;
      return (
        <div className="block product-delivery">
          <p className="title">
            <strong>Хүргэлтийн мэдээлэл</strong>
          </p>
          <p className="text">
            <span>{recipe.deliverytxt}</span>
          </p>
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  handleIncrementClick = async (product) => {
    try {
      if (this.props.isLogged) {
        const result = await this.props.incrementProductRemotely({
          custid: this.props.data[0].info.customerInfo.id,
          skucd: product.cd,
          qty: product.addminqty || 1,
          iscart: 0,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
        }
      } else {
        product.insymd = Date.now();
        this.props.incrementProductLocally(product);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleIncrementAllClick = async (products) => {
    try {
      if (this.props.isLogged) {
        const result = await this.props.incrementRecipeProductsRemotely({
          recipeid: this.props.match.params.recipeid,
        });
        if (!result.payload.success) {
          this.handleNotify(result.payload.message);
        }
      } else {
        products = products.map(prod => ({
          ...prod,
          insymd: Date.now(),
        }));
        this.props.incrementRecipeProductsLocally(products);
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderProd = () => {
    try {
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
                  <span>{item.name}</span>
                </strong>
                <p>Үнэ: {formatter.format(item.price)}₮</p>
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
            <strong>Жоронд орсон бараа</strong>
          </p>
          <ul className="list-unstyled">{this.renderProd()}</ul>
          <div className="more-link text-center">
            <div className="pack-price">
              <p className="text flex-this end">
                <span style={{ fontSize: "1.6rem" }}>Үнэ:</span>
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
                <span className="text-uppercase">Сагсанд нэмэх</span>
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
      const { recipe } = this.props;
      return (
        <div>
          <div className="row row10">
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={chef} /> {recipe.madeoflvlText}
              </p>
            </div>
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={time} /> {recipe.time}
              </p>
            </div>
            <div className="col-md-4 col-xs-4">
              <p>
                <Avatar size="small" src={smile} />
                {recipe.humancnt} хүний порц
              </p>
            </div>
          </div>
          <div className="row row10">
            <div className="col-md-6">
              <p className="title">ОРЦ</p>
              <div className="row row10">{this.renderIngredients()}</div>
            </div>
            <div className="col-md-6">
              <p className="title">АМТЛАГЧ</p>
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
      const { recipe } = this.props;
      return recipe.spices.map((item, index) => (
        <div className="col-md-6" key={index}>
          <p>
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
      const { recipe } = this.props;
      return recipe.ingredients.map((item, index) => (
        <div className="col-md-6" key={index}>
          <p>
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
      const { recipe } = this.props;
      return (
        <div className="ck-editor">
          <h4 className="title" style={{ textTransform: "uppercase" }}>
            <span>Зөвлөгөө</span>
          </h4>
          <div dangerouslySetInnerHTML={{ __html: recipe.description }} />
        </div>
      );
    } catch (error) {
      return null;
    }
  };

  renderSteps = () => {
    try {
      const { steps } = this.props;
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
              <h4>АЛХАМ {++index}</h4>
              {step.description}
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
                      <span>Хоол хийх заавар</span>
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

export default List;
