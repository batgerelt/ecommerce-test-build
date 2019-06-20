import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class AuthModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.persist = true;
    this.loginModel = {
      request: this.buildActionName('request', 'login'),
      response: this.buildActionName('response', 'login'),
      error: this.buildActionName('error', 'login'),
    };
    this.loggedModel = {
      request: this.buildActionName('request', 'logged'),
      response: this.buildActionName('response', 'logged'),
      error: this.buildActionName('error', 'logged'),
    };
    this.logoutModel = {
      request: this.buildActionName('request', 'logout'),
      response: this.buildActionName('response', 'logout'),
      error: this.buildActionName('error', 'logout'),
    };

    this.initialState = {
      user: {
        name: '',
        username: '',
      },
      data: {},
      isLoading: false,
      isLogged: false,
      error: false,
      errorMessage: '',
      modules: [],
    };
  }

  login = ({ formData: body }) => asyncFn({
    body, url: '/api/login/adminlogin', method: 'POST', model: this.loginModel,
  })
  logout = () => asyncFn({
    url: '/api/auth/signout', method: 'GET', model: this.logoutModel,
  })

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.loginModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: '',
        };
      case this.loginModel.error:
        return {
          ...state,
          isLoading: false,
          error: true,
          errorMessage: action.message,
        };
      case this.loginModel.response:
        return {
          ...state,
          isLoading: false,
          isLogged: true,
          data: action.payload,
        };
      case this.loggedModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: '',
        };
      case this.loggedModel.error:
        return {
          ...state,
          isLoading: false,
          error: true,
          errorMessage: action.message,
          isLogged: true,
        };
      case this.loggedModel.response:
        return {
          ...state,
          isLoading: false,
          isLogged: true,
          user: {
            name: action.payload.name,
            username: action.payload.username,
          },
        };
      case this.logoutModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: '',
        };
      case this.logoutModel.error:
        return {
          ...state,
          isLoading: false,
          error: true,
          errorMessage: action.message,
        };
      case this.logoutModel.response:
        localStorage.clear();
        return {
          ...state,
          isLoading: false,
          isLogged: false,
          user: {
            name: '',
            username: '',
          },
        };
      default:
        return state;
    }
  }
}

export default AuthModel;
