import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ScrollView, Text, Pressable, Image } from 'react-native';
import UserLabel from '../components/UserLabel';
import Posts from '../components/Posts';
import PostCard from '../components/PostCard';
import Styles from '../styling/Styles';

export default class FriendProfile extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            first_name: null,
            isFriend: false,
            requestSent: false,
            loading: true,
            showPostCard: false,
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                id: this.props.route.params.data.user_id,
                first_name: this.props.route.params.data.first_name,
                requestSent: false,
                isFriend: false,
                loading: false,
                showPostCard: false,
            });
            this.closePostCard = this.closePostCard.bind(this);
            this.checkFriendStatus();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async checkFriendStatus() {

        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + id + '/friends', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else if (response.status === 403) {
                throw 'Can only view the friends of yourself or your friends';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            Object.keys(responseJson).forEach((key) => {
                if(responseJson[key].user_id === this.state.id || this.state.id == id) {
                    this.setState({
                        isFriend: true,
                    })
                }
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    async sendFriendRequest() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.id + '/friends', {
            method: 'POST',
            headers: {
                'X-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 201) {
                this.setState({
                    requestSent: true,
                });
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else if (response.status === 403) {
                alert('A friend request has already been sent!');
                this.setState({
                    requestSent: true,
                });
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    closePostCard() {
        this.setState({
            showPostCard: false,
        })
    }

    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            if(this.state.isFriend) {
                return (
                    <View key={this.state.id} style={Styles.container}>
                        {this.state.showPostCard &&
                            <PostCard closePostCard={this.closePostCard} target_wall={this.state.id}/>
                        }
                        <View style={Styles.header}>
                            <UserLabel
                                userId={this.state.id}
                            />
                            <Pressable
                                style={Styles.newPostBtn}
                                onPress={() => this.setState({showPostCard: true})}
                            >
                                <Image
                                    source={require('../assets/icons/png/cross.png')}
                                    style={{
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            </Pressable>
                        </View>
                        <Text style={[Styles.title, {marginLeft: '5%', marginRight: '5%', paddingBottom: 15}]}>{this.state.first_name}'s Wall</Text>
                        <ScrollView style={[Styles.container, {paddingTop: 0, marginBottom: 100}]}>
                            <Posts targetID={this.state.id}/>
                        </ScrollView>
                    </View>
                );
            } else {
                return (
                    <View key={this.state.id} style={Styles.container}>
                        <View style={Styles.header}>
                            <UserLabel
                                userId={this.state.id}
                            />
                            {this.state.requestSent && 
                                <View style={[Styles.actionButtonThin, {marginLeft: 'auto', marginRight: 15, backgroundColor: '#79CAD6'}]}>
                                    <Text style={Styles.btnText}>Request Sent</Text>
                                </View>
                            }
                            {!this.state.requestSent &&
                                <Pressable 
                                    style={[
                                        Styles.actionButtonThin, {
                                            marginLeft: 'auto',
                                            marginRight: 15,
                                            backgroundColor: '#82D281'
                                        }]}
                                    onPress={() => this.sendFriendRequest()}
                                >
                                    <Text style={Styles.btnText}>Add Friend</Text>
                                </Pressable>
                            }
                        </View>
                        <Text style={[Styles.title, {marginLeft: '5%', marginRight: '5%', paddingBottom: 15}]}>{this.state.first_name}'s Wall</Text>
                        <View style={Styles.container90}>
                            <Text>You must be friends with this person in order to see their posts!</Text>
                        </View>
                    </View>
                );
            }
        }
    }
}
