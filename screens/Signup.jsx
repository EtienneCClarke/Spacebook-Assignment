import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ScrollView, Text, Pressable, Image, TextInput } from 'react-native';
import styles from '../styling/Styles';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            validatePassword: '',
        };
    }

    validate() {

        // Check for empty inputs
        if(
            this.state.first_name == '' || this.state.first_name == null ||
            this.state.last_name == '' || this.state.last_name == null ||
            this.state.email == '' || this.state.email == null ||
            this.state.password == '' || this.state.password == null ||
            this.state.validatePassword == '' || this.state.validatePassword == null
        ) { return false; }

        // Check email is valid
        const emailRegex = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        if( !emailRegex.test(this.state.email.toLowerCase()) ) { return false; }

        // Check if passwords match
        if( this.state.password != this.state.validatePassword ) { return false; }

        return true;

    }

    register = async () => {

        if(this.validate()) {
            return fetch('http://192.168.1.73:3333/api/1.0.0/user', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state),
            })
            .then((response) => {
                if (response.status === 201){
                    return response.json();
                } else if (response.status === 400){
                    throw 'Invalid email or password';
                }
                throw 'Something went wrong';
            })
            .then((responseJson) => {
                console.log(responseJson);
                alert('Successfully registered!');
                this.props.navigation.navigate('Login');
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            alert('Looks like something went wrong! \n\nCheck form is correct and passwords match.')
        }
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.signupScroll}>
                <View style={styles.container}>

                    <Image
                        style={styles.logo}
                        source={require('../assets/icons/png/logo.png')}
                    />

                    <Text style={[styles.title, { marginTop: 15 }]} >Sign Up!</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            placeholder="John"
                            onChangeText={(first_name) => this.setState({ first_name })}
                            value={this.state.first_name}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Surname</Text>
                        <TextInput
                            placeholder="Smith"
                            onChangeText={(last_name) => this.setState({ last_name })}
                            value={this.state.last_name}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="johnsmith@email.com"
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Hello123"
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Hello123"
                            onChangeText={(validatePassword) => this.setState({ validatePassword })}
                            value={this.state.validatePassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <Pressable
                        style={[styles.btnPrimary, { marginTop: 30}]}
                        onPress={() => this.register()}
                    >
                        <Text style={styles.btnText}>Register</Text>
                    </Pressable>

                    <Text style={[styles.labelLight, { marginTop: 60 }]}>Already have an account? Login now!</Text>
                    
                    <Pressable
                        style={[styles.btnSecondary, { marginTop: 30}]}
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text style={styles.btnText}>Login</Text>
                    </Pressable>

                </View>
            </ScrollView>
        );
    }
}
