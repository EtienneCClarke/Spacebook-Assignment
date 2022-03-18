import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
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
            reload: 0,
        };
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('@session_id').then((id) => {
                this.setState((prev) => ({
                    user_id: id,
                    loading: false,
                    searchQuery: '',
                    searchResults: [],
                    displayResults: false,
                    limit: 20,
                    reload: prev.reload + 1,
                }));
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getResults() {
        if (this.state.searchResults.length == 0) {
            return (
                <View style={[Styles.container, Styles.center]}><Text>No results...</Text></View>
            );
        }
        return this.state.searchResults.map((friend, i) => (
            <Pressable
                accessible
                accessibilityLabel="Go to wall"
                accessibilityHint="Goes to selected users wall"
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

    loadMore() {
        this.setState((prev) => ({ limit: prev.limit + 20 }));
        this.search();
    }

    needLoadButton() {
        if (this.state.searchResults.length == this.state.limit) {
            return true;
        }
        return false;
    }

    async search() {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch('http://localhost:3333/api/1.0.0/search?q='
                    + this.state.searchQuery
                    + '&limit=' + this.state.limit, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorized');
            } else if (response.status === 403) {
                throw new Error('Can only view the friends of yourself or your friends');
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
                searchResults: arr,
                displayResults: true,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        if (this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        }
        return (
            <ScrollView style={[Styles.container]}>
                <View style={Styles.header}>
                    <UserLabel
                        key={this.state.reload}
                        userId={this.state.user_id}
                    />
                </View>
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
                    Search for people you may know!
                </Text>
                <View
                    style={[
                        Styles.container90,
                        {
                            flexDirection: 'row',
                            paddingBottom: 10,
                        },
                    ]}
                >
                    <TextInput
                        accessible
                        accessibilityLabel="Search Input"
                        accessibilityHint="Type the name of who you want to find"
                        accessibilityRole="search"
                        autoCapitalize="none"
                        placeholder="John Smith..."
                        onChangeText={(searchQuery) => this.setState({ searchQuery })}
                        value={this.state.searchQuery}
                        style={[Styles.input, { flexShrink: 1 }]}
                    />
                    <Pressable
                        accessible
                        accessibilityLabel="Confirm Search"
                        accessibilityHint="Searches for the person you entered into the search bar"
                        style={[Styles.actionButton, Styles.searchBtn]}
                        onPress={() => this.search()}
                    >
                        <Text style={Styles.btnText}>GO</Text>
                    </Pressable>
                </View>
                { this.state.displayResults && (
                    <View style={[Styles.search, { marginBottom: 20 }]}>
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
                            Results
                        </Text>
                        <View
                            accessible
                            accessibilityLabel="Search Results"
                            style={[
                                Styles.container90,
                                { paddingBottom: 105 },
                            ]}
                        >
                            { this.getResults() }
                            { this.needLoadButton() && (
                                <Pressable style={Styles.loadMoreBtn} onPress={() => this.loadMore()}>
                                    <Text style={Styles.loadMoreText}>Load More</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        );
    }
}

Search.propTypes = {
    navigation: PropTypes.shape({
        addListener: PropTypes.func,
        navigate: PropTypes.func,
    }).isRequired,
};
