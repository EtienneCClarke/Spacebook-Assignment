import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Image, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import Styles from '../styling/Styles';

export default class DeclineFriend extends Component {
    constructor() {
        super();
        this.state = {
            target_id: null,
        };
    }

    componentDidMount() {
        this.setState({
            target_id: this.props.user_id,
        });
    }

    async DeclineFriend() {
        const token = await AsyncStorage.getItem('@session_token');
        fetch('http://192.168.1.73:3333/api/1.0.0/friendrequests/' + this.state.target_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                this.props.updateParent();
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            } else {
                throw new Error('Server Error');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Pressable
                accessible
                accessibilityLabel="Decline"
                accessibilityHint="Declines friend request from user"
                style={Styles.btnDecline}
                onPress={() => this.DeclineFriend()}
            >
                <Image
                    source={require('../assets/icons/png/xSmall.png')}
                    style={{
                        width: 20,
                        height: 20,
                    }}
                />
            </Pressable>
        );
    }
}

DeclineFriend.propTypes = {
    user_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    updateParent: PropTypes.func.isRequired,
};
