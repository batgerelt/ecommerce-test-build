import { message } from "antd";
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
    this.oauthModel = {
      request: this.buildActionName("request", "oauthlogin"),
      response: this.buildActionName("response", "oauthlogin"),
      error: this.buildActionName("error", "oauthlogin"),
    };
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
    this.customerModel = {
      request: this.buildActionName("request", "customer"),
      response: this.buildActionName("response", "customer"),
      error: this.buildActionName("error", "customer"),
    };
    this.clearCookieModel = {
      request: this.buildActionName("request", "clearCookie"),
      response: this.buildActionName("response", "clearCookie"),
      error: this.buildActionName("error", "clearCookie"),
    };
    this.initialState = {
      user: {
        name: "",
        username: "",
      },
      data: {},
      Loader: false,
      isLogged: false,
      isLoader: false,
      error: false,
      errorMessage: "",
      modules: [],
      userInfo: [],
    };
  }

  logout = () => ({
    type: "AUTH_LOGOUT",
  });

  clearCookie = () =>
    asyncFn({ url: `/login/logout`, method: "POST", model: this.clearCookieModel })

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

  getCustomer = () =>
    asyncFn({ url: `/customer`, method: "GET", model: this.customerModel });

  login = ({ body, isfiles } = {}) =>
    asyncFn({
      body,
      url: "/login/userlogin",
      method: "POST",
      model: this.loginModel,
    });

  // Oauth 2.0 fb&google.

  ouathLog = ({ body } = {}) =>
    asyncFn({
      body,
      url: "/login/oauthlogin",
      method: "POST",
      model: this.oauthModel,
    });

  loaderTrue = () => ({
    type: "LOADER_TRUE",
  });

  loaderFalse = () => ({
    type: "LOADER_FALSE",
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case this.clearCookieModel.request:
        return {
          ...state,
        };
      case this.clearCookieModel.response:
        return {
          ...state,
        };
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
      case this.customerModel.response:
        return {
          ...state,
          userInfo: action.payload.data,
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
          isLogged: action.payload.success,
          data: action.payload.data,
        };

      // oauth Model
      case this.oauthModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
          errorMessage: "",
        };
      case this.oauthModel.error:
        return {
          ...state,
          isLoading: false,
          error: true,
          errorMessage: action.message,
        };
      case this.oauthModel.response:
        return {
          ...state,
          isLoading: false,
          isLogged: action.payload.success,
          data: action.payload.data,
        };

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
      case "LOADER_TRUE":
        return {
          ...state,
          Loader: true,
        };
      case "LOADER_FALSE":
        return {
          ...state,
          Loader: false,
        };
      default:
        return state;
    }
  };
}

export default AuthModel;
