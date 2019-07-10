/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Rate } from "antd";

class Comment extends Component {
  state = {
    comment: "",
    comments: this.props.comments,
  };


  renderCommentList = () => {
    try {
      const { isLoggedIn, user, product } = this.props;
      const { comments } = this.props;
      const { rate, rate_user_cnt } = product;
      return (
        <div
          className="comments-container"
          style={{ marginTop: "80px", width: "100%" }}
        >
          {isLoggedIn && user && (
            <div className="write-comment">
              <div className="author">
                <div className="image-container">
                  <span
                    className="image8"
                    style={{
                      backgroundImage: `url(${
                        user.picture
                          ? user.picture.data
                            ? user.picture.data.url
                            : user.picture
                          : // eslint-disable-next-line no-undef
                          p1
                        })`,
                    }}
                  />
                </div>
                <p className="name text-uppercase">
                  <strong>
                    {user.firstname
                      ? user.lastname
                        ? `${user.firstname} ${user.lastname}`
                        : user.firstname
                      : user.email
                        ? user.email
                        : ""}
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

          {!!comments.length && (
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
                    {/* {!!rates.length &&
                          rates.map((rate, index) => {
                            if (rate.custid === comment.custid) {
                              return (
                                <Rate
                                  key={index}
                                  allowHalf
                                  disabled
                                  defaultValue={rate.rate}
                                  style={{
                                    fontSize: "0.8rem",
                                    marginBottom: "5px"
                                  }}
                                />
                              );
                            }
                          })} */}
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
