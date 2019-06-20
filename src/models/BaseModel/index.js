class Model {
  url = null;
  model = null;
  initialState = {};
  persist = false;

  constructor(data = {}) {
    if (data.url) {
      this.url = data.url;
    }
    if (data.model) {
      this.model = {
        request: this.buildActionName('request', data.model),
        response: this.buildActionName('response', data.model),
        error: this.buildActionName('error', data.model),
      };
      this.modelName = data.model;
    }
    if (data.initialState && Object.keys(data.initialState).length) {
      this.initialState = data.initialState;
    }
  }

  buildActionName(...rest) {
    let tempArray = rest.map(entry => entry.toUpperCase());

    return tempArray.join('_');
  }

  requestCase() {
    return { isLoading: true };
  }

  errorCase(action) {
    return {
      isLoading: false,
      error: true,
      errorMessage: action.message,
    };
  }

  reducer = (state = this.initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  }
}

export default Model;
