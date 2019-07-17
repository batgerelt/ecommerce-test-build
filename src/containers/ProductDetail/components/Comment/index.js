/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Rate } from "antd";
import defaultAvatar from "../../../../scss/assets/images/demo/defaultAvatar.png";

class Comment extends Component {
  state = {
    comment: "",
    comments: [],
    user: null,
  };

  componentWillMount() {
    let auth = localStorage.getItem("auth");
    this.setState({ comments: this.props.comments });
    if (auth !== null) {
      auth = JSON.parse(auth);
      this.setState({ user: auth.data[0].info.customerInfo });
    }
  }

  handleCommitChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleCommentSend = (e) => {
    const { comment, user } = this.state;
    const { addComment, product } = this.props;
    if (user !== null) {
      let custId = user.id;
      let skucd = product.cd;
      addComment({ custId, skucd, comment }).then((res) => {
        console.log(res);
      });
    }
  }


  renderCommentList = () => {
    try {
      const { user, comments } = this.state;
      const { product } = this.props;
      const { rate, rate_user_cnt } = product;
      return (
        <div
          className="comments-container"
          style={{ marginTop: "80px", width: "100%" }}
        >
          {user && (
            <div className="write-comment">
              <div className="author">
                <div className="image-container">
                  <span
                    className="image8"
                    style={{ backgroundImage: `url(${defaultAvatar})` }}
                  />
                </div>
                <p className="name text-uppercase">
                  <strong>
                    {
                      user !== null ? `${user.firstname} ${user.lastname} ${user.email}`
                        : ""
                    }
                  </strong>
                </p>
              </div>

              <form>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    placeholder="Сэтгэгдэл үлдээх хэсэг"
                    name="comment"
                    style={{ minHeight: "150px" }}
                    value={this.state.comment}
                    onChange={this.handleCommitChange}
                  />
                  <small
                    id="emailHelp"
                    className="form-text text-muted text-right"
                  >
                    0 / 120
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-dark text-uppercase"
                  onClick={this.handleCommentSend}
                >
                  Сэтгэгдэл үлдээх
                </button>
              </form>
            </div>
          )}

          {comments.length !== 0 && (
            <div style={{ marginTop: "80px" }}>
              <h1 className="title">
                <span className="text-uppercase">Сэтгэгдэл</span>
              </h1>

              <div className="comments-list">
                <div className="main-rating">
                  <Rate allowHalf disabled value={rate / 2} />
                  <p className="text">
                    ({rate_user_cnt} хүн үнэлгээ өгсөн байна)
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

export default Comment;
