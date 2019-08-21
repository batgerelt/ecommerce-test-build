/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from "prop-types";
import moment from "moment";
import { Rate } from "antd";
import defaultAvatar from "../../../../scss/assets/images/demo/defaultAvatar.png";

class Comment extends Component {
  state = {
    comment: "",
    comments: [],
  };

  handleCommitChange = (e) => {
    if (e.target.value.length <= 120) {
      this.setState({ comment: e.target.value });
    }
  };

  handleCommentSend = (e) => {
    const { comment } = this.state;
    const {
      addComment, product, auth,
    } = this.props;
    if (auth) {
      let { skucd } = product;
      addComment({ skucd, comm: comment }).then((res) => {
        if (res.payload.success) {
          this.setState({ comment: "" });
          this.props.getProductComment({ skucd: product.skucd });
        }
      });
    }
  }


  renderCommentList = () => {
    try {
      const {
        product, comments, user, auth, intl,
      } = this.props;
      const { rate, rate_user_cnt } = product;
      const realImage = JSON.stringify(process.env.IMAGES + localStorage.getItem('img'));
      return (
        <div
          className="comments-container"
          style={{ marginTop: "30px", width: "100%" }}
        >
          {auth && (
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
                      auth !== 0 ? `${user[0].info.customerInfo.firstname}`
                        : ""
                    }
                  </strong>
                </p>
              </div>

              <form>
                <div className="form-group">
                  <textarea
                    className="form-control textarea"
                    // placeholder="Сэтгэгдэл үлдээх хэсэг"
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
          )}
          {comments.length !== 0 && (
            <div style={{ marginTop: "40px" }}>
              <h1 className="title">
                <span className="text-uppercase"><FormattedMessage id="productDetail.comment.list.title" /></span>
              </h1>

              <div className="comments-list">
                <div className="main-rating">
                  <Rate allowHalf disabled value={rate === null ? 0 : rate / 2} />
                  <p className="text">
                    ({rate_user_cnt === null ? 0 : rate_user_cnt} <FormattedMessage id="productDetail.comment.list.rate" />)
                  </p>
                </div>

                {comments.map((comment, index) => (
                  <div className="single" key={index}>
                    <p className="text">{comment.commnt}</p>
                    <ul className="list-unstyled bottom-info">
                      {comment.idate && (
                        <li>
                          <span>
                            {moment(comment.idate).format(
                              "YYYY.MM.DD HH:mm:ss",
                            )}
                          </span>
                        </li>
                      )}
                      <li>
                        <strong>{comment.uname}</strong>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
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
