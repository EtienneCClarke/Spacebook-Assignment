import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Pressable } from 'react-native';

import UserLabel from '../components/UserLabel';
import Styles from '../styling/Styles';

export default class Search extends Component {

    constructor() {
        super();
        this.state = {
            user_id: null,
            loading: true,
            searchQuery: '',
            searchResults: [],
            displayResults: false,
            limit: null,
        }

    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('@session_id').then((id) => {
                this.setState({
                    user_id: id,
                    loading: false,
                    searchQuery: '',
                    searchResults: [],
                    displayResults: false,
                    limit: 20,
                });
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async search() {
        
        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/search?q=' + this.state.searchQuery + '&limit=' + this.state.limit, {
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
            let arr = [];
            Object.keys(responseJson).forEach((key) => {
                arr.push(responseJson[key]);
            })
            this.setState({
                searchResults: arr,
                displayResults: true,
            })
        })
        .catch((error) => {
            console.log(error)
        })

    }

    needLoadButton() {
        if(this.state.searchResults.length == this.state.limit) {
            return true;
        } else {
            return false;
        }
    }

    loadMore() {
        this.setState({limit: this.state.limit + 20});
        this.search();
    }

    getResults() {
        if(this.state.searchResults.length == 0) {
            return(
                <View style={[Styles.container, Styles.center]}><Text>No results...</Text></View>
            );
        } else {
            return this.state.searchResults.map((friend, i) => {
                return(
                    <Pressable
                        key={friend.user_id}
                        style={[Styles.friendLabel,
                            i === 0 ? Styles.firstFriendLabel : null,
                        ]}
                        onPress={() => this.props.navigation.navigate('FriendProfile', {
                            data: {
                                user_id: friend.user_id,
                                first_name: friend.user_givenname,
                            }
                        })}
                    >
                        <UserLabel
                            key={friend.user_id}
                            userId={friend.user_id}
                        />
                    </Pressable>
                );
            });
        }
    }
    
    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            return (
                <ScrollView style={[Styles.container]}>
                    <View style={Styles.header}>
                        <UserLabel
                            userId={this.state.user_id}
                        />
                    </View>
                    <Text style={[Styles.title, {marginLeft: '5%', marginRight: '5%', paddingBottom: 15}]}>
                        Search for people you may know!
                    </Text>
                    <View style={[Styles.container90, {flexDirection: 'row', paddingBottom: 10}]}>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="John Smith..."
                            onChangeText={(searchQuery) => this.setState({ searchQuery })}
                            value={this.state.searchQuery}
                            style={[Styles.input, {flexShrink: 1}]}
                        />
                        <Pressable
                            style={[Styles.actionButton, Styles.searchBtn]}
                            onPress={() => this.search()}
                        >
                            <Text style={Styles.btnText}>GO</Text>
                        </Pressable>
                    </View>
                    {
                        this.state.displayResults &&
                        <View style={[Styles.search, { marginBottom: 20}]}>
                            <Text style={[Styles.title, {marginTop: 15, marginLeft: '5%', marginRight: '5%', paddingBottom: 15}]}>
                                Results
                            </Text>
                            <View style={[Styles.container90, {paddingBottom: 105}]}>
                                {this.getResults()}
                                {this.needLoadButton() &&
                                    <Pressable style={Styles.loadMoreBtn} onPress={() => this.loadMore()}>
                                        <Text style={Styles.loadMoreText}>Load More</Text>
                                    </Pressable>
                                }
                            </View>
                        </View>
                    }
                    
                </ScrollView>
            );
        }
    }
}
