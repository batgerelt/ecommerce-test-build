/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Spin, Select } from "antd";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";
import { PageBanner, CardList, FilterSet } from "../../components";
// import FilterSet from "../components/FilterSet";
import crossImage from "../../scss/assets/svg/error-black.svg";

class Season extends React.Component {
  constructor(props) {
    super(props);

    const attributes =
      props.seasonfilter.length === 0 ? [] : props.seasonfilter.attributes;
    const prices = this.getPrices(attributes);

    this.state = {
      loading: false,
      isListViewOn: false,
      minPrice: prices.min,
      maxPrice: prices.max,
      sort: "price_asc",
      checkedList: [],
      attributes: this.props.seasonfilter.attributes || [],
      products: this.props.seasonfilter.products || [],
      promoCats:
        this.props.seasonfilter.length === 0
          ? []
          : this.props.seasonfilter.promotions,
      promoCatClicked: false,
      selectedPromoCatId: null,
      searchProdItem: [],
      isLeftPanel: false,
    };
  }

  showLeftPanel = (e) => {
    this.setState({ isLeftPanel: !this.state.isLeftPanel });
  };

  getPrices = (attributes) => {
    let min = 0;
    let max = 0;

    attributes &&
      attributes.map((attr) => {
        if (attr.type === "PRICE") {
          attr.attributes[0].values.forEach((val) => {
            if (val.valuecd === "MIN") {
              min = parseInt(val.valueid.substring(3));
            }
            if (val.valuecd === "MAX") {
              max = parseInt(val.valueid.substring(3));
            }
          });
        }
        return null;
      });
    max = min > max ? min : max;

    return { min, max };
  };

  notify = message => toast(message, { autoClose: 5000 });

  fetchProductData = ({
    promoCatId,
    checkedList,
    minPrice,
    maxPrice,
    sort,
  }) => {
    this.setState({ loading: true });
    const data = {
      promotid: promoCatId,
      parameters: checkedList,
      minprice: minPrice,
      maxprice: maxPrice,
      ordercol: sort,
    };

    this.props
      .seasonFilter({
        body: data,
      })
      .then((res) => {
        this.setState({ loading: false });
      });
  };

  handlePriceAfterChange = (value) => {
    const { checkedList, sort, selectedPromoCatId } = this.state;

    const params = {
      promoCatId: selectedPromoCatId,
      checkedList,
      minPrice: value[0],
      maxPrice: value[1],
      sort,
    };

    this.fetchProductData(params);

    this.setState({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  handleAttributeChange = (e) => {
    const {
      minPrice, maxPrice, sort, selectedPromoCatId,
    } = this.state;

    let checkedList = this.state.checkedList;
    const i = checkedList.indexOf(e.target.value);

    if (e.target.checked) {
      checkedList.push(e.target.value);
    } else if (i !== -1) {
      checkedList.splice(i, 1);
    }

    this.setState({ checkedList });

    const params = {
      promoCatId: selectedPromoCatId,
      checkedList,
      minPrice,
      maxPrice,
      sort,
    };

    this.fetchProductData(params);
  };

  handleSortChange = (value) => {
    const {
      checkedList, minPrice, maxPrice, selectedPromoCatId,
    } = this.state;
    const params = {
      promoCatId: selectedPromoCatId,
      checkedList,
      minPrice,
      maxPrice,
      sort: value,
    };

    this.fetchProductData(params);

    this.setState({
      sort: value,
    });
  };

  handleViewChange = (e) => {
    e.preventDefault();
    this.setState({ isListViewOn: !this.state.isListViewOn });
  };

  handlePromoCatClick = cat => (e) => {
    e.preventDefault();

    const {
      checkedList,
      minPrice,
      maxPrice,
      sort,
      selectedPromoCatId,
    } = this.state;
    let promoCatClicked = this.state.promoCatClicked;
    let body = {
      promoCatId: cat.promotid,
      checkedList,
      minPrice,
      maxPrice,
      sort,
    };
    if (selectedPromoCatId === cat.promotid) {
      if (promoCatClicked) {
        body.promoCatId = null;
      }
    } else {
      promoCatClicked = false;
    }
    this.setState(
      { selectedPromoCatId: cat.promotid, promoCatClicked: !promoCatClicked },
      () => {
        this.fetchProductData(body, true);
      },
    );
  };

  handlePromoCatCancel = (e) => {
    e.preventDefault();

    const { checkedList, sort } = this.state;

    this.setState({ selectedPromoCatId: null }, () => {
      this.fetchProductData(
        {
          promoCatId: null,
          checkedList,
          minPrice: 0,
          maxPrice: 0,
          sort,
        },
        true,
      );
    });
  };

  renderPromoCats = () => {
    const { selectedPromoCatId, promoCatClicked } = this.state;
    // console.log(this.state.promoCats);
    let promoCats =
      this.props.seasonfilter.length === 0
        ? []
        : this.props.seasonfilter.promotions;
    if (promoCats.length) {
      return (
        <ul className="list-unstyled category-list">
          {promoCats.map((cat, index) => {
            let className = "";
            if (selectedPromoCatId) {
              if (selectedPromoCatId !== cat.promotid) {
                className = "disabled";
              } else if (promoCatClicked) {
                className = "selected";
              } else {
                className = "disabled";
              }
            }

            return (
              <li key={index} className={className}>
                <Link to="" onClick={this.handlePromoCatClick(cat)}>
                  {cat.promotnm}
                </Link>
              </li>
            );
          })}

          {/* selectedPromoCatId && (
            <Link to="" className="cancel" onClick={this.handlePromoCatCancel}>
              <span className="badge badge-pill badge-danger">Цуцлах</span>
            </Link>
          ) */}
        </ul>
      );
    }

    return <div className="block">Ангилал байхгүй байна</div>;
  };

  render() {
    const { menuSeason, seasonbanner } = this.props;
    const { attributes, products } = this.props.seasonfilter;
    const { isListViewOn, loading } = this.state;
    const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;
    const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;

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

    filters = (
      <div>
        <h5 className="title">
          <strong>Шүүлтүүр</strong>
        </h5>
        <div className="left-filter">{filters}</div>
      </div>
    );

    let result = null;
    if (isListViewOn) {
      result = (
        <CardList
          cardListType={CARD_LIST_TYPES.list}
          items={products || []}
          cardType={CARD_TYPES.list}
          {...this.props}
        />
      );
    } else {
      result = (
        <CardList
          cardType={CARD_TYPES.wide}
          items={products || []}
          showAll
          cardListType={CARD_LIST_TYPES.horizontal}
          {...this.props}
        />
      );
    }

    return (
      <div className="top-container">
        <PageBanner
          title={menuSeason.menunm}
          subtitle={menuSeason.subtitle}
          banners={seasonbanner}
          bgColor="#4286f4"
        />

        <div className="section season">
          <div className="container pad10">
            <div className="row row10">
              <div className="col-xl-3 pad10">
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
                    <div className="accordion" id="accordionExample">
                      <div
                        id="collapseOne"
                        className="collapse show"
                        aria-labelledby="headingOne"
                        data-parent="#accordionExample"
                      >
                        <div className="collapse-content">
                          <ul className="list-unstyled">
                            {this.renderPromoCats()}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {filters}
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9 col-md-8 pad10">
                <div className="list-filter">
                  <div className="row row10">
                    <div className="col-lg-6 pad10">
                      <div className="total-result">
                        <p className="text">
                          <strong>
                            {products === undefined ? 0 : products.length}
                          </strong>{" "}
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
                        <div
                          className="form-group my-select flex-this"
                          style={{ marginRight: "10px" }}
                        >
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
                            <Select.Option value="price_desc">
                              Үнэ буурахаар
                            </Select.Option>
                            <Select.Option value="price_asc">
                              Үнэ өсөхөөр
                            </Select.Option>
                          </Select>
                        </div>
                        <div className="form-group flex-this">
                          <Link
                            to=""
                            className={isListViewOn ? "btn active" : "btn"}
                            onClick={this.handleViewChange}
                          >
                            <i className="fa fa-th-list" aria-hidden="true" />
                          </Link>
                          <Link
                            to=""
                            className={isListViewOn ? "btn" : "btn active"}
                            onClick={this.handleViewChange}
                          >
                            <i className="fa fa-th" aria-hidden="true" />
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <Spin spinning={loading}>{result}</Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Season;
