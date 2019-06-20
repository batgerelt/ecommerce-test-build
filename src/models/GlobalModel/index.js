import BaseModel from '../BaseModel';

class Model extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.initialState = {
      collapsed: false,
      notices: [],
      fetchingNotices: false,
    };
    this.persist = true;
  }

  onCollapse = keys => (dispatch) => {
    console.log('it works!!!', keys);
    dispatch({
      type: 'onMenuCollapse',
      keys,
    });
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  }
}

export default Model;
