import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Image, Pressable } from 'react-native';
import Styles from '../styling/Styles';

export default class AcceptFriend extends Component {

    constructor() {
        super();
        this.state = {
            target_id: null,
        }
    }

    componentDidMount() {
        this.setState({
            target_id: this.props.user_id,
        })
    }

    async AcceptFriend() {

        const token = await AsyncStorage.getItem('@session_token');

        fetch('http://192.168.1.73:3333/api/1.0.0/friendrequests/' + this.state.target_id, {
            method: 'POST',
            headers: {
                'X-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 200) {
                this.props.updateParent();
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Server Error';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return(
            <Pressable
                accessible={true}
                accessibilityLabel="Accept"
                accessibilityHint="Accepts friend request from user"
                style={Styles.btnAccept}
                onPress={() => this.AcceptFriend()}
            >
                <Image
                    source={require('../assets/icons/png/tick.png')}
                    style={{
                        width: 23,
                        height: 17,
                    }}
                />
            </Pressable>
        );
    }
}