import BaseModel from "../BaseModel";
import { asyncFn } from "../utils";

class AuthModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.persist = true;
    this.loginModel = {
      request: this.buildActionName("request", "login"),
      response: this.buildActionName("response", "login"),
      error: this.buildActionName("error", "login"),
    };
    this.loggedModel = {
      request: this.buildActionName("request", "logged"),
      response: this.buildActionName("response", "logged"),
      error: this.buildActionName("error", "logged"),
    };
    // this.logoutModel = {
    //   request: this.buildActionName('request', 'logout'),
    //   response: this.buildActionName('response', 'logout'),
    //   error: this.buildActionName('error', 'logout'),
    // };
    this.signupModel = {
      request: this.buildActionName("request", "signup"),
      response: this.buildActionName("response", "signup"),
      error: this.buildActionName("error", "signup"),
    };
    this.resetModel = {
      request: this.buildActionName("request", "reset"),
      response: this.buildActionName("response", "reset"),
      error: this.buildActionName("error", "reset"),
    };
    this.initialState = {
      user: {
        name: "",
        username: "",
      },
      data: {},
      isLoading: false,
      isLogged: false,
      error: false,
      errorMessage: "",
      modules: [],
    };
  }

  login = ({ body } = {}) =>
    asyncFn({
      body,
      url: "/login/userlogin",
      method: "POST",
      model: this.loginModel,
    });

  // logout = () => asyncFn({
  //   url: '/api/auth/signout', method: 'GET', model: this.logoutModel,
  // })

  logout = () => ({
    type: "AUTH_LOGOUT",
  });

  signup = ({ body } = {}) =>
    asyncFn({
      body,
      url: "/customer",
      method: "POST",
      model: this.signupModel,
    });

  reset = ({ mail }) =>
    asyncFn({
      url: `/customer/checkchangepass/${mail}`,
      method: "PUT",
      model: this.resetModel,
    });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.resetModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
        };
      case this.signupModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          /* success: action.payload.success,
          message: action.payload.message, */
        };
      case this.loginModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: "",
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
          data: action.payload.data,
        };
      case this.loggedModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: "",
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
      // case this.logoutModel.request:
      //   return {
      //     ...state,
      //     isLoading: true,
      //     error: false,
      //     errorMessage: '',
      //   };
      // case this.logoutModel.error:
      //   return {
      //     ...state,
      //     isLoading: false,
      //     error: true,
      //     errorMessage: action.message,
      //   };
      // case this.logoutModel.response:
      //   localStorage.clear();
      //   return {
      //     ...state,
      //     isLoading: false,
      //     isLogged: false,
      //     user: {
      //       name: '',
      //       username: '',
      //     },
      //   };
      case "AUTH_LOGOUT":
        const username = localStorage.getItem("username");
        localStorage.clear();
        localStorage.setItem("username", username);
        if (localStorage.getItem("username") === 'null') {
          localStorage.removeItem("username");
        }
        return {
          ...state,
          isLoading: false,
          isLogged: false,
          user: {
            name: "",
            username: "",
          },
          auth: null,
          data: [],
        };
      default:
        return state;
    }
  };
}

export default AuthModel;
