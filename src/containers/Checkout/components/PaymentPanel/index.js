/* eslint-disable arrow-body-style */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Radio, Input, Form } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IndividualTab, OrganizationTab } from "../";

const MySwal = withReactContent(Swal);
const RadioGroup = Radio.Group;
class PaymentPanel extends React.Component {
  state = {
    chosenRadio: 1,
  };

  errorMsg = (txt) => {
    MySwal.fire({
      type: "error",
      text: txt,
      animation: true,
      width: "25rem",
      confirmButtonColor: "#feb415",
    });
  };

  componentWillUnmount() { this.props.onRef(null); }
  componentDidMount() { this.props.onRef(this); }

  handleGetValue = () => { return console.log('LoginRegister'); }

  changeRadio = (e) => {
    const { DeliveryInfo } = this.props;
    if (e.target.value === 2) {
      if (DeliveryInfo.state.useEpoint) {
        this.errorMsg("Байгууллагаар баримт авах үед Ипойнт оноо ашиглах боломжгүй тул таны ашиглахаар тохируулсан оноо төлбөрөөс хасагдахгүйг анхаарна уу.");
        let cardInfo = DeliveryInfo.state.ePointData;
        cardInfo.point = (parseFloat(cardInfo.point) + parseFloat(DeliveryInfo.state.epointUsedPoint)).toFixed(2);
        DeliveryInfo.setUseEpoint(false, cardInfo, 0);
      }
    } else {
      DeliveryInfo.setOrganizationData([]);
    }
    this.setState({ chosenRadio: e.target.value });
  }

  render() {
    const { chosenRadio } = this.state;
    return (
      <div className="content-container payment">
        <p className="title">
          <strong>НӨАТ баримтын төрөл</strong>
        </p>

        <RadioGroup onChange={this.changeRadio} value={chosenRadio}>
          <div className="hand-pay flex-this">
            <div className="form-check">
              <Radio value={1}>Хувь хүн</Radio>
            </div>
            <div className="form-check">
              <Radio value={2}>Байгууллага</Radio>
            </div>
          </div>
        </RadioGroup>
        {
          chosenRadio === 1 ?
            <IndividualTab onRef={ref => (this.IndividualTab = ref)} {...this} {...this.props} />
            :
            <OrganizationTab onRef={ref => (this.OrganizationTab = ref)} {...this} {...this.props} />
        }
      </div>
    );
  }
}

export default PaymentPanel;
