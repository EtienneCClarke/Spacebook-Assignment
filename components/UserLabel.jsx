import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Styles from '../styling/Styles';

export default class UserLabel extends Component {
    constructor() {
        super();
        this.state = {
            user_id: null,
            first_name: null,
            last_name: null,
            photo: null,
        };
    }

    componentDidMount() {
        this.getPhoto();
        this.getData();
        this.setState({
            user_id: this.props.userId,
        });
    }

    async getPhoto() {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.user_id + '/photo', {
            headers: {
                Accept: 'image/jpeg',
                'x-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.blob();
            }
            throw new Error('Something went wrong');
        }).then((responseBlob) => {
            if (Platform.OS === 'android') {
                const fileRI = new FileReader();
                fileRI.readAsDataURL(responseBlob);
                fileRI.onload = () => {
                    this.setState({
                        photo: fileRI.result,
                    });
                };
            } else {
                this.setState({
                    photo: URL.createObjectURL(responseBlob),
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    async getData() {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.user_id, {
            headers: {
                'x-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            }
            throw new Error('Something went wrong');
        }).then((responseJson) => {
            this.setState({
                first_name: responseJson.first_name,
                last_name: responseJson.last_name,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <View style={Styles.userLabel}>
                <Image
                    accessibilityLabel="Your Profile Picture"
                    source={{
                        uri: this.state.photo,
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                />
                <Text style={Styles.userLabelText}>{this.state.first_name + ' ' + this.state.last_name}</Text>
            </View>
        );
    }
}

UserLabel.propTypes = {
    userId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};
