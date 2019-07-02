/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Radio } from "antd";

const RadioGroup = Radio.Group;

class PaymentPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  render() {
    return (
      <div className="content-container payment">
        <p className="title">
          <strong>НӨАТ баримтын төрөл</strong>
        </p>

        <RadioGroup>
          <div className="hand-pay flex-this">
            <div className="form-check">
              <Radio value={1}>Хувь хүн</Radio>
            </div>
            <div className="form-check">
              <Radio value={2}>Байгууллага</Radio>
            </div>
          </div>
        </RadioGroup>
        <form>
          <div className="row row10">
            <div className="col-xl-6 pad10">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  name="regno"
                  // eslint-disable-next-line react/no-string-refs
                  ref="regno"
                  aria-describedby="emailHelp"
                  placeholder="Байгууллагын регистэр"
                />
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  name="regno"
                  // eslint-disable-next-line react/no-string-refs
                  ref="regno"
                  readOnly
                  aria-describedby="emailHelp"
                  placeholder="Байгууллагын регистэр"
                />
              </div>
            </div>
          </div>
          <button className="btn btn-main solid">
            <span className="text-uppercase">Холбох</span>
          </button>
        </form>
        <div>
          <p className="title">
            <strong>Имарт картаа холбох</strong>
          </p>
          <form>
            <div className="row row10">
              <div className="col-xl-6 pad10">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="cardno"
                    // eslint-disable-next-line react/no-string-refs
                    ref="cardno"
                    aria-describedby="emailHelp"
                    placeholder="Картын дугаар"
                  />
                  <input
                    type="password"
                    // eslint-disable-next-line react/no-string-refs
                    ref="cardpass"
                    name="cardpass"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Нууц үг"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-main solid">
              <span className="text-uppercase">Холбох</span>
            </button>
          </form>
        </div>
        <div>
          <p className="title">
            <strong>Оноо</strong>
          </p>
          <form>
            <div className="row row10">
              <div className="col-xl-6 pad10">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    readOnly
                    name="cardInfo"
                    // eslint-disable-next-line react/no-string-refs
                    ref="cardInfo"
                    aria-describedby="emailHelp"
                    placeholder="Картын дугаар"
                  />
                  <label>
                    Таны карт идэвхгүй болсон байна. Хэрэглэгчийн үйлчилгээний
                    төвд хандаж картаа шинэчилүүлнэ үү.
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-main solid">
              <span className="text-uppercase">Ашиглах</span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default PaymentPanel;
