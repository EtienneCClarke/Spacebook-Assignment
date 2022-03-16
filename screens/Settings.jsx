import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Image, TextInput, ScrollView, Pressable } from 'react-native';
import Styles from '../styling/Styles';

export default class Settings extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            edited: false,
            user_id: null,
            first_name: null,
            last_name: null,
            email: null,
            photo: null,
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.setState({
                edited: false,
            });
            this.getData().then(() => {
                this.getPhoto();
            });
        });
    }

    async checkLoggedIn() {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    }

    async logout() {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://192.168.1.73:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate('Login');
            }else if(response.status === 401){
                this.props.navigation.navigate('Login');
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    async getData() {

        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Authorization': token,
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                this.navigation.navigate('Login');
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                user_id: id,
                first_name: responseJson.first_name,
                last_name: responseJson.last_name,
                email: responseJson.email,
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    async getPhoto() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.user_id + '/photo', {
            headers: {
                'Accept': 'image/jpeg',
                'x-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 200) {
                return response.blob();
            } else {
                throw 'Something went wrong';
            }
        })
        .then((responseBlob) => {
            if(Platform.OS === 'android') {
                const fileRI = new FileReader();
                fileRI.readAsDataURL(responseBlob);
                fileRI.onload = () => {
                    this.setState({
                        photo: fileRI.result,
                        loading: false,
                    })
                }
            } else {
                this.setState({
                    photo: URL.createObjectURL(responseBlob),
                    loading: false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    async updateData() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.user_id, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => {
            if(response.status === 200) {
                alert('Successfully updated details!\n\nPlease note: changes may not appear fully until app restarts');
                this.setState({
                    edited: false,
                })
            } else if (response.status === 400) {
                throw 'Bad Request';
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else if (response.status === 403) {
                throw 'Forbidden';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Something went wrong';
            }
        })
    }

    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            return (
                <ScrollView contentContainerStyle={[Styles.container, { alignItems: 'center', marginBottom: 105}]}>
                    <Pressable 
                        style={Styles.btnLogout}
                        onPress={() => this.logout()}
                    >
                        <Text style={Styles.btnTextSmall}>LOGOUT</Text>
                    </Pressable>
                    <Image
                        source={{
                            uri: this.state.photo
                        }}
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                            backgroundColor: '#C4C4C4',
                            marginTop: 30,
                        }}
                    />
                    <Text style={[Styles.label, { marginTop: 10 }]}>{this.state.first_name + ' ' + this.state.last_name}</Text>
                    <Text style={[Styles.labelLight, {marginTop: 40}]}>Firstname</Text>
                    <TextInput
                        placeholder="John"
                        onChangeText={(first_name) => this.setState({ first_name: first_name, edited: true })}
                        value={this.state.first_name}
                        style={[Styles.input, {width: '90%'}]}
                    />
                    <Text style={[Styles.labelLight, {marginTop: 30}]}>Surname</Text>
                    <TextInput
                        placeholder="Smith"
                        onChangeText={(last_name) => this.setState({ last_name: last_name, edited: true })}
                        value={this.state.last_name}
                        style={[Styles.input, {width: '90%'}]}
                    />
                    <Text style={[Styles.labelLight, {marginTop: 30}]}>Email</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="johnsmith@email.com"
                        onChangeText={(email) => this.setState({ email: email, edited: true })}
                        value={this.state.email}
                        style={[Styles.input, {width: '90%'}]}
                    />
                    {this.state.edited &&
                        <Pressable 
                            style={[
                                Styles.btnPrimary,
                                {
                                    marginTop: 30,
                                }
                            ]}
                            onPress={() => this.updateData()}
                        >
                            <Text style={Styles.btnText}>Save</Text>
                        </Pressable>
                    }
                </ScrollView>
            );
        }
    }
}
