/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable array-callback-return */
import React from 'react';
import moment from "moment";
import { DayPicker, DateUtils } from 'react-day-picker';
import { Modal, Form, Input, Icon, DatePicker, Col, Button, Select, Divider, Radio, Typography, Spin, Avatar } from 'antd';
import 'react-day-picker/lib/style.css';
import delivery from "../../../../src/scss/assets/images/car.png";

const { Option } = Select;
const { Text } = Typography;

const WEEKDAYS_SHORT = {
  ru: ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'],
};
const MONTHS = {
  ru: [
    '1-р сар',
    '2-р сар',
    '3-р сар',
    '4-р сар',
    '5-р сар',
    '6-р сар',
    '7-р сар',
    '8-р сар',
    '9-р сар',
    '10-р сар',
    '11-р сар',
    '12-р сар',
  ],
};

const FIRST_DAY_OF_WEEK = {
  ru: 1,
};
// Translate aria-labels
const LABELS = {
  ru: { nextMonth: 'следующий месяц', previousMonth: 'предыдущий месяц' },
};

class component extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.switchLocale = this.switchLocale.bind(this);
    this.state = {
      selectedDay: "Thu Feb 20 2020 12:00:00 GMT+0800 (Ulaanbaatar Standard Time)",
      timeTypes: null,
      locale: localStorage.getItem("lang") === "mn" ? 'ru' : 'en',
      DeliveryCycleId: null,
      load: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    try {
      const { chosenDate, chosenDeliveryCycleId } = this.props;
      let foo = new Date(chosenDate);
      let param = moment(chosenDate).format('YYYY-MM-DD');

      this.setState({ selectedDay: foo, DeliveryCycleId: chosenDeliveryCycleId });

      this.props.getDeliveryTime({ deliverydate: param }).then((res) => {
        this.setState({ timeTypes: res.payload.data });
      });

      return null;
    } catch (error) {
      return null;
    }
  }

  switchLocale(e) {
    const locale = e.target.value || 'ru';
    this.setState({ locale });
  }

  disabledDate = (current) => {
    const { zoneSet } = this.props;
    let tmp = false;
    let mm = current.getMonth() + 1;
    let dd = current.getDate();
    let yy = current.getFullYear();
    let myDateString = `${yy}-${mm}-${dd}`;

    let currentDateMill = moment(myDateString, "YYYY-MM-DD").valueOf();
    if (zoneSet !== null) {
      tmp = moment(zoneSet.deliveryDate, "YYYY-MM-DD").valueOf() > currentDateMill;
      zoneSet.restDays.find((item) => {
        if (moment(item.restdate, "YYYY-MM-DD").valueOf() === currentDateMill) {
          tmp = true;
        }
      });
      if (moment(zoneSet.deliveryDate, "YYYY-MM-DD").add(30, 'days').valueOf() <= currentDateMill) {
        tmp = true;
      }
    }
    return tmp;
  }

  handleDayClick(day, { selected }) {
    if (selected === undefined) {
      let disable = this.disabledDate(day);
      if (!disable) {
        this.setState({ load: true });
        let mm = day.getMonth() + 1;
        let dd = day.getDate();
        let yy = day.getFullYear();
        let myDateString = `${yy}-${mm}-${dd}`;
        this.setState({
          selectedDay: selected ? undefined : day,
        });
        this.getDelivery(myDateString);
      }
    }
  }

  getDelivery = (myDateString) => {
    this.props.getDeliveryTime({ deliverydate: myDateString }).then((res) => {
      this.setState({ timeTypes: res.payload.data, DeliveryCycleId: res.payload.data[0].id }, () => this.setState({ load: false }));
    });
  }

  renderTimeTypes = () => {
    try {
      const { timeTypes } = this.state;
      let temp = [];
      temp = timeTypes.map((item, key) => (<Col xs={24} sm={24} md={12} lg={12} xl={12} key={key} style={{ padding: "5px" }}><Radio.Button value={item.id}>{item.cyclenm}{" "}{item.stime}{"-"}{item.etime}</Radio.Button></Col>));
      return temp;
    } catch (error) {
      return null;
    }
  }

  handleClick = (e) => {
    this.setState({ DeliveryCycleId: e.target.value });
  }

  handleSubmit = (e) => {
    let foo = moment(this.state.selectedDay).format('YYYY-MM-DD');
    if (this.state.DeliveryCycleId !== null) {
      this.props.changechosenDeliveryCycleId(this.state.DeliveryCycleId, foo, this.state.timeTypes);
      this.props.onClose();
    }
  }

  render() {
    const { locale } = this.state;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div className="justify-content-center">
        <React.Fragment>
          <Form>
            <Col span={24} className="text-left" >
              <Col span={24}>
                <div className="d-flex justify-content-center">
                  <Avatar shape="square" size={64} src={delivery} />
                  <span className="title font-weight-bold d-flex pl-1 align-items-center" >{this.props.deliveryId !== 3 ? "Хүргэлтээр авах өдөр, цагаа баталгаажуулна уу." : "Очиж авах өдөр, цагаа баталгаажуулна уу."}</span>
                </div>
              </Col>
            </Col>
            <Col span={24} style={{ margin: "0px" }}>
              <Divider style={{ marginBottom: "0px", marginTop: "0px" }} />
            </Col>
            <Col span={24}>
              <Spin indicator={antIcon} spinning={this.state.load}>
                <Col span={24} >
                  <Form.Item>
                    <DayPicker
                      locale={locale}
                      months={MONTHS[locale]}
                      weekdaysShort={WEEKDAYS_SHORT[locale]}
                      labels={LABELS[locale]}

                      selectedDays={this.state.selectedDay}
                      onDayClick={this.handleDayClick}
                      disabledDays={this.disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Text strong>{this.props.deliveryId !== 3 ? "Хүргэлтээр авах цагаа сонгоно уу" : "Очиж авах цагаа сонгоно уу"}</Text>
                </Col>
                <Col span={24}>
                  <Radio.Group value={this.state.DeliveryCycleId} buttonStyle="solid" onChange={this.handleClick}>
                    {this.state.timeTypes !== null ? this.renderTimeTypes() : null}
                  </Radio.Group>
                </Col>
              </Spin>
              <Col span={24}>
                <Divider style={{ marginTop: "0px" }} />
              </Col>
              <Col span={24} className="text-right">
                <button className="btn btn-block btn-login text-uppercase" onClick={this.handleSubmit}>
                  БАТАЛГААЖУУЛАХ
                </button>
              </Col>
            </Col>
          </Form>
        </React.Fragment>
      </div>
    );
  }
}

export default Form.create({ name: 'addition_questiom' })(component);

