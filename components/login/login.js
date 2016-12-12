import React, { Component } from 'react';

export default class login extends Component {
  render() {
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
          // onChangeText={(email) => { this.setState({email}) }}
          style={styles.loginTextBox}
          placeholder='Enter Email'
        />
        <TextInput
          // onChangeText={(password) => { this.setState({password}) }}
          secureTextEntry
          style={styles.loginTextBox}
          placeholder='Enter Password'
        />
        <TouchableHighlight style={styles.loginButton} onPress={this.login}>
          <Text style={styles.appTitle}>
            LOGIN
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    loginTextBox: {
      width: 250,
      fontSize: 16,
    },
    loginButton: {
      backgroundColor: '#1E90FF',
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
}
