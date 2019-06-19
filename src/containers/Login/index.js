import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Input, Icon, message } from 'antd';
// import { GlobalFooter } from '../../components';
import styles from './Login.less';
import { Auth } from '../../models';

import otLogo from "../../assets/images/emart-logo.png";

const FormItem = Form.Item;

const mapStateToProps = (state) => {
  // console.log(state);
  const { auth } = state;
  return {
    auth,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ login: Auth.login }, dispatch);


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'account',
    };
  }

  componentDidMount() {
    if (this.props.auth && this.props.auth.isLogged === true) {
      this.props.history.push('/');
    }
  }

  componentWillMount() { }

  componentDidUpdate(prevProps) {
    if (this.props.auth.data !== prevProps.auth.data) {
      if (this.props.auth.data.success === true) {
        this.props.auth.isLogged = true;
        this.props.history.push('/');
      } else {
        this.wm = this.props.auth;
        if (this.props.auth.data) {
          message.warning(this.props.auth.data.message);
        } else {
          message.warning(this.props.auth.errorMessage);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.auth && this.props.auth.isLogged === true && nextProps.auth.isLogged === false) {
      this.props.history.push('/');
    }
    // if(this.props.auth.data !== nextProps.auth.data) {
    // }
    // console.log(this.props.data);
    // if (this.props.auth && this.props.auth.isLogged === false && nextProps.auth.isLogged === true) {

    // }
    // console.log('......', this.props.auth.data);
  }

  changeHandle = (formData) => {
    // console.log('changeHandle: ', formData);
    // this.setState({
    //   formData,
    // });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // const { type } = this.state;
    this.props.form.validateFields(
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.login({ formData: values });
        }
      },
    );
  }
  render() {
    const { form: { getFieldDecorator }, auth } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.header}>
              <img alt="" style={{ width: '100px', height: 'auto' }} className={styles.logo} src={otLogo} />
            </div>
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{
                  required: type === 'account', message: 'Нэвтрэх нэр оруулна уу！',
                }],
              })(<Input
                className={styles.inputs}
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="Нэвтрэх нэр"
              />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  required: type === 'account', message: 'Нууц үг оруулна уу',
                }],
              })(<Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="Нууц үг"
                className={styles.inputs}
              />)}
            </FormItem>
            <FormItem className={styles.additional}>
              <Button size="large" loading={auth.isLoading} className={styles.submit} type="primary" htmlType="submit">
                Нэвтрэх
              </Button>
            </FormItem>
          </Form>
        </div>
        {/* <GlobalFooter
          className={styles.footer}
          copyright={
            <div>
              Copyright <Icon type="copyright" /> 2017 Datacare
            </div>
          }
        /> */}
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const WrappedNormalLoginForm = Form.create()(Login);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedNormalLoginForm);
