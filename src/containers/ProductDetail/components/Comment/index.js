/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from "prop-types";
import moment from "moment";
import { Rate, Input, Modal, Avatar, Row, Col } from "antd";
import { store } from 'react-notifications-component';
import CryptoJS from "crypto-js";
import { EncryptKey } from "../../../../utils/Consts";
import { Notification } from "../../../../components";
import defaultAvatar from "../../../../scss/assets/images/demo/defaultAvatar.png";

const { TextArea } = Input;
class Comment extends Component {
  state = {
    comment: "",
    comments: [],
    giftvisible: false,
    imgnm: null,
    thisRate: 0,
    isShow: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.setState({ comment: "" });
    }
    if (this.props.match.params.orderid === undefined) {
      this.setState({ isShow: false });
    }
  }

  componentWillMount() {
    if (this.props.match.params.orderid !== undefined) {
      let id = this.props.match.params.orderid.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
      let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      console.log(plaintext);
      this.props.isFeedBack({ orderid: parseFloat(plaintext), skucd: this.props.match.params.id }).then((res) => {
        if (res.payload.data.status === 1) {
          this.setState({ isShow: true });
        } else {
          this.setState({ isShow: false });
        }
      });
    }
  }

  componentDidMount() {
    if (this.props.match.params.orderid !== undefined) {
      let id = this.props.match.params.orderid.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
      let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      this.props.isFeedBack({ orderid: parseFloat(plaintext), skucd: this.props.match.params.id }).then((res) => {
        if (res.payload.data.status === 1) {
          this.setState({ isShow: true });
        }
      });
    } else {
      this.setState({ isShow: false });
    }
  }

  handleCommitChange = (e) => {
    if (e.target.value.length <= 240) {
      this.setState({ comment: e.target.value });
    }
  };

  onCancel = () => {
    this.setState({ giftvisible: false });
  }

  handleRateChange = (e) => {
    this.setState({ thisRate: e * 2 }, () => console.log(this.state.thisRate));
  };

  handleCommentSend = (e) => {
    const { intl, product } = this.props;
    let id = this.props.match.params.orderid.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
    let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);
    const params = {
      comment: this.state.comment,
      skucd: product.skucd,
      orderid: parseFloat(plaintext),
      rate: this.state.thisRate,
    };
    if (params.rate === 0) {
      store.addNotification({
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
        content: <Notification type="warning" text="Үнэлгээ хоосон байна." />,
      });
    } else {
      this.props.addRate({ body: params }).then((res) => {
        console.log("res", res.payload);
        if (!res.payload.success) {
          store.addNotification({
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: false,
            },
            content: <Notification type="warning" text={intl.formatMessage({ id: res.payload.code })} />,
          });
        } else {
          this.setState({ isShow: true });
          this.props.getProductComment({ skucd: product.skucd });
          this.props.isFeedBack({ orderid: parseFloat(plaintext), skucd: this.props.match.params.id });
        }
      });
    }
  }

  renderComment = (comment) => {
    return (
      <Col span={24}>
        <Row>
          <Col xs={3} sm={3} md={2} lg={1} xl={1} style={{ marginRight: "10px" }}>
            <div className="image-container">
              <Avatar size="large" src={`${process.env.IMAGES}${comment.imgnm}`} />
            </div>
          </Col>
          <Col xs={20} sm={20} md={20} lg={21} xl={21}>
            <strong><p>{comment.fname}</p></strong>
            <p>{moment(comment.idate).format("YYYY.MM.DD HH:mm")}</p>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Col xs={23} sm={23} md={12} lg={3} xl={3}>
              <div className="main-rating">
                <Rate
                  disabled
                  defaultValue={comment.rate / 2}
                />
              </div>
            </Col>
            <Col xs={23} sm={23} md={11} lg={20} xl={20}>
              <p>{comment.commnt}</p>
            </Col>
          </Col>
        </Row>
      </Col>
    );
  }

  renderCommentList = () => {
    try {
      const {
        product, comments, user, auth, intl, isLoggedIn, rate,
      } = this.props;
      let realImage = "";
      let img = process.env.IMAGE + this.state.imgnm;
      if (localStorage.getItem('img')) {
        let realImage1 = localStorage.getItem('img');
        if (realImage1.slice(0, 5) === "https") {
          realImage = localStorage.getItem('img');
        } else {
          realImage = JSON.stringify(process.env.IMAGES + localStorage.getItem('img'));
        }
      }
      return (
        <div className="comments-container">
          {localStorage.getItem("auth") && this.state.isShow ? (
            <div className="write-comment">
              <div className="author">
                <div className="image-container">
                  <span
                    className="image8"
                    style={{ backgroundImage: `url(${auth ? realImage : defaultAvatar})` }}
                  />
                </div>
                <p className="name">
                  <strong>
                    {
                      auth !== 0 ? `${user.info.firstname}`
                        : ""
                    }
                  </strong>
                </p>
              </div>

              <form>
                <div className="form-group">
                  <div className="main-rating">
                    <Rate
                      allowHalf
                      value={this.state.thisRate / 2}
                      onChange={this.handleRateChange}
                    />
                    <p className="text upper-first">
                      ({intl.formatMessage({ id: "productDetail.rate.text" })})
                    </p>
                  </div>
                  <TextArea
                    placeholder={intl.formatMessage({ id: "productDetail.comment.form.placeholder" })}
                    name="comment"
                    style={{ minHeight: "150px" }}
                    value={this.state.comment}
                    onChange={this.handleCommitChange}
                  />
                  <small
                    id="emailHelp"
                    className="form-text text-muted text-right"
                  >
                    {this.state.comment.length} / 240
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-dark text-uppercase"
                  onClick={this.handleCommentSend}
                >
                  <FormattedMessage id="productDetail.comment.form.button" />
                </button>
              </form>
            </div>
          ) : null}

          {comments.length !== 0 && (
            <div className="product-comment" >
              <h1 className="title">
                <span className="text-uppercase">
                  <FormattedMessage id="productDetail.comment.list.title" />
                </span>
              </h1>
              <div className="comments-list">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="new-comment-box"
                    style={{ padding: "10px" }}
                  >
                    {this.renderComment(comment)}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Modal
            title=""
            visible={this.state.giftvisible}
            onCancel={this.onCancel}
            closeOnEsc
            footer={null}
            className="no-padding"
          >
            <img alt="haha" src={img} style={{ width: "100%" }} />
          </Modal>
        </div>
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    return this.renderCommentList();
  }
}

Comment.propTypes = {
  product: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
};

export default injectIntl(Comment);
