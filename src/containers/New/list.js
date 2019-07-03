/* eslint-disable radix */
import React from "react";
import InfiniteScroll from 'react-infinite-scroller';

import { CardList, Banner, PageBanner, Loader } from "../../components";
import { CARD_TYPES, CARD_LIST_TYPES, CARD_NUMS_IN_ROW } from "../../utils/Consts";

let start = 20;
class Discount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: 20,
      isload: false,
      products: props.newproduct,
    };
  }

  componentDidMount() { this.setState({ isload: true }); }

  handleNext = () => {
    const { products } = this.state;
    this.setState({ isload: false });
    this.props.getNewProduct({ start }).then((res) => {
      this.setState(
        { products: products.concat(res.payload.data) },
        () => this.setState({ isload: true }),
      );
      start += 20;
    });
  }

  renderMainBanner = () => {
    try {
      const { newbanner, menuNew } = this.props;

      return (
        <PageBanner
          title={menuNew.menunm}
          subtitle={menuNew.subtitle}
          banners={newbanner.length === 0 ? [] : newbanner.footer}
          bgColor="#bbdefb"
        />
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderHeaderProduct = () => {
    try {
      const seq = "1,1";
      const cardTypes = seq.split(",");
      const { products } = this.state;

      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <CardList
              type={CARD_LIST_TYPES.horizontal}
              seq={seq}
              items={products.slice(0, cardsLength)}
            />
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  renderSubBanner = () => {
    try {
      const { newbanner } = this.props;
      return <Banner data={newbanner.length === 0 ? [] : newbanner.footer} />;
    } catch (error) {
      return console.log(error);
    }
  }

  renderFooterProduct = () => {
    try {
      const { products, isload } = this.state;
      const seq = "1,1";
      const cardTypes = seq.split(",");
      let cardsLength = 0;
      cardTypes.map(i => cardsLength += parseInt(i) === CARD_TYPES.slim ? CARD_NUMS_IN_ROW.slim : CARD_NUMS_IN_ROW.wide);

      return (
        <div className="section">
          <div className="container pad10">
            <InfiniteScroll
              threshold={100}
              pageStart={0}
              loadMore={this.handleNext}
              hasMore={isload}
              loader={<div style={{ display: 'flex', justifyContent: 'center' }} key={0}><Loader /></div>}
              getScrollParent={() => this.scrollParentRef}
            >
              <CardList
                type={CARD_LIST_TYPES.horizontal}
                items={products.slice(cardsLength)}
                showAll
                cardType={CARD_TYPES.slim}
              />
            </InfiniteScroll>
          </div>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    return (
      <div className="top-container" ref={ref => this.scrollParentRef = ref}>
        {this.renderMainBanner()}
        {this.renderHeaderProduct()}
        {this.renderSubBanner()}
        {this.renderFooterProduct()}
      </div>
    );
  }
}

export default Discount;
