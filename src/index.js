import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import { PersistGate } from 'redux-persist/es/integration/react';
import 'antd/dist/antd.less';

import './index.less';
import './utils/momentLocale';
import mnMN from './utils/locale';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

moment.locale('mn-MN');

const { persistor, store } = configureStore();

ReactDOM.render(
  <LocaleProvider locale={mnMN}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Route component={App} />
        </Router>
      </PersistGate>
    </Provider>
  </LocaleProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
