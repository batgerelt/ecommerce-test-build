/**
 * @author A.Adiyasuren
 * @email adya971019@gmail.com
 * @create date 2019-07-04 09:14:19
 * @modify date 2019-07-04 09:14:19
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
    userinfo: [],
    committelocation: [],
    systemlocation: [],
    districtlocation: [],
    districtandcommiteloc: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        userinfo: {
          request: this.buildActionName('request', data.model, 'userinfo'),
          response: this.buildActionName('response', data.model, 'userinfo'),
          error: this.buildActionName('error', data.model, 'userinfo'),
        },
        committelocation: {
          request: this.buildActionName('request', data.model, 'committelocation'),
          response: this.buildActionName('response', data.model, 'committelocation'),
          error: this.buildActionName('error', data.model, 'committelocation'),
        },
        systemlocation: {
          request: this.buildActionName('request', data.model, 'systemlocation'),
          response: this.buildActionName('response', data.model, 'systemlocation'),
          error: this.buildActionName('error', data.model, 'systemlocation'),
        },
        districtlocation: {
          request: this.buildActionName('request', data.model, 'districtlocation'),
          response: this.buildActionName('response', data.model, 'districtlocation'),
          error: this.buildActionName('error', data.model, 'districtlocation'),
        },
        districtandcommiteloc: {
          request: this.buildActionName('request', data.model, 'districtandcommiteloc'),
          response: this.buildActionName('response', data.model, 'districtandcommiteloc'),
          error: this.buildActionName('error', data.model, 'districtandcommiteloc'),
        },
      };
    }
    this.addAddressModel = {
      request: this.buildActionName('request', 'addaddress'),
      response: this.buildActionName('response', 'addaddress'),
      error: this.buildActionName('error', 'addaddress'),
    };
  }

  getUserInfo = ({ custid } = {}) => asyncFn({ url: `/customer/${custid}`, method: 'GET', model: this.model.userinfo });
  getSystemLocation = () => asyncFn({ url: `/systemlocation`, method: 'GET', model: this.model.systemlocation });
  getDistrictLocation = ({ id } = {}) => asyncFn({ url: `/systemlocation/${id}`, method: 'GET', model: this.model.districtlocation });
  getCommmitteLocation = ({ provid, distid } = {}) => asyncFn({ url: `/systemlocation/committe/${provid}/${distid}`, method: 'GET', model: this.model.committelocation });
  getDistrictAndCommitte = ({ id } = {}) => asyncFn({ url: `/customer/address/info/${id}`, method: 'GET', model: this.model.districtandcommiteloc })
  addAddress = ({ body }) => asyncFn({
    body, url: `/customer/address`, method: 'POST', model: this.addAddressModel,
  });
  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET USER ADDRESS
      case this.model.userinfo.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.userinfo.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.userinfo.response:
        return { ...state, userinfo: action.payload.data };

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

      // GET DISTRICT AND COMMITE LOCATION
      case this.model.districtandcommiteloc.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.districtandcommiteloc.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.districtandcommiteloc.response:
        return { ...state, districtandcommiteloc: action.payload.data };

      // ADD ADDRESS MODEL
      case this.addAddressModel.request:
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
