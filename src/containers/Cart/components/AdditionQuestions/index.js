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
    const { addionquestions } = this.props;
    const { getFieldDecorator } = this.props.form;

    addionquestions.length === 0 && this.props.redirectUrl();
    try {
      return addionquestions.length !== 0 && (
        <Modal
          visible={addionquestions.length !== 0}
          onCancel={() => this.props.removeAdditionQuestiom(addionquestions[0])}
          onOk={e => this.handleSubmit(e, addionquestions[0].skucd)}
        >
          <div className="justify-content-center">
            <React.Fragment>
              <img alt="addition-question" src={process.env.IMAGE + addionquestions[0].imgnm} style={{ width: '100%' }} />
              <p className="mt-2 d-f-center">{addionquestions[0].note}</p>
              <Form onSubmit={e => this.handleSubmit(e, addionquestions[0].skucd)}>
                <Form.Item>
                  {getFieldDecorator('note', { rules: [{ required: false }] })(
                    <Input
                      autoFocus
                      prefix={<Icon type="gift" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder={addionquestions[0].note}
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
