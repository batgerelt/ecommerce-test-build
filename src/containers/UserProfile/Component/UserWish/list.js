import React from "react";
import { Divider, Rate, Spin } from "antd";
import { Link } from "react-router-dom";
import { Loader } from "../../../../components/Loader";

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
  renderProducts = () => {
    try {
      const { wish } = this.props;
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
                  <p className="name">{item.skunm}</p>
                  <p className="text">{item.shortnm}</p>
                </Link>
                {item.rate ? (<Rate rate={item.rate} numOfVotes={item.rateusercnt} />) : (<Rate rate={0} numOfVotes={0} />)}
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
                    className="fa fa-cart-plus"
                    aria-hidden="true"
                  /* onClick={() => this.handleSingleAddToCartClick(item)} */
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
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Хадгалсан бараа</span>
          </p>
          <Spin
            spinning={this.state.loader}
          >
            <div
              className="product-list-history frame frameMargin"
              style={{ maxHeight: "500px", overflow: "auto" }}
            >
              {this.renderProducts()}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

export default Component;
