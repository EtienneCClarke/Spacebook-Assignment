import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Styles from '../styling/Styles';

class Post extends Component {

    constructor() {
        super();
        this.state = {
            liked: false,
            likes: null,
        };
    }

    componentDidMount() {
        this.checkLikeStatus();
        this.setState({
            likes: this.props.likes,
            ogLikes: this.props.likes,
        })
    }

    async checkLikeStatus() {

        const token = await AsyncStorage.getItem('@session_token');

        if(this.props.author_id != this.props.viewer_id) {
            return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.props.author_id + '/post/' + this.props.post_id + '/like', {
            method: 'POST',
            headers: {
                'x-Authorization': token,
            }
            })
            .then((response) => {
                if(response.status == 200) {
                    this.unlikePost();
                }
                else {
                    this.setState({
                        liked: true,
                    })
                }
            });
        }

    }

    toggleLike() {

        if(this.props.author_id == this.props.viewer_id) {
            alert('Cannot like your own posts!')
        } else {
            if(this.state.liked) { this.unlikePost(); }
            else { this.likePost(); }
        }

    }

    async likePost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.props.author_id + '/post/' + this.props.post_id + '/like', {
            method: 'POST',
            headers: {
                'x-Authorization': token,
            }
        })
        .then((response) => {
            if(response.status === 200) {
                this.setState({
                    liked: true,
                    likes: this.state.likes + 1,
                })
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else if (response.status === 403) {
                throw 'Already liked post';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Something went wrong';
            }
        });
    }

    async unlikePost() {

        const token = await AsyncStorage.getItem('@session_token');
        fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.props.author_id + '/post/' + this.props.post_id + '/like', {
            method: 'DELETE',
            headers: {
                'x-Authorization': token,
            },
        })
        .then((response) => {
            if(response.status === 200) {
                let diff = 1;
                if(this.state.likes == 0) {
                    diff = 0;
                }
                this.setState({
                    liked: false,
                    likes: this.state.likes - diff,
                })
            } else if (response.status === 401) {
                return 'Unauthorised';
            } else if (response.status === 403) {
                return 'You have not liked this post already';
            } else if (response.status === 404) {
                return 'Not Found';
            } else {
                return 'Something went wrong';
            }
        })

    }

    convertDate() {

        let date = new Date(this.props.date);

        let day = date.getDay();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return(day + '/' + month + '/' + year);
    }

    render() {
        return(
            <View style={Styles.post}>
                <Pressable
                    onPress={() => this.props.navigation.navigate('SinglePost', { 
                        data: {
                            post_id: this.props.post_id,
                            viewer_id: this.props.viewer_id,
                            author_id: this.props.author_id,
                            first_name: this.props.author_first_name,
                            last_name: this.props.author_last_name,
                            body: this.props.body,
                            date: this.props.date,
                            likes: this.props.likes,
                        } 
                    })}
                    style={Styles.postBubble}
                >
                    <Text style={Styles.postText}>{this.props.body}</Text>
                </Pressable>
                <View style={Styles.postDetails}>
                    <View style={Styles.postLikes}>
                        <Pressable
                            style={Styles.postLikeBtn}
                            onPress={() => this.toggleLike()}
                        >
                            <Image 
                                source={require('../assets/icons/png/like.png')}
                                style={[
                                    Styles.postLike, 
                                    {
                                        tintColor: this.state.liked ? '#FF8F8F' : '#C4C4C4'
                                    }
                                ]}
                            />
                            <Text style={[Styles.postSubText, { marginLeft: 10 }]}>
                                {this.state.likes}
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={Styles.postSubText}>
                        { this.convertDate() }
                    </Text>
                    <Image
                        source={require('../assets/icons/png/tail.png')}
                        style={Styles.bubbleTail}
                    />
                </View>
            </View>
        );
    }
}

export default function(props) {
    const navigation = useNavigation();

    return <Post {...props} navigation={navigation}/>
}