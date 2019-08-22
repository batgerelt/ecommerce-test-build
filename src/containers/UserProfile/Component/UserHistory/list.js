import React from "react";
import { Rate, message, Spin, BackTop, Icon, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Loader } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false };
  onDelete = (item) => {
    this.setState({ loader: true });
    this.props.deleteHistory({ skucd: item.skucd }).then((res) => {
      this.props.getHistory().then((res) => {
        this.setState({ loader: false });
      });
    });
  }
  addHistory = (item) => {
    this.props.addWish({ skucd: item.skucd }).then((res) => {
      if (res.payload.success) {
        message.warning(res.payload.message);
      }
    });
  }
  handleIncrement = (item) => {
    if (item.skucd) {
      this.props.incrementProductRemotely({
        skucd: item.skucd,
        qty: item.addminqty || 1,
        iscart: 0,
      });
    }
  }
  handleRateChange = (e, item) => {
    this.props.addRate({
      skucd: item.skucd,
      rate: Number(e) * 2,
    });
  };
  renderProducts = () => {
    try {
      const { history, lang } = this.props;
      return history.map((item, index) => (
        <Row className="single flex-space" span={24} style={{ width: "100%" }} key={index}>
          <Col className="product" sm={12} md={12} lg={12} xl={12}>
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
          <Col className="action" xs={16} sm={6} md={6} lg={6} xl={6}>
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
          <Col className="action" xs={8} sm={6} md={6} lg={6} xl={6}>
            <ul className="list-unstyled flex-this end" >
              <li>
                <Link to="#">
                  <i
                    className="fa fa-heart-o"
                    aria-hidden="true"
                    onClick={() => this.addHistory(item)}
                  />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i
                    className="fa fa-cart-plus"
                    aria-hidden="true"
                    onClick={() => this.handleIncrement(item)}
                  />
                </Link>
              </li>
              <li>
                <Link to="#" onClick={e => this.onDelete(item)}>
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
    const loaders = this.state.loader;
    const icon = <Icon type="sync" spin />;
    return (
      <div className="user-menu-content">
        <p className="title">
          <span><FormattedMessage id="profile.seenHistory.title" /></span>
        </p>
        <Spin
          spinning={loaders}
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

/* return history.map((item, index) => (
        <div className="single flex-space" key={index}>
          <div className="product">
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
          </div>
          <div className="action">
            <ul className="list-unstyled flex-this end">
              <li>
                <div className="price-pro" style={{ paddingRight: "10px" }}>
                  {
                    item.pricetag !== null ?
                      localStorage.getItem('lang') === "mn" ?
                        <div>{`${item.pricetag} ${formatter.format(item.currentprice)}₮`}</div>
                        :
                        <div>{`${item.pricetag_en} ${formatter.format(item.currentprice)}₮`}</div>
                      : <div>{`${formatter.format(item.currentprice)}`}₮</div>
                  }
                </div>
              </li>
              <li>
                <Link to="#">
                  <i
                    className="fa fa-heart"
                    aria-hidden="true"
                    onClick={() => this.addHistory(item)}
                  />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i
                    className="fa fa-cart-plus"
                    aria-hidden="true"
                    onClick={() => this.handleIncrement(item)}
                  />
                </Link>
              </li>
              <li>
                <Link to="#" onClick={e => this.onDelete(item)}>
                  <i className="fa fa-times" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )); */
