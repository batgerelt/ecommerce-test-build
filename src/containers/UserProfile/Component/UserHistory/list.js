/* eslint-disable arrow-body-style */
import React from "react";
import { Rate, Spin, Icon, Col, Row, Divider } from "antd";
import { Link } from "react-router-dom";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { store } from 'react-notifications-component';
import Button from "@material-ui/core/Button";
import Products from "./products";
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
    this.props.deleteHistory({ skucd: item.skucd }).then(() => {
      this.props.getHistory().then(() => {
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
          <Products
            key={index}
            isSaved={isSaved}
            item={item}
            addHistory={this.addHistory}
            handleIncrement={this.handleIncrement}
            onDelete={this.onDelete}
            incrementProductRemotely={this.props.incrementProductRemotely}
          />
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
