/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/first */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import moment from "moment";
import { PersistGate } from "redux-persist/es/integration/react";
import "antd/dist/antd.less";
import "./index.css";
import "./utils/momentLocale";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import mnMN from "./utils/locale";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store/configureStore";

moment.locale("mn-MN");
library.add(fas, far, fab);

const { persistor, store } = configureStore();

ReactDOM.hydrate(
  <ConfigProvider locale={mnMN}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Route component={App} />
        </Router>
      </PersistGate>
    </Provider>
  </ConfigProvider>,
  document.getElementById("root"),
);
registerServiceWorker();
