import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import AcceptFriend from '../components/AcceptFriend';
import DeclineFriend from '../components/DeclineFriend';
import UserLabel from '../components/UserLabel';
import Styles from '../styling/Styles';

export default class Friends extends Component {
    constructor() {
        super();
        this.state = {
            user_id: null,
            pendingRequests: false,
            requests: [],
            friends: [],
        };
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('@session_id').then((id) => {
                this.setState({
                    user_id: id,
                });
                this.getData();
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getData() {
        const token = await AsyncStorage.getItem('@session_token');

        fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/friends', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 403) {
                throw new Error('Can only view the friends of yourself or friends');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            } else {
                throw new Error('Something went wrong');
            }
        }).then((responseJson) => {
            const arr = [];
            Object.keys(responseJson).forEach((key) => {
                arr.push(responseJson[key]);
            });
            this.setState({
                friends: arr,
            });
        }).catch((error) => {
            console.log(error);
        });

        fetch('http://localhost:3333/api/1.0.0/friendrequests', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            }
            throw new Error('Something went wrong');
        }).then((responseJson) => {
            const arr = [];
            Object.keys(responseJson).forEach((key) => {
                arr.push(responseJson[key]);
            });
            this.setState({
                requests: arr,
                pendingRequests: arr.length > 0 ? true : false,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    updateState() {
        this.getData();
    }

    displayFriends() {
        if (this.state.friends.length != 0) {
            return this.state.friends.map((friend, i) => (
                <Pressable
                    accessible
                    accessibilityLabel="Visit Friend"
                    accessibilityHint="Navigates to their profile page where you can find their posts"
                    key={friend.user_id}
                    style={[Styles.friendLabel,
                        i === 0 ? Styles.firstFriendLabel : null,
                    ]}
                    onPress={() => this.props.navigation.navigate('FriendProfile', {
                        data: {
                            user_id: friend.user_id,
                            first_name: friend.user_givenname,
                        },
                    })}
                >
                    <UserLabel
                        key={friend.user_id}
                        userId={friend.user_id}
                    />
                </Pressable>
            ));
        }
        return null;
    }

    displayRequests() {
        return this.state.requests.map((request, i) => (
            <View
                accessible
                key={request.user_id}
                style={[Styles.friendLabel,
                    i === 0 ? Styles.firstFriendLabel : null,
                    {
                        flexDirection: 'row',
                    },
                ]}
            >
                <Pressable
                    onPress={() => this.props.navigation.navigate('FriendProfile', {
                        data: {
                            user_id: request.user_id,
                            first_name: request.first_name,
                        },
                    })}
                >
                    <UserLabel
                        key={request.user_id}
                        userId={request.user_id}
                    />
                </Pressable>
                <AcceptFriend
                    updateParent={this.updateState}
                    user_id={request.user_id}
                />
                <DeclineFriend
                    updateParent={this.updateState}
                    user_id={request.user_id}
                />
            </View>
        ));
    }

    render() {
        return (
            <ScrollView
                accessible
                style={[
                    Styles.container,
                    { marginTop: 35 },
                ]}
            >
                { this.state.pendingRequests && (
                    <View>
                        <Text
                            style={[
                                Styles.title,
                                {
                                    marginLeft: '5%',
                                    marginRight: '5%',
                                    paddingBottom: 15,
                                },
                            ]}
                        >
                            Friend Requests
                        </Text>
                        <View style={Styles.container90}>
                            { this.displayRequests() }
                        </View>
                    </View>
                )}
                <Text
                    style={[
                        Styles.title,
                        {
                            marginTop: 15,
                            marginLeft: '5%',
                            marginRight: '5%',
                            paddingBottom: 15,
                        },
                    ]}
                >
                    Your Friends
                </Text>
                <View style={[Styles.container90, { paddingBottom: 130 }]}>
                    { this.displayFriends() }
                </View>
            </ScrollView>
        );
    }
}

Friends.propTypes = {
    navigation: PropTypes.shape({
        addListener: PropTypes.func,
        navigate: PropTypes.func,
    }).isRequired,
};
