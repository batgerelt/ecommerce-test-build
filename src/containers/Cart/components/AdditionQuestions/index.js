/* eslint-disable no-unused-expressions */
/**
 * @author B.Batgerelt ¯\_(ツ)_/¯
 * @email batgereltb@gmail.com
 * @create date 2020-02-10 11:44:19
 * @modify date 2020-02-10 11:44:19
 * @desc [Админ талаас онцгой санал авах барааны санал асуулгыг авах component]
 */

import React from 'react';
import { Modal, Form, Input, Icon } from 'antd';

class component extends React.Component {
  handleSubmit = (e, skucd) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.setAdditionAnswer({ skucd, ...values });
      this.props.form.setFieldsValue({ note: undefined });
    });
  }
  render() {
    const { addionquestions, isAddionLoading, redirectUrl } = this.props;
    const { getFieldDecorator } = this.props.form;
    (addionquestions.length === 0 && isAddionLoading === false) && redirectUrl && this.props.redirectUrl();
    try {
      return addionquestions.length !== 0 && (
        <Modal
          title={addionquestions[0].skunm}
          visible={addionquestions.length !== 0}
          onCancel={() => this.props.removeAdditionQuestiom(addionquestions[0])}
          onOk={e => this.handleSubmit(e, addionquestions[0].skucd)}
          okButtonProps={{
            className: 'btn',
            style: { backgroundColor: '#ffc629', color: "rgba(0,0,0,0.65)" },
            type: "default",
          }}
          closable={false}
          bodyStyle={{
            padding: '0px',
          }}
          className="modal-footer-block"
        >
          <div className="justify-content-center">
            <React.Fragment>
              <img alt="addition-question" src={process.env.IMAGE + addionquestions[0].imgnm} style={{ width: '100%', borderRadius: '3px 3px 0px 0px' }} />
              {/* <p className="mt-2 d-f-center">{addionquestions[0].note}</p> */}
              <Form onSubmit={e => this.handleSubmit(e, addionquestions[0].skucd)} className="mt-3 d-f-center mx-3">
                <Form.Item>
                  {getFieldDecorator('note', { rules: [{ required: true, message: 'Хэвлүүлэх нэрээ оруулна уу' }] })(
                    <Input
                      size="large"
                      autoFocus
                      prefix={<Icon type="gift" style={{ color: '#ffc629' }} />}
                      placeholder={addionquestions[0].note}
                      maxLength={30}
                    />,
                  )}
                </Form.Item>
              </Form>
            </React.Fragment>
          </div>
        </Modal>
      );
    } catch (error) {
      return console.log('error: ', error);
    }
  }
}

export default Form.create({ name: 'addition_questiom' })(component);
