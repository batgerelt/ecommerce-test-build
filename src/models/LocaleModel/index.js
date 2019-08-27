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
    lang: 'mn',
  }

  constructor(data = {}) {
    super(data);
    this.persist = true;
  }

  setLang = (e = null) => ({
    type: 'LOCALE_SET_LANG',
    payload: (e && e.target && e.target.value)
      || localStorage.getItem("lang")
      || this.initialState.lang,
  });

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      case 'LOCALE_SET_LANG':
        localStorage.setItem("lang", action.payload);
        return { ...state, lang: action.payload };

      default:
        return state;
    }
  }
}

export default Model;
