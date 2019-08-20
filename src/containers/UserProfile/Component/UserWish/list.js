import React from "react";
import { FormattedMessage } from 'react-intl';
import { Divider, Rate, Spin, BackTop } from "antd";
import { Link } from "react-router-dom";
import { Loader } from "../../../../components";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { loader: false };
  onDelete = (item) => {
    this.setState({ loader: true });
    this.props.deleteWish({ skucd: item.cd }).then((res) => {
      this.props.getWish().then((res) => {
        if (res.payload.success) {
          this.setState({ loader: false });
        }
      });
    });
  }
  handleIncrement = (item) => {
    if (item.cd) {
      this.props.incrementProductRemotely({
        skucd: item.cd,
        qty: item.saleminqty || 1,
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
          <div className="action" style={{ width: "90%" }}>
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
                  {/* <strong>{formatter.format(item.price)}₮</strong> */}
                </div>
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
    return (
      <div className="user-menu-content">
        <p className="title">
          <span><FormattedMessage id="profile.wishlist.title" /></span>
        </p>
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

/* <div style={{ width: "20%" }}>
            <div className="price-pro" style={{ paddingRight: "10px" }}>
              {
                item.pricetag !== null ?
                  localStorage.getItem('lang') === "mn" ?
                    <div>{`${item.pricetag} ${formatter.format(item.currentprice)}₮`}</div>
                    :
                    <div>{`${item.pricetag_en} ${formatter.format(item.currentprice)}₮`}</div>
                  : <div>{`${formatter.format(item.currentprice)}`}₮</div>
              }
            </div >
          </div >
  <div className="action" style={{ width: "30%" }}>
    <ul className="list-unstyled flex-this end">
      <li>
        <Link to="#" className="flex-this" onClick={() => this.handleIncrement(item)}>
          <i className="fa fa-cart-plus" aria-hidden="true" style={{ width: "35px" }} />
        </Link>
      </li>
      <li className="d-none d-xl-block">
        <Link to="#" className="flex-this" onClick={() => this.handleIncrement(item)}>
          <Avatar className="ariuk" size="small" shape="square" src={profile1} style={{ width: "35px" }} />
        </Link>
      </li>
      <li className="d-xl-none">
        <Link to="#" onClick={e => this.onDelete(item)}>
          <i className="fa fa-times" aria-hidden="true" style={{ width: "35px" }} />
        </Link>
      </li>
    </ul>
  </div> */
