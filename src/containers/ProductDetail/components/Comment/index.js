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
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.setState({ comment: "" });
    }
  }

  componentWillMount() {
    if (this.props.match.params.orderid !== undefined) {
      let id = this.props.match.params.orderid.toString().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
      let bytes = CryptoJS.AES.decrypt(id, EncryptKey);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      console.log("comment component wiil mount", this.props.isfeedbacks);
      this.props.isFeedBack({ orderid: parseFloat(plaintext), skucd: this.props.match.params.id }).then((res) => {
        console.log(res);
      });
    }
  }

  handleCommitChange = (e) => {
    if (e.target.value.length <= 120) {
      this.setState({ comment: e.target.value });
    }
  };

  onCancel = () => {
    this.setState({ giftvisible: false });
  }

  handleRateChange = (e) => {
    this.setState({ thisRate: e * 2 }, () => console.log("rate", this.state.thisRate));
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
    console.log("params", params);
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
          this.props.getProductComment({ skucd: product.skucd });
          this.props.isFeedBack({ orderid: parseFloat(plaintext), skucd: this.props.match.params.id }).then((res) => {
            console.log(res);
          });
        }
      });
    }
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
          {localStorage.getItem("auth") && this.props.isfeedbacks.status === 1 ? (
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
                    {this.state.comment.length} / 120
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
                    className="new-comment-box"
                    style={{
                      padding: "10px", marginBottom: "10px",
                    }}
                  >
                    <Row>
                      <Col span={1} style={{ marginRight: "10px" }}>
                        <Avatar size="large" src={`${process.env.IMAGES}${comment.imgnm}`} />
                      </Col>
                      <Col span={22}>
                        <strong><p>{comment.fname}</p></strong>
                        <p>{moment(comment.idate).format("YYYY.MM.DD HH:mm")}</p>
                        <p>
                          <Rate
                            disabled
                            defaultValue={comment.rate / 2}
                          />
                          {comment.commnt}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  /* <Card index={index} style={{ marginBottom: "10px !important" }}>
                    <CardHeader
                      avatar={
                        <Avatar size="large" icon="user" />
                        // <img src="https://cdn.mos.cms.futurecdn.net/M72XmJtbLMzEYF5JZnx6ti-320-80.jpg" alt="avatar" stlye={{ width: "100%" }} />
                      }
                      title={comment.fname}
                      subheader={
                        <div>
                          <Rate
                            allowHalf
                            value={10}
                          />
                          <p>{moment(comment.idate).format("YYYY.MM.DD HH:mm")}</p>
                        </div>
                      }
                    />
                    <CardMedia
                      image="/static/images/cards/paella.jpg"
                      title="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {comment.commnt}
                      </Typography>
                    </CardContent>
                  </Card> */
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
