/* eslint-disable no-unreachable */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
import React from "react";
import { Spin, Select } from "antd";
import {
  CARD_LIST_TYPES,
  CARD_TYPES,
} from "../../utils/Consts";
import { CardList, FilterSet, Loader } from "../../components";
import crossImage from "../../scss/assets/svg/error-black.svg";
import styles from "./style.less";

class CategoryInfo extends React.Component {
  state = {
    loading: false,
    catid: 0,
    isListViewOn: false,
    minprice: 0,
    maxprice: 0,
    ordercol: "price_asc",
    parameters: [],
    isLeftPanel: false,
  };

  handleordercolChange = (value) => {
    const {
      parameters, minprice, maxprice, catid,
    } = this.state;

    const params = {
      catid,
      keywordid: this.props.match.params.id,
      parameters,
      minprice,
      maxprice,
      ordercol: value,
      rowcount: 20,
      startswith: 0,
    };
    this.fetchProductData(params);

    this.setState({ ordercol: value });
  };

  handleViewChange = () => {
    this.setState({ isListViewOn: !this.state.isListViewOn });
  };

  handlePriceAfterChange = (value) => {
    const { parameters, catid, ordercol } = this.state;

    const params = {
      catid,
      keywordid: this.props.match.params.id,
      parameters,
      minprice: value[0],
      maxprice: value[1],
      ordercol,
      rowcount: 20,
      startswith: 0,
    };

    this.fetchProductData(params);
    this.setState({
      minprice: value[0],
      maxprice: value[1],
    });
  };

  handleAttributeChange = (e) => {
    const {
      catid, ordercol, minprice, maxprice,
    } = this.state;

    let parameters = this.state.parameters;
    const i = parameters.indexOf(e.target.value);

    if (e.target.checked) {
      parameters.push(e.target.value);
    } else if (i !== -1) {
      parameters.splice(i, 1);
    }

    const params = {
      catid,
      keywordid: this.props.match.params.id,
      parameters,
      minprice,
      maxprice,
      ordercol,
      rowcount: 20,
      startswith: 0,
    };

    this.fetchProductData(params);
    this.setState({ parameters });
  };

  fetchProductData = (params) => {
    this.setState({ loading: true });
    this.props.searchKeyWordFilter({
      body: { ...params },
    }).then((res) => {
      this.setState({ loading: false });
    });
  }

  renderLeftPanel = () => {
    try {
      const { key } = this.props.match.params;
      const { attributes } = parseInt(key) === 1 ? this.props.searchkeyword : [];

      const leftPanel1 = `${this.state.isLeftPanel ? " show" : ""}`;
      const leftPanel = `left-panel${this.state.isLeftPanel ? " show" : ""}`;

      let filters = attributes.map((attr, index) => (
        <FilterSet
          key={index}
          onAttributeChange={this.handleAttributeChange}
          onPriceAfterChange={this.handlePriceAfterChange}
          minPrice={this.state.minprice}
          maxPrice={this.state.maxprice}
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
              {filters}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  renderFilteredList = () => {
    try {
      const { searchkeywordfilter } = this.props;

      let result = null;
      if (this.state.isListViewOn) {
        result = (
          <CardList
            type={CARD_LIST_TYPES.list}
            items={searchkeywordfilter === undefined ? [] : searchkeywordfilter}
            cardType={CARD_TYPES.list}
          />
        );
      } else {
        result = (
          <CardList
            type={CARD_LIST_TYPES.horizontal}
            items={searchkeywordfilter === undefined ? [] : searchkeywordfilter}
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
                    {/* <strong>"{selectedCat}"</strong> */}
                    {searchkeywordfilter.length}{" "}
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
                      onChange={this.handleordercolChange}
                      className="form-control"
                      id="inputState"
                    >
                      <Select.Option value="price_desc">Үнэ буурахаар</Select.Option>
                      <Select.Option value="price_asc">Үнэ өсөхөөр</Select.Option>
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

          <div className={styles.center}>
            <Spin spinning={this.state.loading} indicator={<Loader />} >{result}</Spin>
          </div>
        </div>
      );
    } catch (error) {
      // return console.log(error);
      return null;
    }
  }

  render() {
    return (
      <div className="top-container">
        <div className="section">
          <div className="container pad10">
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
