/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import { Link } from "react-router-dom";
import { Spin, Select } from "antd";
import { toast } from "react-toastify";
import {
  CARD_LIST_TYPES,
  CARD_TYPES,
  PRODUCTS_PER_PAGE,
} from "../../utils/Consts";
import { CardList, FilterSet } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";

class CategoryInfo extends React.Component {
  state = {
    loading: false,
    isListViewOn: false,
    minPrice: null,
    maxPrice: null,
    sort: "price_asc",
    checkedList: [],
    products: [],
    isLeftPanel: false,
  };

  componentWillMount() {
    console.log('hello');
  }

  renderBreadCrumb = () => {
    try {
      const { parents } = this.props.categoryinfo;
      return (
        <div className="e-breadcrumb">
          <ul className="list-unstyled">
            {
              parents.map(category => (
                <li key={category.catnm}>
                  <Link to={category.route ? category.route : ""}>
                    <span>{category.catnm}</span>
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderLeftPanel = (cats) => {
    try {
      const { attributes } = this.props.categoryinfo;

      const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;
      const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;

      let filters = attributes.map((attr, index) => (
        <FilterSet
          key={index}
          onAttributeChange={this.handleAttributeChange}
          onPriceAfterChange={this.handlePriceAfterChange}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          data={attr}
        />
      ));

      filters = (
        <div>
          <h5 className="title">
            <strong>Шүүлтүүр</strong>
          </h5>
          <div className="left-filter">{filters}</div>
        </div>
      );


      return (
        <div className="col-xl-3 col-md-3 pad10">
          <div className={`left-panel-container ${leftPanel1}`} onClick={this.showLeftPanel}>
            <div className={leftPanel}>
              <button
                className="button buttonBlack filter-cross"
                onClick={this.showLeftPanel}
              >
                <img
                  src={crossImage}
                  alt="cross"
                  height="25px"
                  aria-hidden="true"
                />
              </button>
              <h5 className="title">
                <strong>Хайлтын үр дүн</strong>
              </h5>
              <p className="title">
                <span>Ангилал</span>
              </p>
              {cats}
              {filters}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderFilteredList = (selectedCat) => {
    try {
      const { products } = this.props.categoryinfo;

      let result = null;
      if (this.state.isListViewOn) {
        result = (
          <CardList
            type={CARD_LIST_TYPES.list}
            items={products}
            cardType={CARD_TYPES.list}
          />
        );
      } else {
        result = (
          <CardList
            type={CARD_LIST_TYPES.horizontal}
            items={products}
            showAll
            cardType={CARD_TYPES.wide}
          />
        );
      }

      return (
        <div className="col-xl-9 col-lg-9 col-md-8 pad10">
          <div className="list-filter">
            <div className="row row10">
              <div className="col-lg-6 pad10">
                <div className="total-result">
                  <p className="text">
                    <strong>"{selectedCat}"</strong> {products.length}{" "}
                          бараа олдлоо
                  </p>
                </div>
              </div>
              <div className="col-lg-6 pad10">
                <form className="flex-this end">
                  <div className="text-right d-block d-md-none">
                    <a
                      className="btn btn-gray btn-filter"
                      onClick={this.showLeftPanel}
                    >
                      <i className="fa fa-filter" aria-hidden="true" />
                      <span className="text-uppercase">Шүүлтүүр</span>
                    </a>
                  </div>
                  <div className="form-group my-select flex-this">
                    <label
                      htmlFor="inputState"
                      style={{
                              marginTop: "7px",
                              marginRight: "5px",
                            }}
                    >
                            Эрэмбэлэх:
                    </label>
                    <Select
                      defaultValue={this.state.sort}
                      onChange={this.handleSortChange}
                      className="form-control"
                      id="inputState"
                    >
                      <Select.Option value="price_desc">Үнэ буурахаар</Select.Option>
                      <Select.Option value="price_asc">Үнэ өсөхөөр</Select.Option>
                    </Select>
                  </div>
                  <div className="form-group flex-this">
                    <Link
                      to=""
                      className={
                              this.state.isListViewOn ? "btn active" : "btn"
                            }
                      onClick={this.handleListViewClick}
                    >
                      <i className="fa fa-th-list" aria-hidden="true" />
                    </Link>
                    <Link
                      to=""
                      className={
                              this.state.isListViewOn ? "btn" : "btn active"
                            }
                      onClick={this.handleGridViewClick}
                    >
                      <i className="fa fa-th" aria-hidden="true" />
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Spin spinning={this.state.loading}>{result}</Spin>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    const { parents, subcategorys } = this.props.categoryinfo;
    const { id } = this.props;

    let selectedCat = null;
    let cats = <div className="block">Ангилал байхгүй байна</div>;
    cats = parents.map((parent, index) => {
      if (parent.id === parseInt(id)) {
        selectedCat = parent.catnm;
        return (
          <div key={index} className="block">
            <div className="accordion">
              <h6
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBotton: "0",
                }}
              >
                {parent.catnm}
              </h6>
              <div
                id="collapseOne"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="collapse-content">
                  <ul className="list-unstyled">
                    {subcategorys.map((sub, index) => {
                      if (sub.parentid === parent.id) {
                        return (
                          <li key={index}>
                            <Link to={sub.route ? sub.route : ""}>
                              {sub.catnm}
                            </Link>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    });

    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10">
            {this.renderBreadCrumb()}
            <div className="row row10">
              {this.renderLeftPanel(cats)}
              {this.renderFilteredList(selectedCat)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryInfo;
