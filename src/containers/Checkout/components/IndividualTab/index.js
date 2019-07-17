/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Input, Form, Button } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
class IndividualTab extends React.Component {
  state = {
    loading: false,
    cardInfo: null,
    useEpoint: false,
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() {
    this.props.onRef(this);
    const { userinfo } = this.props;
    const { setFieldsValue } = this.props.form;
    if (userinfo.card !== undefined) {
      // setFieldsValue({ cardPoint: userinfo.card.point });
      this.setState({ cardInfo: userinfo.card });
    }
  }

  errorMsg = (txt) => {
    MySwal.hideLoading();
    MySwal.fire({
      type: "error",
      text: txt,
      animation: true,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { setFieldsValue } = this.props.form;
    const { info } = this.props.userinfo;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        let cardno = values.cardno;
        let pincode = values.pincode;
        this.props.connectEpointCard({ cardno, pincode }).then((res) => {
          if (res.payload.success) {
            this.setState({ cardInfo: res.payload.data });
            setFieldsValue({ cardPoint: res.payload.data.point });
          } else {
            this.errorMsg(res.payload.message);
          }
          this.setState({ loading: false });
        });
      }
    });
  };

  handleUsePoint = async (e) => {
    const { cardInfo } = this.state;
    const { value: password } = await Swal.fire({
      title: "Нууц үг",
      input: "password",
      width: "20rem",
      confirmButtonText: "Ok",
      confirmButtonColor: "#feb415",
      cancelButtonText: "Болих",
      inputPlaceholder: "Картын нууц үгээ оруулна уу ?",
      showCancelButton: true,
      inputAttributes: {
        maxlength: 4,
        autocapitalize: "off",
        autocorrect: "off",
      },
    });
    if (password) {
      let cardno = cardInfo.cardno;
      this.props.checkEpointPin({ cardno, password }).then((res) => {
        if (res.payload.success) {
          /* let tmp = epointcard;
              if (
                (delivery.price + products.totalPrice) / 2 >=
                epointcard.point
              ) {
                tmp.point = parseFloat(point - parseInt(point));
                this.setState({
                  epointUsedPoint: parseInt(point),
                  epointcard: tmp
                });
              } else {
                tmp.point =
                  tmp.point - (delivery.price + products.totalPrice) / 2;
                this.setState({
                  epointUsedPoint: (delivery.price + products.totalPrice) / 2,
                  epointcard: tmp
                });
              }
              this.setState({ useEpoint: true }); */
        } else {
          this.errorMsg(res.payload.message);
        }
      });
    }
  }


  renderForm = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      const { loading, cardInfo } = this.state;
      return (
        <Form onSubmit={this.onSubmit}>
          {
            cardInfo === null ?
              <div>
                <p className="title">
                  <strong>Имарт картаа холбох</strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item>
                        {getFieldDecorator("cardno", {
                          rules: [{ required: true, message: "Картын дугаар оруулна уу ?" }],
                        })(
                          <Input allowClear size="large" type="text" placeholder="Картын дугаар*" className="col-md-12" />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator("pincode", {
                          rules: [{ required: true, message: "Нууц үг оруулна уу ?" }],
                        })(
                          <Input allowClear size="large" type="password" placeholder="Нууц үг*" className="col-md-12" />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Button htmlType="submit" loading={loading} className="btn btn-main solid">Холбох</Button>
              </div> :
              <div>
                <p className="title">
                  <strong>Оноо</strong>
                </p>
                <div className="row row10 checkoutFormContainer">
                  <div className="col-xl-6 pad10">
                    <div className="form-group">
                      <Form.Item style={{ marginBottom: 0 }}>
                        {getFieldDecorator("cardPoint", {
                          initialValue: cardInfo.point,
                          rules: [{ required: false, message: "Картын оноо оруулна уу ?" }],
                        })(
                          <Input size="large" disabled type="text" placeholder="Картын оноо*" style={{ marginBottom: 0 }} className="col-md-12" />,
                        )}
                      </Form.Item>
                      {/*  <label>
                        Таны карт идэвхгүй болсон байна. Хэрэглэгчийн үйлчилгээний
                        төвд хандаж картаа шинэчилүүлнэ үү.
                      </label> */}
                    </div>
                  </div>
                </div>
                <Button className="btn btn-main solid" onClick={this.handleUsePoint}>
                  <span className="text-uppercase">Ашиглах</span>
                </Button>
              </div>
          }
        </Form>
      );
    } catch (error) {
      return console.log(error);
    }
  }

  render() {
    return this.renderForm();
  }
}

export default Form.create({ name: "individual" })(IndividualTab);
