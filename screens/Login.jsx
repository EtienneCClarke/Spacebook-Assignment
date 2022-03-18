import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import Styles from '../styling/Styles';

export default class Login extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            email: '',
            password: '',
            error: '',
            isValid: true,
        };
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn() {
        const token = AsyncStorage.getItem('@session_token');
        const id = AsyncStorage.getItem('@session_id');
        if (token === null) {
            this.props.navigation.navigate('Login');
        } else {
            fetch('http://192.168.1.73:3333/api/1.0.0/user/' + id, {
                method: 'GET',
                headers: {
                    'X-Authorization': token,
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    this.props.navigation.navigate('Home');
                } else {
                    this.props.navigation.navigate('Login');
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    async login() {
        return fetch('http://192.168.1.73:3333/api/1.0.0/login', {
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
            await AsyncStorage.setItem('@session_token', responseJson.token);
            await AsyncStorage.setItem('@session_id', responseJson.id.toString());
            let drafts = await AsyncStorage.getItem('@drafts_' + responseJson.id);
            if(drafts == null) {
                await AsyncStorage.setItem('@drafts_' + responseJson.id, JSON.stringify({0: { 'text': null }}));
            }
            this.props.navigation.navigate('Home');
        })
        .catch((error) => {
            alert(error);
        });
    };

    render() {
        return (
            <View style={[Styles.container, Styles.center]}>
                <Image
                    accessible={true}
                    accessibilityLabel="Welcome to Spacebook!"
                    style={Styles.logo}
                    source={require('../assets/icons/png/logo.png')}
                />
                <Text style={[
                    Styles.title,
                    { marginTop: 15 }]}
                >
                    Login!
                </Text>
                <Text style={Styles.errorMsg}>
                    { !this.state.isValid ? 'Something went wrong! Check details and try again' : '' }
                </Text>
                <View
                    accessible={true}
                    accessibilityLabel="Enter Email"
                    style={Styles.inputContainer}
                >
                    <Text style={Styles.label}>Email</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="johnsmith@email.com"
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        style={Styles.input}
                    />
                </View>
                <View
                    accessible={true}
                    accessibilityLabel="Enter Password"
                    style={Styles.inputContainer}
                >
                    <Text style={Styles.label}>Password</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="Hello123"
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        secureTextEntry
                        style={Styles.input}
                    />
                </View>
                <Pressable
                    accessible={true}
                    accessibilityLabel="Login to account"
                    style={[Styles.btnPrimary, { marginTop: 30}]}
                    onPress={() => this.login()}
                >
                    <Text style={Styles.btnText}>Login</Text>
                </Pressable>
                <Text style={[Styles.labelLight, { marginTop: 60 }]}>Dont have an account? Register now!</Text>
                <Pressable
                    accessible={true}
                    accessibilityLabel="Register"
                    accessibilityHint="Go to registration form"
                    style={[Styles.btnSecondary, { marginTop: 30}]}
                    onPress={() => this.props.navigation.navigate('Signup')}
                >
                    <Text style={Styles.btnText}>Register</Text>
                </Pressable>
            </View>
        );
    }
}
