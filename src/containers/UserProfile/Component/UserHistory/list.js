import React from "react";
import { Rate, message, Spin, BackTop, Icon } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Loader } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false };
  onDelete = (item) => {
    this.setState({ loader: true });
    this.props.deleteHistory({ skucd: item.cd }).then((res) => {
      this.props.getHistory().then((res) => {
        this.setState({ loader: false });
      });
    });
  }
  addHistory = (item) => {
    this.props.addWish({ skucd: item.cd }).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
      }
    });
  }
  handleIncrement = (item) => {
    if (item.cd) {
      this.props.incrementProductRemotely({
        skucd: item.cd,
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
                  <p className="name">{lang === "mn" ? item.skunm : item.skunm_en}</p>
                  <p className="text">{lang === "mn" ? item.shortnm : item.shortnm_en}</p>
                </Link>
                <Rate allowHalf value={item.rate / 2} disabled />
              </div>
            </div>
          </div>
          <div className="action">
            <ul className="list-unstyled flex-this end">
              <li>
                <div className="price-pro" style={{ paddingRight: "10px" }}>
                  <strong>{formatter.format(item.price)}₮</strong>
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
      ));
    } catch (error) {
      return console.log(error);
    }
  }
  render() {
    const loaders = this.state.loader;
    const icon = <Icon type="sync" spin />;
    return (
      <div className="col-md-8 pad10">
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
        <BackTop />
      </div>
    );
  }
}

export default Component;
