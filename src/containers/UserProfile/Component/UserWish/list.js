import React from "react";
import { FormattedMessage } from 'react-intl';
import { Divider, Rate, Spin, BackTop, Row, Col, Avatar } from "antd";
import { Link } from "react-router-dom";
import { Loader } from "../../../../components";
import clear from "../../../../scss/assets/svg/clear.svg";
import favorite from "../../../../scss/assets/svg/favorite.svg";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false };
  onDelete = item => async (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    this.props.deleteWish({ skucd: item.skucd }).then((res) => {
      this.props.getWish().then((res) => {
        if (res.payload.success) {
          this.setState({ loader: false });
        }
      });
    });
  }
  handleIncrement = item => async (e) => {
    e.preventDefault();
    if (item.skucd) {
      this.props.incrementProductRemotely({
        skucd: item.skucd,
        qty: item.addminqty || 1,
        iscart: 0,
      }).then((res) => {
        console.log(res.payload);
      });
    }
  }
  renderProducts = () => {
    try {
      const { wish, lang } = this.props;
      return wish.map((item, index) => (
        <Row className="single flex-this flex-space" span={24} style={{ width: "100%" }} key={index}>
          <Col className="product">
            <div className="flex-this">
              <div className="image-container default">
                <Link to={item.route ? item.route : " "}>
                  <span
                    className="image"
                    style={{
                      backgroundImage: `url(${process.env.IMAGE + item.img})`,
                    }}
                  />
                </Link>
              </div>
              <div className="info">
                <Link to={item.route ? item.route : " "}>
                  <p className="name">{lang === "mn" ? item.title : item.title_en}</p>
                  <p className="text">{lang === "mn" ? item.feature : item.feature_en}</p>
                </Link>
                <Rate allowHalf value={item.rate / 2} disabled />
              </div>
            </div>
          </Col>
          <Col className="action price">
            <ul className="list-unstyled flex-this">
              <li style={{ textAlign: "left", width: "100%" }}>
                <div className="price-pro">
                  {
                    item.pricetag !== null ?
                      localStorage.getItem('lang') === "mn" ?
                        <div>{`${item.pricetag}`}</div>
                        :
                        <div>{`${item.pricetag_en}`}</div>
                      : null
                  }
                </div>
              </li>
              <li style={{ textAlign: "right !important" }}>
                <div className="price-pro">
                  {
                    item.pricetag !== null ?
                      localStorage.getItem('lang') === "mn" ?
                        <div>{`${formatter.format(item.currentprice)}₮`}</div>
                        :
                        <div>{`${formatter.format(item.currentprice)}₮`}</div>
                      : <div>{`${formatter.format(item.currentprice)}`}₮</div>
                  }
                </div>
              </li>
            </ul>
          </Col>
          <Col className="action icons">
            <ul className="list-unstyled flex-this">
              <li>
                <Link
                  to="#"
                  onClick={this.handleIncrement(item)}
                >
                  <i className="fa fa-cart-plus" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={this.onDelete(item)}
                  style={{
                    fontWeight: "10",
                  }}
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      ));
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    return (
      <div className="user-menu-content">
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span><FormattedMessage id="profile.wishlist.title" /></span>
        </p>
        <Divider />
        <Spin
          spinning={this.state.loader}
          indicator={<Loader />}
        >
          <div className="product-list-history" style={{ minHeight: "30em" }}>
            {this.renderProducts()}
          </div>
        </Spin>
      </div>
    );
  }
}

export default Component;
