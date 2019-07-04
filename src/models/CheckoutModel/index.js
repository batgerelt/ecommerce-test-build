/**
 * @author A.Adiyasuren
 * @email adya971019@gmail.com
 * @create date 2019-07-03 17:54:26
 * @modify date 2019-07-03 17:54:26
 * @desc [description]
 */
import BaseModel from '../BaseModel';
import { asyncFn } from '../utils';

class Model extends BaseModel {
  initialState = {
    current: {
      error: false,
      errorMessage: '',
      isLoading: false,
      data: {},
    },
    deliveryTypes: [],
    paymentTypes: [],
    bankInfo: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        deliveryTypes: {
          request: this.buildActionName('request', data.model, 'deliveryTypes'),
          response: this.buildActionName('response', data.model, 'deliveryTypes'),
          error: this.buildActionName('error', data.model, 'deliveryTypes'),
        },
        paymentTypes: {
          request: this.buildActionName('request', data.model, 'paymentTypes'),
          response: this.buildActionName('response', data.model, 'paymentTypes'),
          error: this.buildActionName('error', data.model, 'paymentTypes'),
        },
        bankInfo: {
          request: this.buildActionName('request', data.model, 'bankInfo'),
          response: this.buildActionName('response', data.model, 'bankInfo'),
          error: this.buildActionName('error', data.model, 'bankInfo'),
        },
      };
    }
  }

  getBankInfo = () => asyncFn({ url: `/checkout/bankInfo`, method: 'GET', model: this.model.bankInfo });
  getPaymentTypes = () => asyncFn({ url: `/checkout/Paymenttypes`, method: 'GET', model: this.model.paymentTypes });
  getDeliveryTypes = () => asyncFn({ url: `/checkout/deliveryTypes`, method: 'GET', model: this.model.deliveryTypes });
  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET CART BANK INFO
      case this.model.bankInfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.bankInfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.bankInfo.response:
        return { ...state, bankInfo: action.payload.data };

      // GET PAYMENTTYPES
      case this.model.paymentTypes.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.paymentTypes.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.paymentTypes.response:
        return { ...state, paymentTypes: action.payload.data };

      // GET DELIVERYTYPES
      case this.model.deliveryTypes.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.deliveryTypes.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.deliveryTypes.response:
        return { ...state, deliveryTypes: action.payload.data };

      default:
        return state;
    }
  }
}

export default Model;
