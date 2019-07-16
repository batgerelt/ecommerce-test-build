/* eslint-disable import/no-unresolved */
/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import mn from 'react-intl/locale-data/mn';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import { PersistGate } from 'redux-persist/es/integration/react';
import 'antd/dist/antd.less';
import './index.css';
import './utils/momentLocale';
import mnMN from './utils/locale';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

addLocaleData(en);
addLocaleData(mn);

moment.locale('mn-MN');
library.add(fas, far, fab);

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
