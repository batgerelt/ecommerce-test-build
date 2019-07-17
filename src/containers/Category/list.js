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
import {
  CARD_LIST_TYPES,
  CARD_TYPES,
} from "../../utils/Consts";
import { CardList, FilterSet, Loader } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";

const Option = Select.Option;

class CategoryInfo extends React.Component {
  state = {
    loading: false,
    isListViewOn: false,
    minPrice: 0,
    maxPrice: 0,
    ordercol: "price_asc",
    parameters: [],
    products: this.props.categoryfilter.length === 0 ? [] : this.props.categoryfilter,
    subcategorys: this.props.categoryinfo.length === 0 ? [] : this.props.categoryinfo.subcategorys,
    parents: this.props.categoryinfo.length === 0 ? [] : this.props.categoryinfo.parents,
    attributes: this.props.categoryinfo.length === 0 ? [] : this.props.categoryinfo.attributes,
    selectedPromoCatId: null,
    isLeftPanel: false,
  };

  handleSortChange = (value) => {
    const { parameters, minPrice, maxPrice } = this.state;
    const params = {
      catid: this.props.id,
      parameters,
      minprice: minPrice,
      maxprice: maxPrice,
      ordercol: value,
      rowcount: 0,
      startswith: 0,
    };
    this.setState({
      ordercol: value,
    });
    this.fetchProductData(params);
  };

  handlePriceAfterChange = (value) => {
    const { parameters, ordercol } = this.state;
    const params = {
      catid: this.props.id,
      parameters,
      minprice: value[0],
      maxprice: value[1],
      ordercol,
      rowcount: 0,
      startswith: 0,
    };
    this.setState({
      minPrice: value[0],
      maxPrice: value[1],
    });
    this.fetchProductData(params);
  };

  handleAttributeChange = (e) => {
    const { minPrice, maxPrice, ordercol } = this.state;
    let parameters = this.state.parameters;
    const i = parameters.indexOf(e.target.value);
    if (e.target.checked) {
      parameters.push(e.target.value);
    } else if (i !== -1) {
      parameters.splice(i, 1);
    }
    this.setState({ parameters });
    const params = {
      catId: this.props.id,
      parameters,
      minPrice,
      maxPrice,
      ordercol,
      rowcount: 0,
      startswith: 0,
    };

    this.fetchProductData(params);
  };

  fetchProductData = (params) => {
    this.setState({ loading: true });
    this.props.categoryFilter({
      body: { ...params },
    }).then((res) => {
      if (res.payload.success) {
        this.setState({ products: res.payload.data });
      }
      this.setState({ loading: false });
    });
  }

  renderBreadCrumb = () => {
    try {
      const { parents } = this.state;
      return (
        <div className="e-breadcrumb">
          <ul className="list-unstyled">
            {parents.map(category => (
              <li key={category.catnm}>
                <Link to={category.route ? category.route : ""}>
                  <span>{category.catnm}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  handleViewChange = (e) => {
    e.preventDefault();
    this.setState({ isListViewOn: !this.state.isListViewOn });
  };

  renderLeftPanel = () => {
    try {
      const { id } = this.props;
      const { subcategorys, products, parents } = this.state;
      let tmp = <div className="block">Ангилал байхгүй байна</div>;
      if (parents.length !== 0) {
        tmp = parents.map((item, i) => {
          if (item.id === parseInt(id)) {
            return (
              <div key={i} className="block">
                <div className="accordion">
                  <h6 style={{ marginLeft: "10px", marginTop: "10px", marginBittom: 0 }}>
                    {item.catnm}
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
                          if (sub.parentid === item.id) {
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
      }
      return tmp;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFilteredList = () => {
    try {
      const { attributes } = this.state;
      let filters =
        attributes &&
        attributes.map((attr, index) => (
          <FilterSet
            key={index}
            onAttributeChange={this.handleAttributeChange}
            onPriceAfterChange={this.handlePriceAfterChange}
            minPrice={this.state.minPrice}
            maxPrice={this.state.maxPrice}
            data={attr}
          />
        ));

      return filters;
    } catch (error) {
      return console.log(error);
    }
  }

  renderProducts = () => {
    try {
      const { isListViewOn, products } = this.state;
      let result = null;
      if (this.state.isListViewOn) {
        result = (
          <CardList
            cartListType={CARD_LIST_TYPES.list}
            items={products}
            cardType={CARD_TYPES.list}
          />
        );
      } else {
        result = (
          <CardList
            cartListType={CARD_LIST_TYPES.horizontal}
            items={products}
            showAll
            cardType={CARD_TYPES.wide}
          />
        );
      }
      return result;
    } catch (error) {
      return console.log(error);
    }
  }

  getSelectedCat = () => {
    const { parents } = this.state;
    const { id } = this.props;
    let tmp = '';
    parents.map((item, i) => {
      if (item.id === parseInt(id)) {
        tmp = item.catnm;
      }
      return tmp;
    });
    return tmp;
  }


  render() {
    if (this.props.categoryinfo.length !== 0) {
      const { isLeftPanel, products, isListViewOn } = this.state;
      const leftPanel = `left-panel${isLeftPanel ? " show" : ""}`;
      const leftPanel1 = `${isLeftPanel ? " show" : ""}`;
      return (
        <div className="top-container">
          <div className="section">
            <div className="container pad10">
              {this.renderBreadCrumb()}
              <div className="row row10">
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
                      {this.renderLeftPanel()}
                      <div>
                        <h5 className="title">
                          <strong>Шүүлтүүр</strong>
                        </h5>
                        <div className="left-filter">
                          {this.renderFilteredList()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-8 pad10">
                  <div className="list-filter">
                    <div className="row row10">
                      <div className="col-lg-6 pad10">
                        <div className="total-result">
                          <p className="text">
                            <strong>"{this.getSelectedCat()}"</strong> {products.length}{" "}
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
                              defaultValue={this.state.ordercol}
                              onChange={this.handleSortChange}
                              className="form-control"
                              id="inputState"
                            >
                              <Option value="price_desc">Үнэ буурахаар</Option>
                              <Option value="price_asc">Үнэ өсөхөөр</Option>
                            </Select>
                          </div>
                          <div className="form-group flex-this">
                            <button
                              className={isListViewOn ? "btn active" : "btn"}
                              onClick={this.handleViewChange}
                            >
                              <i className="fa fa-th-list" aria-hidden="true" />
                            </button>
                            <button
                              className={isListViewOn ? "btn" : "btn active"}
                              onClick={this.handleViewChange}
                            >
                              <i className="fa fa-th" aria-hidden="true" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <Spin spinning={this.state.loading}>{this.renderProducts()}</Spin>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CategoryInfo;
