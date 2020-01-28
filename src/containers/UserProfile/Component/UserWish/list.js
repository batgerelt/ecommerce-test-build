import React from "react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Divider, Rate, Spin, BackTop, Row, Col, Avatar } from "antd";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import Button from "@material-ui/core/Button";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import { Loader, Notification } from "../../../../components";
import Products from "./products";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false };
  onDelete = item => async (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    this.props.deleteWish({ skucd: item.skucd }).then(() => {
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
      const { wish } = this.props;
      return wish.map((item, index) => (
        <Products key={index} item={item} incrementProductRemotely={this.props.incrementProductRemotely} onDelete={this.onDelete} />
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
