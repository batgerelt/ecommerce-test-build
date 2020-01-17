import React from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input, Select, Divider, Col, Button, Modal } from "antd";
import ButtonGoogle from "@material-ui/core/Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { store } from 'react-notifications-component';
import { Notification } from "../../../../components";
import Card from "./card";
import SwalModals from "./SwalModals";
import LetterInput from "../../../../components/Input/LetterInput";
import NumberInput from "../../../../components/Input/NumberInput";

const MySwal = withReactContent(Swal);
const formatter = new Intl.NumberFormat("en-US");

class Component extends React.Component {
  state = {
    dis: "",
    loc: null,
    loader: false,
    newEmail: null,
    params: {
      provid: "11",
      distid: "01",
      commid: 3335,
    },
    giftvisible: null,
  };

  componentWillMount() {
    this.getdata();
  }

  getdata() {
    this.setState({ loader: true });
    const param = {
      provid: "",
      distid: "",
      commid: "",
    };
    this.props.getCustomer().then((res) => {
      if (res.payload.success) {
        localStorage.setItem('emartmall_co', res.payload.data.info.firstname);
        localStorage.setItem('percent', res.payload.data.info.cstatus);
        if (res.payload.data.main) {
          param.provid = res.payload.data.main.provinceid;
          param.distid = res.payload.data.main.districtid;
          param.commid = res.payload.data.main.locid;
        } else {
          param.provid = "11";
          param.distid = "01";
          param.commid = 3335;
        }
        this.setState({ params: param });
        this.props.getSystemLocationProfile().then((res) => {
          if (res.payload.success) {
            this.props.getDistrictLocation({ id: param.provid }).then((res) => {
              if (res.payload.success) {
                this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid });
              }
            });
          }
        });
      }
    });
    this.setState({ loader: false });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    // eslint-disable-next-line consistent-return
    this.props.form.validateFields(async (err, values) => {
      let param = [];
      let param1 = [];
      if (!err) {
        if (this.props.userInfo.main === null) {
          const param = {
            custid: this.props.data[0].info.customerInfo.id,
            locid: this.state.loc === null ? values.commiteLocation : this.state.loc,
            address: values.address,
            name: values.firstname,
            phonE1: values.phone1,
            phonE2: values.phone2,
          };
          let result = await this.props.addAddress({ body: { ...param } });
          if (result.payload.success) {
            let response = await this.props.getCustomer();
            if (response.payload.success) {
              param1 = {
                id: this.props.userInfo.info.id,
                username: this.props.userInfo.info.username,
                firstname: values.firstname,
                imgnm: this.props.userInfo.info.imgnm,
                lastname: values.lastname,
                email: values.email,
                phonE1: values.phone1,
                phonE2: values.phone2,
                locid: response.payload.data.main.locid,
                address: response.payload.data.main.address,
                adrsid: response.payload.data.main.id,
              };
            }
          }
        } else {
          param = {
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
            adrsid: this.props.userInfo.main === undefined ? null : this.props.userInfo.main.id,
          };
        }

        if (param1.length !== 0) {
          param = param1;
        }

        if (this.props.userInfo.info.email !== param.email) {
          return MySwal.fire({
            html: (
              <SwalModals
                type={"email"}
                onRef={ref => (this.SwalModals = ref)}
                param={param}
                {...this}
                {...this.props}
              />
            ),
            type: "warning",
            animation: true,
            button: false,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            allowOutsideClick: false,
            closeOnEsc: false,
          });
          // eslint-disable-next-line no-else-return
        } else {
          this.props.updateMain({ body: param }).then((res) => {
            if (res.payload.success) {
              this.getdata();
              store.addNotification({
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: false,
                },
                content: <Notification type="success" text={intl.formatMessage({ id: "shared.form.info.savedSuccessfully" })} />,
              });
            } else {
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
            }
          });
        }
      }
    });
  }

  changeMail = (e) => {
    e.preventDefault();
    MySwal.fire({
      html: (
        <SwalModals
          type={"email"}
          onRef={ref => (this.SwalModals = ref)}
          editEmail={this.props.editEmail}
          {...this.props.userInfo}
          {...this}
        />
      ),
      animation: true,
      button: false,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      allowOutsideClick: false,
      closeOnEsc: false,
    });
  }

  showModal = (picture) => {
    this.setState({ imgnm: picture, giftvisible: true });
  }

  onCancel = () => {
    this.props.getCustomer().then((res) => {
      console.log("Ипойнт үлдэгдлээ харах оролдлого хийв.");
    });
    this.setState({ giftvisible: false });
  }

  changeEmail = (mail) => {
    this.setState({ newEmail: mail });
  }

  renderLocation = (location) => {
    try {
      const loc = location;
      return loc.map((item, index) => (
        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
      ));
    } catch (error) {
      return console.log(error);
    }
  }

  renderCommit = (location) => {
    try {
      const loc = location;
      return loc.map((item, index) => (
        <Select.Option key={index} value={item.locid}>{item.name}</Select.Option>
      ));
    } catch (error) {
      return console.log(error);
    }
  }

  onMainLocation = (e) => {
    const param = {
      provid: e,
      distid: this.state.params.distid,
      commid: this.state.params.commid,
    };
    this.setState({ loader: true });
    this.props.getDistrictLocation({ id: param.provid }).then((res) => {
      if (res.payload.success) {
        param.distid = res.payload.data[0].id;
        this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
          if (res.payload.success) {
            param.commid = res.payload.data[0].locid;
            this.setState({ params: param });
            this.setState({ loader: false });
          }
        });
      }
    });
  }

  onSubLocation = (e) => {
    const param = {
      provid: this.state.params.provid,
      distid: e,
      commid: this.state.params.commid,
    };
    this.setState({ loader: true });
    this.props.getCommmitteLocation({ provid: param.provid, distid: param.distid }).then((res) => {
      if (res.payload.success) {
        param.commid = res.payload.data[0].locid;
        this.setState({ params: param });
        this.setState({ loader: false });
      }
    });
  }

  onchangesyscom = (e) => {
    this.setState({ loc: e });
  }

  checkError = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    return value;
  };

  renderCard(card) {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <Col span={24}>
        <Form>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.cardNumber.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("cardPoint", {
                initialValue: card.cardno,
              })(
                <Input className="profile-custom-input" disabled style={{ backgroundColor: "white", color: "rgba(0,0,0,.5)" }} />,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
            <span className="top-text">{intl.formatMessage({ id: "shared.form.epoint.placeholder" })}</span>
            <Form.Item>
              {getFieldDecorator("cardPoint", {
                initialValue: formatter.format(card.point),
              })(
                <Input className="profile-custom-input" disabled style={{ backgroundColor: "white", color: "rgba(0,0,0,.5)" }} />,
              )}
            </Form.Item>
          </Col>
        </Form>
      </Col>
    );
  }

  renderNoMain() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    const { userInfo } = this.props;
    return (
      <Col span={24}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.city.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("mainLocation", {
              initialValue: this.state.params.provid,
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
            })(
              <Select
                showSearch
                onChange={this.onMainLocation}
                disabled
                loading={loader}
              >
                {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.district.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("subLocation", {
              /* initialValue: this.checkError(this.state.params.distid), */
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.district.placeholder" })}
                optionFilterProp="children"
                onChange={this.onSubLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("commiteLocation", {
              /* initialValue: this.checkError(this.state.params.commid), */
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}
                optionFilterProp="children"
                onChange={this.onchangesyscom}
                disabled={loader}
                loading={loader}
              >
                {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.address" })}</span>
          <Form.Item >
            {getFieldDecorator("address", {
              initialValue: userInfo.main === null ? null : userInfo.main.address,
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
            })(<Input className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />)}
          </Form.Item>
        </Col>
      </Col>
    );
  }

  renderMain() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loader } = this.state;
    const { userInfo } = this.props;
    return (
      <Col span={24}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.city.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("mainLocation", {
              initialValue: this.checkError(this.state.params.provid),
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.city.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.city.placeholder" })}
                onChange={this.onMainLocation}
                disabled
                loading={loader}
              >
                {this.props.systemlocation === undefined ? null : this.renderLocation(this.props.systemlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.district.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("subLocation", {
              initialValue: this.checkError(this.state.params.distid),
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.district.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.district.placeholder" })}
                optionFilterProp="children"
                onChange={this.onSubLocation}
                disabled={loader}
                loading={loader}
              >
                {this.props.districtlocation === undefined ? null : this.renderLocation(this.props.districtlocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}</span>
          <Form.Item>
            {getFieldDecorator("commiteLocation", {
              initialValue: this.checkError(this.state.params.commid),
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.khoroo.validation.required" }) }],
            })(
              <Select
                showSearch
                placeholder={intl.formatMessage({ id: "shared.form.khoroo.placeholder" })}
                optionFilterProp="children"
                onChange={this.onchangesyscom}
                disabled={loader}
                loading={loader}
              >
                {this.props.committelocation === undefined ? null : this.renderCommit(this.props.committelocation)}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10">
          <span className="top-text">{intl.formatMessage({ id: "shared.form.address" })}</span>
          <Form.Item >
            {getFieldDecorator("address", {
              initialValue: userInfo.main === null ? null : userInfo.main.address,
              rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.address.validation.required" }) }],
            })(<Input className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.address.placeholder" })} />)}
          </Form.Item>
        </Col>
      </Col>
    );
  }
  renderProfile = () => {
    try {
      const { intl } = this.props;
      const { getFieldDecorator } = this.props.form;
      const { userInfo } = this.props;
      return (
        <div className="row row10">
          <Form>
            <Col span={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
                <span className="top-text">{intl.formatMessage({ id: "shared.form.lastname.placeholder" })}</span>
                <Form.Item>
                  {getFieldDecorator("lastname", {
                    initialValue: userInfo.info.lastname,
                    rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.lastname.validation.required" }) }],
                  })(<LetterInput className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.lastname.placeholder" })} onChange={value => (this.props.form.setFieldsValue({ lastname: value }))} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
                <span className="top-text">{intl.formatMessage({ id: "shared.form.firstname.placeholder" })}</span>
                <Form.Item>
                  {getFieldDecorator("firstname", {
                    initialValue: userInfo.info.firstname,
                    rules: [{ required: true, message: intl.formatMessage({ id: "shared.form.firstname.validation.required" }) }],
                  })(<LetterInput className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.firstname.placeholder" })} onChange={value => (this.props.form.setFieldsValue({ firstname: value }))} />)}
                </Form.Item>
              </Col>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="padd10">
              <span className="top-text">{intl.formatMessage({ id: "shared.form.email.placeholder" })}</span>
              <Form.Item>
                {getFieldDecorator("email", {
                  initialValue: userInfo.info.email,
                  rules: [{ required: true, type: "email", message: intl.formatMessage({ id: "shared.form.email.validation.required" }) }],
                })(<Input className="profile-custom-input" disabled placeholder={intl.formatMessage({ id: "shared.form.email.placeholder" })} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={4} xl={4} className="padd10">
              <Form.Item>
                <Button
                  className="btn hover-effect"
                  onClick={this.changeMail}
                  style={{
                    width: "100%",
                    height: "40px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    backgroundColor: "#343A40",
                  }}
                >
                  <span>{intl.formatMessage({ id: "profile.userProfile.changeMail" })}</span>
                </Button>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8} className="padd10">
              <span className="top-text" style={{ left: "7px" }}>{intl.formatMessage({ id: "shared.form.phone1.placeholder" })} 1</span>
              <Form.Item>
                {getFieldDecorator("phone1", {
                  initialValue: userInfo.info.phone1,
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp("^[0-9]*$"),
                      message: intl.formatMessage({ id: "shared.form.phone1.validation.pattern" }),
                    },
                    {
                      min: 8,
                      message: intl.formatMessage({ id: "shared.form.phone1.validation.min" }),
                    },
                  ],
                })(<NumberInput className="profile-custom-input" placeholder={intl.formatMessage({ id: "shared.form.phone1.placeholder" })} maxLength={8} autoComplete="off" />)}
              </Form.Item>
            </Col>

            {userInfo.main === null ? this.renderNoMain() : this.renderMain()}

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10" style={{ textAlign: "right" }}>
              <Col xs={12} sm={12} md={18} lg={18} xl={18} />
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Form.Item className="text">
                  <ButtonGoogle className="btn btn-dark hover-effect" htmltype="submit" onClick={this.handleSubmit} style={{ background: '#343a40', height: "40px", width: "100%" }}>
                    <span className="text-uppercase" style={{ fontWeight: "500" }}><FormattedMessage id="shared.form.button.save" /></span>
                  </ButtonGoogle >
                </Form.Item>
              </Col>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padd10" style={{ marginBottom: "20px" }}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                <Divider />
              </Col>
            </Col>
          </Form>
          {
            this.props.epointCardInfo !== null ?
              this.props.epointCardInfo.length === 0 ? <Card emartCard={this.props.emartCard} getCustomer={this.props.getCustomer} showModal={this.showModal} /> : this.renderCard(this.props.epointCardInfo)
              :
              <Card emartCard={this.props.emartCard} getCustomer={this.props.getCustomer} showModal={this.showModal} getEpoint={this.props.getEpoint} />
          }
          {/* {userInfo.card === undefined ? <Card emartCard={this.props.emartCard} getCustomer={this.props.getCustomer} showModal={this.showModal} /> : this.renderCard(userInfo.card)} */}
        </div >
      );
    } catch (error) {
      return console.log(error);
    }
  };

  render() {
    let img = process.env.IMAGE + this.state.imgnm;
    return (
      <div className="user-menu-content" style={{ margin: "0px !important" }}>
        <p className="title" style={{ textTransform: "uppercase" }}>
          <span ><FormattedMessage id="profile.userProfile.form.title" /></span>
        </p>
        <Divider />
        <div className="user-profile-container">
          {this.props.userInfo === undefined ? null : this.renderProfile()}
        </div>
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
  }
}

export default injectIntl(Form.create({ name: "component" })(Component));

