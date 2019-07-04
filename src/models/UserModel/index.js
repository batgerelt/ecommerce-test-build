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
    useraddress: [],
    committelocation: [],
    systemlocation: [],
    districtlocation: [],
  }

  constructor(data = {}) {
    super(data);
    if (data.model) {
      this.model = {
        useraddress: {
          request: this.buildActionName('request', data.model, 'useraddress'),
          response: this.buildActionName('response', data.model, 'useraddress'),
          error: this.buildActionName('error', data.model, 'useraddress'),
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
      };
    }
  }

  getUserInfo = ({ id } = {}) => asyncFn({ url: `/customer/address/${id}`, method: 'GET', model: this.model.useraddress });
  getSystemLocation = () => asyncFn({ url: `/systemlocation`, method: 'GET', model: this.model.systemlocation });
  getDistrictLocation = ({ id } = {}) => asyncFn({ url: `/systemlocation/${id}`, method: 'GET', model: this.model.districtlocation });
  getCommmitteLocation = ({ provid, distid } = {}) => asyncFn({ url: `/systemlocation/committe/${provid}/${distid}`, method: 'GET', model: this.model.districtlocation });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      // GET USER ADDRESS
      case this.model.useraddress.request:
        return { ...state, current: this.requestCase(state.current, action) };
      case this.model.useraddress.error:
        return { ...state, current: this.errorCase(state.current, action) };
      case this.model.useraddress.response:
        return { ...state, useraddress: action.payload.data };

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
  }
}

export default Model;
