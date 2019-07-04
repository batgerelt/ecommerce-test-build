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
import { CardList, FilterSet } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";

class CategoryInfo extends React.Component {
  state = {
    loading: false,
    isListViewOn: false,
    minPrice: 0,
    maxPrice: 0,
    ordercol: "price_asc",
    parameters: [],
    products: [],
    isLeftPanel: false,
  };

  handlePriceAfterChange = (value) => {
    const { parameters, ordercol, selectedPromoCatId } = this.state;
    const { id } = this.props;
    const params = {
      catid: id,
      parameters,
      minPrice: value[0],
      maxPrice: value[1],
      ordercol,
      rowcount: 20,
      startswith: 0,
    };
    this.fetchProductData(params);
    this.setState({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  handleAttributeChange = (e) => {
    const {
      minPrice, maxPrice, ordercol, selectedPromoCatId,
    } = this.state;
    const { id } = this.props;
    let parameters = this.state.parameters;
    const i = parameters.indexOf(e.target.value);

    if (e.target.checked) {
      parameters.push(e.target.value);
    } else if (i !== -1) {
      parameters.splice(i, 1);
    }

    this.setState({ parameters });

    const params = {
      catid: id,
      parameters,
      minPrice,
      maxPrice,
      ordercol,
      rowcount: 20,
      startswith: 0,
    };

    this.fetchProductData(params);
  };

  handleordercolChange = (value) => {
    const {
      parameters, minPrice, maxPrice, selectedPromoCatId,
    } = this.state;
    const { id } = this.props;
    const params = {
      catid: id,
      parameters,
      minPrice,
      maxPrice,
      ordercol: value,
      rowcount: 20,
      startswith: 0,
    };
    this.fetchProductData(params);

    this.setState({
      ordercol: value,
    });
  };

  fetchProductData = (params) => {
    this.setState({ loading: true });
    this.props.categoryFilter({
      body: { ...params },
    }).then((res) => {
      this.setState({ loading: false });
    });
  }

  renderBreadCrumb = () => {
    try {
      const { parents } = this.props.categoryinfo;
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
    this.setState({ isListViewOn: !this.state.isListViewOn });
  };


  renderLeftPanel = () => {
    try {
      const { attributes, parents, subcategorys } = this.props.categoryinfo;
      const { id } = this.props;

      const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;
      const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;

      let cats = <div className="block">Ангилал байхгүй байна</div>;
      cats = parents && parents.map((parent, index) => {
        if (parent.id === parseInt(id)) {
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
                      {subcategorys && subcategorys.map((sub, index) => {
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
          <div
            className={`left-panel-container ${leftPanel1}`}
            onClick={this.showLeftPanel}
          >
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
  };

  renderFilteredList = () => {
    try {
      const { categoryfilter, id } = this.props;
      const { parents } = this.props.categoryinfo;

      let result = null;
      if (this.state.isListViewOn) {
        result = (
          <CardList
            type={CARD_LIST_TYPES.list}
            items={categoryfilter}
            cardType={CARD_TYPES.list}
          />
        );
      } else {
        result = (
          <CardList
            type={CARD_LIST_TYPES.horizontal}
            items={categoryfilter}
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
                    <strong>"{parents === undefined ? null : parents.find(item => item.id === parseInt(id)).catnm}"</strong> {categoryfilter.length} бараа
                    олдлоо
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
                      onChange={this.handleordercolChange}
                      className="form-control"
                      id="inputState"
                    >
                      <Select.Option value="price_desc">
                        Үнэ буурахаар
                      </Select.Option>
                      <Select.Option value="price_asc">
                        Үнэ өсөхөөр
                      </Select.Option>
                    </Select>
                  </div>
                  <div className="form-group flex-this">
                    <div
                      className={this.state.isListViewOn ? "btn active" : "btn"}
                      onClick={this.handleViewChange}
                    >
                      <i className="fa fa-th-list" aria-hidden="true" />
                    </div>
                    <div
                      className={this.state.isListViewOn ? "btn" : "btn active"}
                      onClick={this.handleViewChange}
                    >
                      <i className="fa fa-th" aria-hidden="true" />
                    </div>
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
  };

  render() {
    const { parents, subcategorys } = this.props.categoryinfo;
    const { id } = this.props;

    let selectedCat = null;
    let cats = <div className="block">Ангилал байхгүй байна</div>;
    cats = parents && parents.map((parent, index) => {
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
                    {subcategorys && subcategorys.map((sub, index) => {
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
              {this.renderLeftPanel()}
              {this.renderFilteredList()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryInfo;
