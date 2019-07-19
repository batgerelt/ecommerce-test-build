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
    companyInfo: {},
    epointCardInfo: {},
    connectEpoint: {},
    zoneSettingDate: [],
    checkProductZone: [],
    basketNewProducts: [],
    sendOrder: [],
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
        companyInfo: {
          request: this.buildActionName('request', data.model, 'companyInfo'),
          response: this.buildActionName('response', data.model, 'companyInfo'),
          error: this.buildActionName('error', data.model, 'companyInfo'),
        },
        connectEpoint: {
          request: this.buildActionName('request', data.model, 'connectEpoint'),
          response: this.buildActionName('response', data.model, 'connectEpoint'),
          error: this.buildActionName('error', data.model, 'connectEpoint'),
        },
        epointCardInfo: {
          request: this.buildActionName('request', data.model, 'epointCardInfo'),
          response: this.buildActionName('response', data.model, 'epointCardInfo'),
          error: this.buildActionName('error', data.model, 'epointCardInfo'),
        },
        zoneSettingDate: {
          request: this.buildActionName('request', data.model, 'zoneSettingDate'),
          response: this.buildActionName('response', data.model, 'zoneSettingDate'),
          error: this.buildActionName('error', data.model, 'zoneSettingDate'),
        },
        checkProductZone: {
          request: this.buildActionName('request', data.model, 'checkProductZone'),
          response: this.buildActionName('response', data.model, 'checkProductZone'),
          error: this.buildActionName('error', data.model, 'checkProductZone'),
        },
        deleteBasketNewProducts: {
          request: this.buildActionName('request', data.model, 'deleteBasketNewProducts'),
          response: this.buildActionName('response', data.model, 'deleteBasketNewProducts'),
          error: this.buildActionName('error', data.model, 'deleteBasketNewProducts'),
        },
        sendOrder: {
          request: this.buildActionName('request', data.model, 'sendOrder'),
          response: this.buildActionName('response', data.model, 'sendOrder'),
          error: this.buildActionName('error', data.model, 'sendOrder'),
        },
      };
    }
    this.checkEpointPinModel = {
      request: this.buildActionName('request', 'checkepointpin'),
      response: this.buildActionName('response', 'checkepointpin'),
      error: this.buildActionName('error', 'checkepointpin'),
    };
  }

  getBankInfo = () => asyncFn({ url: `/checkout/bankInfo`, method: 'GET', model: this.model.bankInfo });
  getPaymentTypes = () => asyncFn({ url: `/checkout/Paymenttypes`, method: 'GET', model: this.model.paymentTypes });
  getDeliveryTypes = () => asyncFn({ url: `/checkout/deliveryTypes`, method: 'GET', model: this.model.deliveryTypes });
  getCompanyInfo = ({ regno } = {}) => asyncFn({ url: `/order/company/${regno}`, method: 'GET', model: this.model.companyInfo });
  connectEpointCard = ({ cardno, pincode } = {}) => asyncFn({ url: `/customer/card/${cardno}/${pincode}`, method: 'POST', model: this.model.connectEpoint });
  getEpointCardInfo = () => asyncFn({ url: `/customer/card`, method: 'GET', model: this.model.epointCardInfo });
  checkEpointPin = ({ cardno, pincode } = {}) => asyncFn({ url: `/customer/card/pin/${cardno}/${pincode}`, method: 'POST', model: this.checkEpointPinModel });
  getZoneSettings = ({ locid, deliverytype } = {}) => asyncFn({ url: `/checkout/deliverydate/${locid}/${deliverytype}`, method: 'GET', model: this.model.zoneSettingDate });
  getCheckProductZone = ({ body, locid } = {}) => asyncFn({
    body, url: `/checkout/checkproductszone/${locid}`, method: 'POST', model: this.model.checkProductZone,
  });
  deleteBasket = ({ body }) => asyncFn({
    body, url: `/basket/delete/list`, method: 'DELETE', model: this.model.deleteBasketNewProducts,
  });
  sendCheckoutOrder = ({ body } = {}) => asyncFn({
    body, url: `/order`, method: 'POST', model: this.model.sendOrder,
  });
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

      // GET COMPANY INFO
      case this.model.companyInfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.companyInfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.companyInfo.response:
        return { ...state, companyInfo: action.payload.data };

      // CONNECT EPOINT CARD
      case this.model.connectEpoint.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.connectEpoint.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.connectEpoint.response:
        return { ...state, connectEpoint: action.payload.data };

      // EPOINT CARD INFO
      case this.model.epointCardInfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.epointCardInfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.epointCardInfo.response:
        return { ...state, epointCardInfo: action.payload.data };

      // ZONE SETTINGS DATE
      case this.model.zoneSettingDate.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.zoneSettingDate.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.zoneSettingDate.response:
        return { ...state, zoneSettingDate: action.payload.data };

      // CHECK PRODUCT ZONE
      case this.model.checkProductZone.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.checkProductZone.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.checkProductZone.response:
        return { ...state, checkProductZone: action.payload };

      // DELETE BASKET GET NEW PRODUCT
      case this.model.deleteBasketNewProducts.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.deleteBasketNewProducts.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.deleteBasketNewProducts.response:
        return { ...state, deleteBasketNewProducts: action.payload };

      // SEND ORDER
      case this.model.sendOrder.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.sendOrder.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.sendOrder.response:
        return { ...state, sendOrder: action.payload };

      // CHECK EPOINT PIN MODEL
      case this.checkEpointPinModel.request:
        return {
          ...state,
          isLoading: true,
          error: false,
        };

      default:
        return state;
    }
  }
}

export default Model;
