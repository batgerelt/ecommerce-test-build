/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable one-var */
/* eslint-disable no-unused-expressions */
import React from "react";
import { Link } from "react-router-dom";
import { Spin, Select } from "antd";
import { toast } from "react-toastify";
import { CARD_LIST_TYPES, CARD_TYPES } from "../../utils/Consts";
import { CardList, FilterSet } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    let min,
      max = 0;
    console.log(this.props);
    const attributes = props.searchattribute;
    attributes &&
      attributes.forEach((attr) => {
        if (attr.type === "PRICE") {
          max = parseInt(
            attr.attributes[0].values.find(val => val.valuecd === "MAX")
              .valuename,
          );
          min = parseInt(
            attr.attributes[0].values.find(val => val.valuecd === "MIN")
              .valuename,
          );
        }
      });

    this.state = {
      loading: false,
      isListViewOn: false,
      minPrice: min,
      maxPrice: max,
      sort: "price_asc",
      checkedList: [],
      products: this.props.productbrand,
      searchedProd: [],
      promotId: null,
      searchProdItem: [],
      searched: false,
      isLeftPanel: false,
    };
  }

  showLeftPanel = (e) => {
    this.setState({ isLeftPanel: !this.state.isLeftPanel });
    console.log(this.state.isLeftPanel);
  };

  notify = message => toast(message, { autoClose: 5000 });

  fetchProductData = ({
    promoId, checkedList, minPrice, maxPrice, sort,
  }) => {
    /* this.setState({ loading: true });
    const data = {
      promotid: this.state.promotId,
      parameters: checkedList,
      minprice: minPrice,
      maxprice: maxPrice,
      ordercol: sort
    };

    api.season.findAllFilteredInfo(data).then(res => {
      if (res.success) {
        this.setState({
          products: res.data[0].products
        });
      } else {
        this.notify(res.message);
      }
      this.setState({ loading: false });
    }); */
  };

  handlePriceAfterChange = (value) => {
    /* const { checkedList, sort } = this.state;
    const params = {
      catId: this.props.container.id,
      checkedList,
      minPrice: value[0],
      maxPrice: value[1],
      sort
    };
    this.fetchProductData(params);
    this.setState({
      minPrice: value[0],
      maxPrice: value[1]
    }); */
  };

  componentDidMount() {
    /* const { promoCats } = this.props.container;
    this.setState({ searchedProd: promoCats }); */
  }

  handleAttributeChange = (e) => {
    /* const { minPrice, maxPrice, sort } = this.state;

    let checkedList = this.state.checkedList;
    const i = checkedList.indexOf(e.target.value);

    if (e.target.checked) {
      checkedList.push(e.target.value);
    } else if (i !== -1) {
      checkedList.splice(i, 1);
    }

    this.setState({ checkedList });

    const params = {
      promoId: this.props.container.id,
      checkedList,
      minPrice,
      maxPrice,
      sort
    };

    this.fetchProductData(params); */
  };

  handleSortChange = (value) => {
    const { checkedList, minPrice, maxPrice } = this.state;
    const params = {
      catId: this.props.container.id,
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

  handleListViewClick = (e) => {
    e.preventDefault();
    this.setState({ isListViewOn: true });
  };

  handleGridViewClick = (e) => {
    e.preventDefault();
    this.setState({ isListViewOn: false });
  };

  handleSearch = (e, item) => {
    /* const { checkedList, minPrice, maxPrice } = this.state;
    let tmp = [];
    tmp.push(item);
    this.setState(
      { promotId: item.promotid, searchedProd: tmp, searched: true },
      () => {
        const params = {
          promoId: this.state.promotId,
          catId: this.props.container.id,
          checkedList,
          minPrice,
          maxPrice,
          sort: this.state.sort
        };
        this.fetchProductData(params);
      }
    ); */
  };

  renderDeparts = () => {
    /* const { searchedProd } = this.state;
    let tmp;
    if (searchedProd.length !== 0) {
      tmp = searchedProd.map((item, i) => {
        return (
          <li key={i} style={{ marginBottom: "8px" }}>
            <a onClick={e => this.handleSearch(e, item)}>{item.promotnm}</a>
          </li>
        );
      });
    }
    return tmp; */
  };

  handleReturn = () => {
    this.setState(
      {
        searchedProd: this.props.container.promoCats,
        searched: false,
        promotId: null,
      },
      () => {
        const { checkedList, minPrice, maxPrice } = this.state;
        const params = {
          promoId: this.state.promotId,
          catId: this.props.container.id,
          checkedList,
          minPrice,
          maxPrice,
          sort: this.state.sort,
        };
        this.fetchProductData(params);
      },
    );
  };

  render() {
    const {
      promoCats,
      menu,
      primaryBanners,
      attributes,
      parentCats,
    } = this.props.container;
    const products = this.state.products;
    const Option = Select.Option;
    const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;
    const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;
    // const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;

    let cats = <div className="block">Ангилал байхгүй байна</div>;

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
      <div className="top-container">
        <div className="section">
          <div className="container pad10">
            <div className="e-breadcrumb">
              <ul className="list-unstyled">
                {parentCats &&
                  parentCats.map(category => (
                    <li key={category.catnm}>
                      <a href={category.route ? category.route : ""}>
                        <span>{category.catnm}</span>
                      </a>
                    </li>
                    ))}
              </ul>
            </div>
            <div className="row row10">
              <div className="col-xl-3 col-lg-3 col-md-3 pad10">
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
                    <div className="accordion" id="accordionExample">
                      <div
                        id="collapseOne"
                        className="collapse show"
                        aria-labelledby="headingOne"
                        data-parent="#accordionExample"
                      >
                        <div className="collapse-content">
                          <ul className="list-unstyled">
                            {this.renderDeparts()}

                            {this.state.searched === true ? (
                              <a
                                style={{
                                color: "grey",
                                fontSize: "12px",
                                float: "right",
                              }}
                                onClick={this.handleReturn}
                              >
                              х шүүлтүүр цэвэрлэх
                              </a>
                          ) : (
                            ""
                          )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {filters}
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9 col-md-9 pad10">
                <div className="list-filter">
                  <div className="row row10">
                    <div className="col-lg-6 pad10">
                      <div className="total-result">
                        <p className="text">
                          <strong>{products.length}</strong> бараа олдлоо
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6 pad10">
                      <form className="flex-this end">
                        <div className="text-right d-block d-md-none">
                          <a className="btn btn-gray btn-filter" onClick={this.showLeftPanel}>
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
                            <Option value="price_desc">Үнэ буурахаар</Option>
                            <Option value="price_asc">Үнэ өсөхөөр</Option>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;
