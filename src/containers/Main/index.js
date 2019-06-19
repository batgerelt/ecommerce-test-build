import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropsTypes from "prop-types";
import { Home } from '../';
import NotFound from '../Exception/404';
import { PrivateRoute } from '../../components';

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

class Main extends Component {
  render() {
    return (
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        {
          this.props.getRouteData.map(item => (
            <PrivateRoute
              exact={item.exact}
              key={item.realPath}
              path={item.realPath}
              component={item.component || NotFound}
            />
          ))
        }
        <Route component={NotFound} />
      </Switch>
    );
  }
}

Main.propTypes = {
  getRouteData: PropsTypes.array.isRequired,
};

export default withRouter(connect(mapStateToProps)(Main));
