import BaseModel from "../BaseModel";
import { asyncFn } from "../utils";

class Model extends BaseModel {
  initialState = {
    history: [],
    wish: [],
    delivery: [],
    orderdetail: [],
    confirms: [],
    checkKeys: [],
  };

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        history: {
          request: this.buildActionName("request", data.model, "history"),
          response: this.buildActionName("response", data.model, "history"),
          error: this.buildActionName("error", data.model, "history"),
        },
        wish: {
          request: this.buildActionName("request", data.model, "wish"),
          response: this.buildActionName("response", data.model, "wish"),
          error: this.buildActionName("error", data.model, "wish"),
        },
        delivery: {
          request: this.buildActionName("request", data.model, "delivery"),
          response: this.buildActionName("response", data.model, "delivery"),
          error: this.buildActionName("error", data.model, "delivery"),
        },
        deliveryAddress: {
          request: this.buildActionName(
            "request",
            data.model,
            "deliveryaddress",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "deliveryaddress",
          ),
          error: this.buildActionName("error", data.model, "deliveryaddress"),
        },
        resetPassword: {
          request: this.buildActionName("request", data.model, "resetpassword"),
          response: this.buildActionName(
            "response",
            data.model,
            "resetpassword",
          ),
          error: this.buildActionName("error", data.model, "resetpassword"),
        },
        deleteWish: {
          request: this.buildActionName("request", data.model, "deletewish"),
          response: this.buildActionName("response", data.model, "deletewish"),
          error: this.buildActionName("error", data.model, "deletewish"),
        },
        deleteHistory: {
          request: this.buildActionName("request", data.model, "deletehistory"),
          response: this.buildActionName(
            "response",
            data.model,
            "deletehistory",
          ),
          error: this.buildActionName("error", data.model, "deletehistory"),
        },
        deleteAddress: {
          request: this.buildActionName("request", data.model, "deleteaddress"),
          response: this.buildActionName(
            "response",
            data.model,
            "deleteaddress",
          ),
          error: this.buildActionName("error", data.model, "deleteaddress"),
        },
        addWish: {
          request: this.buildActionName("request", data.model, "addwish"),
          response: this.buildActionName("response", data.model, "addwish"),
          error: this.buildActionName("error", data.model, "addwish"),
        },
        customer: {
          request: this.buildActionName("request", data.model, "customer"),
          response: this.buildActionName("response", data.model, "customer"),
          error: this.buildActionName("error", data.model, "customer"),
        },
        committelocation: {
          request: this.buildActionName(
            "request",
            data.model,
            "committelocation",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "committelocation",
          ),
          error: this.buildActionName("error", data.model, "committelocation"),
        },
        systemlocation: {
          request: this.buildActionName(
            "request",
            data.model,
            "systemlocation",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "systemlocation",
          ),
          error: this.buildActionName("error", data.model, "systemlocation"),
        },
        districtlocation: {
          request: this.buildActionName(
            "request",
            data.model,
            "districtlocation",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "districtlocation",
          ),
          error: this.buildActionName("error", data.model, "districtlocation"),
        },
        useraddress: {
          request: this.buildActionName("request", data.model, "useraddress"),
          response: this.buildActionName("response", data.model, "useraddress"),
          error: this.buildActionName("error", data.model, "useraddress"),
        },
        addAddress: {
          request: this.buildActionName("request", data.model, "addaddress"),
          response: this.buildActionName("response", data.model, "addaddress"),
          error: this.buildActionName("error", data.model, "addaddress"),
        },
        updateMain: {
          request: this.buildActionName("request", data.model, "updatemain"),
          response: this.buildActionName("response", data.model, "updatemain"),
          error: this.buildActionName("error", data.model, "updatemain"),
        },
        changePassword: {
          request: this.buildActionName(
            "request",
            data.model,
            "changepassword",
          ),
          response: this.buildActionName(
            "response",
            data.model,
            "changepassword",
          ),
          error: this.buildActionName("error", data.model, "changepassword"),
        },
        emartCard: {
          request: this.buildActionName("request", data.model, "emartcard"),
          response: this.buildActionName("response", data.model, "emartcard"),
          error: this.buildActionName("error", data.model, "emartcard"),
        },
        checkConfirm: {
          request: this.buildActionName("request", data.model, "checkconfirm"),
          response: this.buildActionName(
            "response",
            data.model,
            "checkconfirm",
          ),
          error: this.buildActionName("error", data.model, "checkconfirm"),
        },
        userPic: {
          request: this.buildActionName("request", data.model, "userpic"),
          response: this.buildActionName("response", data.model, "userpic"),
          error: this.buildActionName("error", data.model, "userpic"),
        },
        orderDetail: {
          request: this.buildActionName("request", data.model, "orderdetail"),
          response: this.buildActionName("response", data.model, "orderdetail"),
          error: this.buildActionName("error", data.model, "orderdetail"),
        },
        checkKey: {
          request: this.buildActionName("request", data.model, "checkkey"),
          response: this.buildActionName("response", data.model, "checkkey"),
          error: this.buildActionName("error", data.model, "checkkey"),
        },
      };
    }
  }
  // Location
  getSystemLocation = () =>
    asyncFn({
      url: `/systemlocation`,
      method: "GET",
      model: this.model.systemlocation,
    });
  getDistrictLocation = ({ id } = {}) =>
    asyncFn({
      url: `/systemlocation/${id}`,
      method: "GET",
      model: this.model.districtlocation,
    });
  getCommmitteLocation = ({ provid, distid } = {}) =>
    asyncFn({
      url: `/systemlocation/committe/${provid}/${distid}`,
      method: "GET",
      model: this.model.committelocation,
    });
  // GET
  getUserInfo = () =>
    asyncFn({
      url: `/customer/address`,
      method: "GET",
      model: this.model.useraddress,
    });
  getCustomer = () =>
    asyncFn({ url: `/customer`, method: "GET", model: this.model.customer });
  getHistory = () =>
    asyncFn({
      url: `/customer/viewlist`,
      method: "GET",
      model: this.model.history,
    });
  getWish = () =>
    asyncFn({
      url: `/customer/wishlist`,
      method: "GET",
      model: this.model.wish,
    });
  getWishByCount = ({ count }) =>
    asyncFn({
      url: `/customer/wishlist/${count}`,
      method: "GET",
      model: this.model.wish,
    });
  getDelivery = ({ custid }) =>
    asyncFn({
      url: `/order/all/${custid}`,
      method: "GET",
      model: this.model.delivery,
    });
  getDeliveryAddress = ({ custid }) =>
    asyncFn({
      url: `/cutomer/address/${custid}`,
      method: "GET",
      model: this.model.deliveryAddress,
    });
  getOrderDetail = ({ ordid }) =>
    asyncFn({
      url: `/order/detail/${ordid}`,
      method: "GET",
      model: this.model.orderDetail,
    });
  // POST
  addWish = ({ skucd }) =>
    asyncFn({
      url: `/customer/wishlist/${skucd}`,
      method: `POST`,
      model: this.model.addWish,
    });
  addAddress = ({ body }) =>
    asyncFn({
      body,
      url: `/customer/address`,
      method: `POST`,
      model: this.model.addAddress,
    });
  userPic = ({ body, isfiles }) =>
    asyncFn({
      body,
      url: `/customer/userprofile`,
      method: `POST`,
      model: this.model.userPic,
      isfiles,
    });
  // PUT
  resetPassword = ({ body }) =>
    asyncFn({
      body,
      url: `/customer/passreset`,
      method: `PUT`,
      model: this.model.resetPassword,
    });
  emartCard = ({ cardno, pincode }) =>
    asyncFn({
      url: `/customer/card/${cardno}/${pincode}`,
      method: `POST`,
      model: this.model.emartCard,
    });
  changePassword = ({ key, password }) =>
    asyncFn(
      {
        url: `/customer/putchangepass/${key}/${password}`,
        method: `PUT`,
        model: this.model.changePassword,
      },
      console.log(key),
    );
  checkKey = ({ key }) =>
    asyncFn({
      url: `/customer/checkpasswordkey/${key}`,
      method: `GET`,
      model: this.model.checkKey,
    });
  updateMain = ({ body }) =>
    asyncFn({
      body,
      url: `/customer`,
      method: `PUT`,
      model: this.model.updateMain,
    });
  confirm = ({ key }) =>
    asyncFn({
      url: `/customer/checkkey/${key}`,
      method: `PUT`,
      model: this.model.checkConfirm,
    });
  // DELETE
  deleteWish = ({ skucd }) =>
    asyncFn({
      url: `/customer/wishlist/${skucd}`,
      method: `DELETE`,
      model: this.model.deleteWish,
    });
  deleteHistory = ({ skucd }) =>
    asyncFn({
      url: `/customer/seenlist/${skucd}`,
      method: `DELETE`,
      model: this.model.deleteHistory,
    });
  deleteAddress = ({ id }) =>
    asyncFn({
      url: `/customer/address/${id}`,
      method: `DELETE`,
      model: this.model.deleteAddress,
    });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET Order Detail
      case this.model.orderDetail.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.orderDetail.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.orderDetail.response:
        return { ...state, orderdetail: action.payload.data };
      // USER PIC
      case this.model.userPic.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.userPic.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.userPic.response:
        return { ...state, response: action.payload.data };
      // GET USER ADDRESS
      case this.model.useraddress.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.useraddress.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.useraddress.response:
        return {
          ...state,
          useraddress: action.payload.data,
          addrs: action.payload.data.addrs,
        };
      // GET Customer info
      case this.model.customer.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.customer.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.customer.response:
        return { ...state, userInfo: action.payload.data };
      // GET Histrory products
      case this.model.history.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.history.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.history.response:
        return { ...state, history: action.payload.data };
      // Get Wish products
      case this.model.wish.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.wish.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.wish.response:
        return { ...state, wish: action.payload.data };
      // Get Wish delivery
      case this.model.delivery.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.delivery.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.delivery.response:
        return { ...state, delivery: action.payload.data };
      // Get Wish delivery address
      case this.model.deliveryAddress.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.deliveryAddress.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.deliveryAddress.response:
        return { ...state, deliveryAddress: action.payload.data };
      // POST Add view list
      case this.model.addWish.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.addWish.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.addWish.response:
        return { ...state, response: action.payload.data };
      // POST Add address
      case this.model.addAddress.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.addAddress.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.addAddress.response:
        return { ...state, response: action.payload.data };
      // PUT Update main
      case this.model.updateMain.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.updateMain.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.updateMain.response:
        return { ...state, response: action.payload.data };
      // Confirm
      case this.model.checkConfirm.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.checkConfirm.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.checkConfirm.response:
        return { ...state, confirms: action.payload };
      // PUT Change password
      case this.model.changePassword.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.changePassword.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.changePassword.response:
        return { ...state, changePass: action.payload };
      // PUT Emart card
      case this.model.emartCard.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.emartCard.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.emartCard.response:
        return { ...state, emartCard: action.payload };
      case this.model.checkKey.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.checkKey.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.checkKey.response:
        return { ...state, checkKeys: action.payload };
      // LOCATION
      // GET COMMITTE LOCATION
      case this.model.committelocation.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.committelocation.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.committelocation.response:
        return { ...state, committelocation: action.payload.data };
      // GET SYSTEM LOCATION
      case this.model.systemlocation.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.systemlocation.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.systemlocation.response:
        return { ...state, systemlocation: action.payload.data };
      // GET DISTRICT LOCATION
      case this.model.districtlocation.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.districtlocation.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.districtlocation.response:
        return { ...state, districtlocation: action.payload.data };
      default:
        return state;
    }
  };
}

export default Model;
