import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Homepage from "./page";
import Notfound from "./notfound";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="*" component={Notfound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
