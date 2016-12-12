/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ViewPagerAndroid,
  Alert
} from 'react-native';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication/client';

import io from 'socket.io-client/dist/socket.io';
const host = 'http://192.168.5.92:3030';

let socket = io(host, { transports: ['websocket'] });

// if(!global._babelPolyfill) { require('babel-polyfill'); }
// window.navigator.userAgent = 'ReactNative';

// Set up Feathers client side
let app = feathers();
// Register hooks module
app.configure(hooks());
// Register socket.io
app.configure(socketio(socket));
// Set up authentication with a store to cache your auth token
app.configure(authentication({ storage: AsyncStorage }));

const appServices = app.service('users');

export default class client extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {isLoggedIn: false, username: null};
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    app.authenticate({}).then((result)=>{
      this.state = {hasPreviousSession: true};
      this.setState({isLoggedIn: true, username: result.data.username});
    }).catch((error)=>{
      this.state = {hasPreviousSession: false};
      this.setState({isLoggedIn: false, username: null});
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  login() {
    let email = this.state.email;
    let password = this.state.password;
    if(typeof email !== 'undefined' && typeof password !== 'undefined') {
      if(this.validateEmail(email) === true) {
        app.authenticate({
          type: 'local',
          'email': email,
          'password': password
        }).then((result)=>{
          this.setState({isLoggedIn: true, hasPreviousSession: true, username: result.data.username});
        }).catch((error)=>{
          Alert.alert('Login Failed', 'User does not exist');
          this.setState({isLoggedIn: false, hasPreviousSession: false});
        });
      } else {
        Alert.alert('Invalid Email Address', 'Please Enter a valid email address');
      }
    } else {
      Alert.alert('Login Failed', 'Please Enter Username and Password');
    }
  }

  renderComponent(component) {
    if(component === "login") {
      return this.loginComponent();
    }
    if(component === "dashboard") {
      return this.dashboardComponent();
    }
  }

  loginComponent() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>
          SNAPZIO
        </Text>
        <Text style={styles.appTitle}>
          Centralized Login
        </Text>
        <View style={styles.spacer} />
        <TextInput
          onChangeText={(email) => { this.setState({email}) }}
          style={styles.loginTextBox}
          placeholder='Enter Email'
        />

        <TextInput
          onChangeText={(password) => { this.setState({password}) }}
          secureTextEntry
          style={styles.loginTextBox}
          placeholder='Enter Password'
        />

        <View style={styles.spacer} />
        <TouchableHighlight style={styles.loginButton} onPress={this.login}>
          <Text style={styles.appTitle}>
            LOGIN
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  loading() {
    return (
      <View style={styles.container}>
        <Text>LOADING...</Text>
      </View>
    );
  }

  logout() {
    app.logout();
    this.setState({isLoggedIn: false, hasPreviousSession: false});
  }

  dashboardComponent() {
    return (
      <View style={styles.dashboardContainer}>
        <Text>Welcome {this.state.username}</Text>
        {/* <TouchableHighlight style={styles.dashboardButton} onPress={this.logout}>
          <Text style={styles.appTitle}>
            LOGOUT
          </Text>
        </TouchableHighlight> */}
      </View>
    );
  }

  render() {
    let x = app.get('user') ? app.get('user').username : null;
    console.log(x);
    let display = this.state.isLoggedIn ? this.renderComponent('dashboard') : this.state && this.state.hasPreviousSession ? this.loading() : this.state && this.state.hasPreviousSession === false ? this.loginComponent() : this.loading();
    return (
       display
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  dashboardContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#00bfff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    marginTop: 10,
  },
  validationNotification: {
    color: '#b22222',
  },
  loginTextBox: {
    width: 250,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#00bfff',
    width: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dashboardButton: {
    backgroundColor: '#00bfff',
    width: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loginButtonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  spacer: {
    height: 10,
  },
  logo: {
    fontSize: 66,
    fontWeight: 'bold',
  },
});

AppRegistry.registerComponent('client', () => client);
