import React from "react";
import { Form, message, Input, Select, Icon, Spin } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }
  renderProfile = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { address } = this.props;
      return (
        <Form>
          <div className="row row10">
            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Нэрээ заавал оруулна уу",
                      },
                    ],
                  })(<Input placeholder="Нэр" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("phone1", {
                    rules: [
                      {
                        required: true,
                        message: "Утсаа заавал оруулна уу! ",
                      },
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        message: "Утсаа зөв оруулна уу! ",
                      },
                      {
                        len: 8,
                        message: "Утасны дугаар 8 оронтой байх ёстой! ",
                      },
                    ],
                  })(<Input placeholder="Утас 1" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("phone2", {
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        message: "Утас зөв оруулна уу! ",
                      },
                      {
                        len: 8,
                        message: "Утасны дугаар 8 оронтой байх ёстой! ",
                      },
                    ],
                  })(<Input placeholder="Утас 2" />)}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("mainLocation", {
                    rules: [
                      {
                        required: true,
                        message: "Хот/аймаг сонгоно уу!",
                      },
                    ],
                  })(
                    <Select
                      placeholder="Хот/аймаг *"
                      showSearch
                      optionFilterProp="children"
                      className="col-md-12"
                      onChange={e =>
                        this.onChangeMainLoc(e, this.props.form)
                      }
                    >
                      {/* {this.renderMainLocation()} */}
                    </Select>,
                  )}
                </Form.Item>
              </div>{" "}
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("subLocation", {
                    rules: [
                      {
                        required: true,
                        message: "Дүүрэг/Сум сонгоно уу!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Дүүрэг/Сум *"
                      onChange={e =>
                        this.onChangeSubLoc(
                          e,
                          this.props.form.validateFields,
                          undefined,
                        )
                      }
                    >
                      {/* {this.renderSubLocation()} */}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="col-xl-4" style={{ marginBottom: "-9px" }}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("commiteLocation", {
                    rules: [
                      { required: true, message: "Хороо сонгоно уу!" },
                    ],
                  })(
                    <Select
                      placeholder="Хороо *"
                      showSearch
                      optionFilterProp="children"
                      onChange={this.onStreet}
                    >
                      {/* {this.renderCommiteLocation()} */}
                    </Select>,
                  )}
                </Form.Item>
              </div>{" "}
            </div>

            <div className="col-xl-12">
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("homeaddress", {
                    rules: [
                      {
                        required: true,
                        message: "Гэрийн хаягаа заавал оруулна уу!",
                      },
                    ],
                  })(<Input placeholder="Гэрийн хаяг" />)}
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button className="btn btn-dark" onClick={this.handleSubmit}>
              <span className="text-uppercase">Хадгалах</span>
            </button>
          </div>
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="col-md-8 pad10">
        <div className="user-menu-content">
          <p className="title">
            <span>Профайл</span>
          </p>
          <div className="user-profile-contain">
            {this.renderProfile()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "component" })(Component);
