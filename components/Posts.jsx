import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import {
    View,
    Text,
    Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import Post from './Post';
import Styles from '../styling/Styles';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            id: null,
            limit: 20,
            posts: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.getData().then(() => {
            this.setState({
                limit: 20,
            });
        });
    }

    async getData() {
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.targetID + '/post', {
            headers: {
                'Content-Type': 'application/json',
                'x-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 403) {
                throw new Error('Can only view the posts of yourself or your friends');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            }
            throw new Error('Server Error');
        }).then((responseJson) => {
            const arr = [];
            Object.keys(responseJson).forEach((key) => {
                arr.push(responseJson[key]);
            });
            this.setState({
                id,
                posts: arr,
                loading: false,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    displayPosts() {
        // Iterate through each post stored in state and pass information to a Post component
        return this.state.posts.map((post) => (
            <Post
                key={post.post_id}
                post_id={post.post_id}
                viewer_id={this.state.id}
                owner_id={this.props.targetID}
                author_id={post.author.user_id}
                author_first_name={post.author.first_name}
                author_last_name={post.author.last_name}
                body={post.text}
                likes={post.numLikes}
                date={post.timestamp}
            />
        ));
    }

    needLoadButton() {
        if (this.state.posts.length == this.state.limit) {
            return true;
        } else {
            return false;
        }
    }

    loadMore() {
        this.setState((prev) => ({ limit: prev.limit + 20 }));
        this.getData();
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={[Styles.container, Styles.center]}>
                    <Text>Loading...</Text>
                </View>
            );
        }
        return (
            <View style={Styles.postWall}>
                {this.displayPosts()}
                {this.needLoadButton() && (
                    <Pressable
                        accessible
                        accessibilityLabel="Load More"
                        accessibilityHint="Loads up to 20 more posts"
                        style={Styles.loadMoreBtn}
                        onPress={() => this.loadMore()}
                    >
                        <Text style={Styles.loadMoreText}>Load More</Text>
                    </Pressable>
                )}
            </View>
        );
    }
}

export default function (props) {
    const { navigation } = useNavigation();
    return <Posts {...props} navigation={navigation} />;
}

Posts.propTypes = {
    targetID: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};
