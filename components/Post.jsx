import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
        });
    }

    async checkLikeStatus() {
        const token = await AsyncStorage.getItem('@session_token');
        if (this.props.author_id != this.props.viewer_id) {
            return fetch('http://localhost:3333/api/1.0.0/user/'
                + this.props.author_id
                + '/post/'
                + this.props.post_id
                + '/like', {
                method: 'POST',
                headers: {
                    'x-Authorization': token,
                },
            }).then((response) => {
                if (response.status == 200) {
                    this.unlikePost();
                } else if (this.props.owner_id != this.props.viewer_id) {
                    this.setState({
                        liked: false,
                    });
                } else {
                    this.setState({
                        liked: true,
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        return null;
    }

    toggleLike() {
        if (this.props.author_id == this.props.viewer_id) {
            alert('Cannot like your own posts!');
        } else if (this.state.liked) {
            this.unlikePost();
        } else {
            this.likePost();
        }
    }

    async likePost() {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch('http://localhost:3333/api/1.0.0/user/'
            + this.props.author_id
            + '/post/'
            + this.props.post_id
            + '/like', {
            method: 'POST',
            headers: {
                'x-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                this.setState((prev) => ({
                    liked: true,
                    likes: prev.likes + 1,
                }));
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 403) {
                throw new Error('Already liked post');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            } else {
                throw new Error('Something went wrong');
            }
        });
    }

    async unlikePost() {
        const token = await AsyncStorage.getItem('@session_token');
        fetch('http://localhost:3333/api/1.0.0/user/'
            + this.props.author_id
            + '/post/'
            + this.props.post_id
            + '/like', {
            method: 'DELETE',
            headers: {
                'x-Authorization': token,
            },
        }).then((response) => {
            if (response.status === 200) {
                let diff = 1;
                if (this.state.likes == 0) {
                    diff = 0;
                }
                this.setState((prev) => ({
                    liked: false,
                    likes: prev.likes - diff,
                }));
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 403) {
                throw new Error('You have not liked this post already');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            } else {
                throw new Error('Something went wrong');
            }
        });
    }

    convertDate() {
        let date = new Date(this.props.date);
        date = format(date, 'dd/LL/yy');
        return date;
    }

    render() {
        return (
            <View style={Styles.post}>
                <Pressable
                    accessible
                    accessibilityLabel="Manage Post"
                    accessibilityHint="If you want to edit or delete post click this"
                    onPress={() => this.props.navigation.navigate('SinglePost', {
                        data: {
                            post_id: this.props.post_id,
                            viewer_id: this.props.viewer_id,
                            author_id: this.props.author_id,
                            owner_id: this.props.owner_id,
                        },
                    })}
                    style={Styles.postBubble}
                >
                    <Text style={Styles.postText}>{this.props.body}</Text>
                </Pressable>
                <View style={Styles.postDetails}>
                    <View style={Styles.postLikes}>
                        <Pressable
                            accessible
                            accessibilityLabel="Like"
                            accessibilityHint="Toggles whether you like the post"
                            style={Styles.postLikeBtn}
                            onPress={() => this.toggleLike()}
                        >
                            <Image
                                source={require('../assets/icons/png/like.png')}
                                style={[
                                    Styles.postLike,
                                    {
                                        tintColor: this.state.liked ? '#FF8F8F' : '#C4C4C4',
                                    },
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

export default function (props) {
    const navigation = useNavigation();
    return <Post {...props} navigation={navigation} />;
}

Post.propTypes = {
    post_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    viewer_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    owner_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    author_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    body: PropTypes.string.isRequired,
    likes: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    date: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }).isRequired,
};
