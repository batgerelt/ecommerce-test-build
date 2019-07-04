import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    history: [],
    wish: [],
    delivery: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        history: {
          request: this.buildActionName('request', data.model, 'history'),
          response: this.buildActionName('response', data.model, 'history'),
          error: this.buildActionName('error', data.model, 'history'),
        },
        wish: {
          request: this.buildActionName('request', data.model, 'wish'),
          response: this.buildActionName('response', data.model, 'wish'),
          error: this.buildActionName('error', data.model, 'wish'),
        },
        delivery: {
          request: this.buildActionName('request', data.model, 'delivery'),
          response: this.buildActionName('response', data.model, 'delivery'),
          error: this.buildActionName('error', data.model, 'delivery'),
        },
        deliveryAddress: {
          request: this.buildActionName('request', data.model, 'deliveryaddress'),
          response: this.buildActionName('response', data.model, 'deliveryaddress'),
          error: this.buildActionName('error', data.model, 'deliveryaddress'),
        },
        resetPassword: {
          request: this.buildActionName('request', data.model, 'resetpassword'),
          response: this.buildActionName('response', data.model, 'resetpassword'),
          error: this.buildActionName('error', data.model, 'resetpassword'),
        },
        deleteWish: {
          request: this.buildActionName('request', data.model, 'deletewish'),
          response: this.buildActionName('response', data.model, 'deletewish'),
          error: this.buildActionName('error', data.model, 'deletewish'),
        },
        deleteHistory: {
          request: this.buildActionName('request', data.model, 'deletehistory'),
          response: this.buildActionName('response', data.model, 'deletehistory'),
          error: this.buildActionName('error', data.model, 'deletehistory'),
        },
        deleteAddress: {
          request: this.buildActionName('request', data.model, 'deleteaddress'),
          response: this.buildActionName('response', data.model, 'deleteaddress'),
          error: this.buildActionName('error', data.model, 'deleteaddress'),
        },
      };
    }
  }
  // GET
  getHistory = ({ custid }) => asyncFn({ url: `/customer/viewlist/${custid}`, method: 'GET', model: this.model.history });
  getWish = ({ custid }) => asyncFn({ url: `/customer/wishlist/${custid}`, method: 'GET', model: this.model.wish });
  getDelivery = ({ custid }) => asyncFn({ url: `/order/all/${custid}`, method: 'GET', model: this.model.delivery });
  getDeliveryAddress = ({ custid }) => asyncFn({ url: `/cutomer/address/${custid}`, method: 'GET', model: this.model.deliveryAddress });
  // POST
  // PUT
  resetPassword = ({ body }) => asyncFn({
    body, url: `/customer/passreset`, method: `PUT`, model: this.model.resetPassword,
  });
  // DELETE
  deleteWish = ({ custid, skucd }) => asyncFn({ url: `/customer/wishlist/${custid}/${skucd}`, method: `DELETE`, model: this.model.deleteWish });
  deleteHistory = ({ custid, skucd }) => asyncFn({ url: `/customer/seenlist/${custid}/${skucd}`, method: `DELETE`, model: this.model.deleteHistory });
  deleteAddress = ({ id, custid }) => asyncFn({ url: `/customer/address/${id}/${custid}`, method: `DELETE`, model: this.model.deleteAddress });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
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
      default:
        return state;
    }
  }
}

export default Model;
