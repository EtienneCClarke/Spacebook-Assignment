import React, { Component } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import styles from '../styling/Styles';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    login = async () => {
        return fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => {
            if (response.status === 200){
                return response.json();
            } else if (response.status === 400){
                throw 'Invalid email or password';
            }
            throw 'Something went wrong';
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token);
            this.props.navigation.navigate('Home');
        })
        .catch((error) => {
            console.log(error);
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icons/png/logo.png')}
                />
                <Text style={[styles.title, { marginTop: 15 }]} >Login!</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="johnsmith@email.com"
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Hello123"
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        secureTextEntry
                        style={styles.input}
                    />
                </View>
                <Pressable
                    style={[styles.btnPrimary, { marginTop: 30}]}
                    onPress={() => alert('login')}
                >
                    <Text style={styles.btnText}>Login</Text>
                </Pressable>
                <Text style={[styles.labelLight, { marginTop: 60 }]}>Dont have an account? Register now!</Text>
                <Pressable
                    style={[styles.btnSecondary, { marginTop: 30}]}
                    onPress={() => alert('register')}
                >
                    <Text style={styles.btnText}>Register</Text>
                </Pressable>
            </View>
        );
    }
}

export default Login;
