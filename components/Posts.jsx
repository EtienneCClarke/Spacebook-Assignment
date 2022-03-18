import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, Pressable } from 'react-native';
import Styles from '../styling/Styles';
import Post from './Post';

class Posts extends Component {

    constructor() {
        super();

        this.state = {
            id: null,
            limit: 20,
            posts: [],
            loading: true,
        }
    }

    componentDidMount() {
        this.getData().then(() => {
            if(this.state.id === this.props.targetID) {
                this.interval = setInterval(() => this.getData(), 5000);
            }
            this.setState({
                limit: 20,
            })
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getData() {

        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.props.targetID + '/post', {
            headers: {
                'Content-Type': 'application/json',
                'x-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else  if (response.status === 403) {
                throw 'Can only view the posts of yourself or your friends';
            } else  if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Server Error'
            }
        })
        .then((responseJson) => {
            let arr = [];
            Object.keys(responseJson).forEach((key) => {
                arr.push(responseJson[key]);
            });
            this.setState({
                id: id,
                posts: arr,
                loading: false,
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    displayPosts() {

        return this.state.posts.map((post) => {
            return (
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
            );
        });
    }

    needLoadButton() {
        if(this.state.posts.length == this.state.limit) {
            return true;
        } else {
            return false;
        }
    }

    loadMore() {
        this.setState({limit: this.state.limit + 20});
        this.getData();
    }

    render() {
        if(this.state.loading) {
            return (
                <View style={[Styles.container, Styles.center]}>
                    <Text>Loading...</Text>
                </View>
            );
        } else {
            return(
                <View style={Styles.postWall}>
                    {this.displayPosts()}
                    {this.needLoadButton() && 
                        <Pressable
                            accessible={true}
                            accessibilityLabel="Load More"
                            accessibilityHint="Loads up to 20 more posts"
                            style={Styles.loadMoreBtn}
                            onPress={() => this.loadMore()}
                        >
                            <Text style={Styles.loadMoreText}>Load More</Text> 
                        </Pressable>
                    } 
                </View>
            );
        }
    }
}

export default function(props) {
    const navigation = useNavigation();
    return <Posts {...props} navigation={navigation}/>
}