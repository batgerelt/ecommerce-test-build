import React from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Divider, Rate, Spin, BackTop, Row, Col, Avatar } from "antd";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import Button from "@material-ui/core/Button";
import { Loader, Notification } from "../../../../components";

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
  renderProducts = () => {
    try {
      const { wish, lang } = this.props;
      return wish.map((item, index) => (
        <Row className="single flex-this flex-space" span={24} style={{ width: "100%", border: "1px solid white" }} key={index}>
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
              <li className="search-hover">
                <Button
                  className="action btn btn-link"
                  onClick={this.handleIncrement(item)}
                >
                  <i className="fa fa-cart-plus" aria-hidden="true" />
                </Button>
              </li>
              <li className="search-hover">
                <Button
                  className="action btn btn-link"
                  onClick={this.onDelete(item)}
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
      ));
    } catch (error) {
      return console.log(error);
    }
  }

  renderNULL() {
    return (
      <div>
        <Row className="single flex-this flex-space" span={24} style={{ width: "100%" }}>
          <Col className="product" span={24} >
            Таны Хадгалсан бараа жагсаалт хоосон байна.
          </Col>
        </Row>
      </div>
    );
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
            {this.props.wish.length !== 0 ? this.renderProducts() : this.renderNULL()}
          </div>
        </Spin>
      </div>
    );
  }
}

export default injectIntl(Component);
