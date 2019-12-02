/* eslint-disable arrow-body-style */
import React from "react";
import { Rate, Spin, Icon, Col, Row, Divider } from "antd";
import { Link } from "react-router-dom";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { store } from 'react-notifications-component';
import { Loader, Notification } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false, wish: [] };
  async componentDidMount() {
    const result = await this.props.getWish();
    if (result.payload.success) {
      this.setState({ wish: result.payload.data });
    }
  }

  onDelete = item => async (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    this.props.deleteHistory({ skucd: item.skucd }).then((res) => {
      this.props.getHistory().then((res) => {
        this.setState({ loader: false });
      });
    });
  }
  addHistory = item => async (e) => {
    e.preventDefault();
    const result = await this.props.addWishList({ skucd: item.skucd });
    if (result.payload.success) {
      this.removeAddedWishColorTime();
    }
  }
  removeAddedWishColorTime() {
    const { removeAddedWishColor } = this.props;
    setTimeout(() => {
      removeAddedWishColor();
    }, 500);
  }
  handleIncrement = item => async (e) => {
    e.preventDefault();
    const { intl } = this.props;
    if (item.skucd) {
      this.props.incrementProductRemotely({
        skucd: item.skucd,
        qty: item.addminqty || 1,
        iscart: 0,
      }).then((res) => {
        if (!res.payload.success) {
          const messages = defineMessages({
            warning: {
              id: res.payload.code,
            },
          });
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification
              type="warning"
              text={intl.formatMessage(messages.warning, {
                name: res.payload.data.values[1],
                qty: res.payload.data.values[2],
              })}
            />,
          });
        }
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
      return history.map((item, index) => {
        const isSaved = this.state.wish.find(w => w.skucd === item.skucd);
        return (
          <Row className="single flex-this flex-space" key={index} style={{ border: "1px solid white" }}>
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
              <ul className="list-unstyled">
                {
                  item.pricetag !== null
                    ? localStorage.getItem('lang') === "mn"
                      ? (
                        <li style={{ textAlign: "left", width: "100%" }}>
                          <span className="price-pro">
                            <span>{`${item.pricetag}`}</span>
                          </span>
                        </li>
                      )
                      : (
                        <li style={{ textAlign: "left", width: "100%" }}>
                          <span className="price-pro">
                            <span>{`${item.pricetag_en}`}</span>
                          </span>
                        </li>
                      )
                    : null
                }
                <li>
                  <span className="price-pro">
                    {
                      item.pricetag !== null
                        ? localStorage.getItem('lang') === "mn"
                          ? <span>{`${formatter.format(item.currentprice)}₮`}</span>
                          : <span>{`${formatter.format(item.currentprice)}₮`}</span>
                        : <span>{`${formatter.format(item.currentprice)}₮`}</span>
                    }
                  </span>
                </li>
              </ul>
            </Col>
            <Col className="action icons">
              <ul className="list-unstyled flex-this">
                <li>
                  <button
                    className="action btn btn-link"
                    onClick={this.addHistory(item)}
                  >
                    <i
                      className={`fa fa-heart${isSaved ? '' : '-o'}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
                <li>
                  <button
                    className="action btn btn-link"
                    onClick={this.handleIncrement(item)}
                  >
                    <i
                      className="fa fa-cart-plus"
                      aria-hidden="true"
                    />
                  </button>
                </li>
                <li>
                  <button
                    className="action btn btn-link"
                    onClick={this.onDelete(item)}
                  >
                    <i
                      className="fa fa-times"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              </ul>
            </Col>
          </Row>
        );
      });
    } catch (error) {
      return console.log(error);
    }
  }
  renderNULL() {
    return (
      <div>
        <Row className="single flex-this flex-space" span={24} style={{ width: "100%" }}>
          <Col className="product" span={24} >
            <p>Таны Үзсэн барааны түүх жагсаалт хоосон байна.</p>
          </Col>
        </Row>
      </div>
    );
  }
  render() {
    const loaders = this.state.loader;
    const icon = <Icon type="sync" spin />;
    return (
      <div className="user-menu-content">
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span><FormattedMessage id="profile.seenHistory.title" /></span>
        </p>
        <Divider />
        <Spin
          spinning={loaders}
          indicator={<Loader />}
        >
          <div className="product-list-history" style={{ minHeight: "30em" }}>
            {this.props.history.length !== 0 ? this.renderProducts() : this.renderNULL()}
          </div>
        </Spin>
      </div>
    );
  }
}

export default injectIntl(Component);
