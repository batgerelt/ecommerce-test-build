import React, { Component } from 'react';
import { Modal } from 'antd';

class index extends Component {
  state = { isOpen: false }
  handleLogin = () => {
    console.log('handleLogin: ');
    localStorage.setItem('tokenExpired', false);
    this.setState({ isOpen: false });
  }

  render() {
    const { isOpen } = this.state;
    return (
      <Modal
        visible={false}
        footer={null}
        closable
        onCancel={this.handleLogin}
      >
        <div className="d-flex justify-content-center">
          <div>
            <h2>
              Таны аюулгүй байдлыг хамгаалах үүднээс 60 минутаас дээш хугацаанд
              ямар нэг үйлдэл хийгдээгүй үед системээс автоматаар гаргах болно.
            </h2>
            <span>isOpen: {isOpen}</span>

            <button onClick={this.handleLogin}>Дахин нэвтрэх</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default index;
