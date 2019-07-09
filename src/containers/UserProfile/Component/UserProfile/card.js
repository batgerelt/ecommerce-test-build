import React from "react";
import { Form, message, Input, Select, Icon, Spin, Divider } from "antd";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = { dis: "", loc: null };
  componentWillMount() { }

  handleSubmit = (e) => {
    /* e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const param = {
          id: this.props.userInfo.info.id,
          username: this.props.userInfo.info.username,
          firstname: values.firstname,
          imgnm: this.props.userInfo.info.imgnm,
          lastname: values.lastname,
          email: values.email,
          phonE1: values.phone1,
          phonE2: values.phone2,
          locid: this.state.loc === null ? values.commiteLocation : this.state.loc,
          address: values.address,
          adrsid: this.props.useraddress.main.id,
        };
        this.props.updateMain({ body: param }).then((res) => {
          message.success(res.payload.message);
        });
      }
    }); */
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <div className="row row10">
          <div className="col-xl-6" style={{ marginBottom: "-9px" }}>
            <Input placeholder="Картын дугаар" />
          </div>
          <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
            <div className="form-group">
              <Form.Item>
                {getFieldDecorator("cardNo", {
                  rules: [
                    {
                      required: true,
                      message: "Гэрийн хаягаа заавал оруулна уу!",
                    },
                  ],
                })(<Input placeholder="Картын дугаар" />)}
              </Form.Item>
            </div>
          </div>

          <div className="col-xl-12" style={{ marginBottom: "-9px" }}>
            <div className="form-group">
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Гэрийн хаягаа заавал оруулна уу!",
                    },
                  ],
                })(<Input placeholder="Гэрийн хаяг" type="password" />)}
              </Form.Item>
            </div>
          </div>

          <div className="col-xl-12">
            <div className="text-right">
              <button
                className="btn btn-dark marginBottom"
                style={{ width: "108.28px" }}
              >
                <span className="text-uppercase">Холбох</span>
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create({ name: "component" })(Component);
