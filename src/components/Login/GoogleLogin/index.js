/* global gapi */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
    };
  }

  handleLogin = async () => {
    window.gapi.load('auth2', () => {
      let auth2 = gapi.auth2.init({
        // Test client_id
        // client_id: '885941849583-fai2isc5scoteqf4s50b0aee1s6cku39.apps.googleusercontent.com',
        // Real client_id
        client_id: '845113891404-qlj5hpuro8aivst2veeqhthtbdsjjdhh.apps.googleusercontent.com',
        cookiepolicy: "single_host_origin",
        scope: "profile email",
      });

      auth2.then(() => {
        let profile = auth2.currentUser.get().getBasicProfile();
        let param = {
          username: profile.getName(),
          firstname: profile.getName(),
          lastname: profile.getName(),
          phone: null,
          email: profile.getEmail(),
          oauthType: "Gmail",
          oauthId: profile.getId(),
          imgUrl: profile.getImageUrl(),
        };
        this.props.loginSocial(param);
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button id="loginButton" className="btn btn-block btn-social btn-gmail" onClick={this.handleLogin}><FormattedMessage id="shared.form.button.googleLogin" /></button>
        </header>
      </div>
    );
  }
}

export default App;


/*
import React, { Component } from 'react';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
    };
  }

  handleLogin = async () => {
    window.gapi.load('auth2', () => {
      let auth2 = gapi.auth2.init({
        // client_id: '885941849583-fai2isc5scoteqf4s50b0aee1s6cku39.apps.googleusercontent.com',
        client_id: '845113891404-qlj5hpuro8aivst2veeqhthtbdsjjdhh.apps.googleusercontent.com',
        cookiepolicy: "single_host_origin",
        scope: "profile email",
      });

      auth2.then(() => {
        this.setState({
          isSignedIn: auth2.isSignedIn.get(),
        });
      });

      if (auth2.isSignedIn.get()) {
        let profile = auth2.currentUser.get().getBasicProfile();
        let param = {
          username: profile.getName(),
          firstname: profile.getName(),
          lastname: profile.getName(),
          phone: null,
          email: profile.getEmail(),
          oauthType: "Gmail",
          oauthId: profile.getId(),
          imgUrl: profile.getImageUrl(),
        };
        this.props.loginSocial(param);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button id="loginButton" className="btn btn-block btn-social btn-gmail" onClick={this.handleLogin}>Login with Google</button>
        </header>
      </div>
    );
  }
}

export default App;
 */
