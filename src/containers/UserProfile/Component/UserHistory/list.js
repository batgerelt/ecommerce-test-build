import React from "react";
import { Divider, Rate, message, Spin } from "antd";
import { Link } from "react-router-dom";

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
      const { history } = this.props;
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
                  <p className="name">{item.skunm}</p>
                  <p className="text">{item.shortnm}</p>
                </Link>
                <Rate value={item.rate / 2} disabled />
              </div>
            </div>
          </div>
          <div className="price">
            <strong>{formatter.format(item.price)}₮</strong>
          </div>
          <div className="action">
            <ul className="list-unstyled flex-this end">
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
    const { loader } = this.state;
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Үзсэн барааны түүх</span>
          </p>
          <Spin
            spinning={loader}
          >
            <div className="product-list-history">
              {this.renderProducts()}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

export default Component;
