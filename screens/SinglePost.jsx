import React, { Component } from 'react';
import { View, Text, TextInput, Image, Pressable, Alert } from 'react-native';
import Styles from '../styling/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SinglePost extends Component {

    constructor() {
        super();
        this.state = {
            liked: false,
            isEdited: false,
            viewer_id: 0,
            post_id: 0,
            text: '',
            timestamp: '',
            author: {
                user_id: '',
                first_name: '',
                last_name: '',
            },
            numLikes: 0,
        };
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                isEdited: false,
                viewer_id: this.props.route.params.data.viewer_id,
                post_id: this.props.route.params.data.post_id,
                text: this.props.route.params.data.body,
                timestamp: this.props.route.params.data.date,
                author: {
                    user_id: this.props.route.params.data.author_id,
                    first_name: this.props.route.params.data.first_name,
                    last_name: this.props.route.params.data.last_name,
                },
                numLikes: this.props.route.params.data.likes,
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    convertDate() {

        let date = new Date(this.state.timestamp);

        let day = date.getDay();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return(day + '/' + month + '/' + year);
    }

    async updatePost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.author.user_id + '/post/' + this.state.post_id, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => {
            if(response.status === 200) {
                alert('Successfully updated post!');
                this.setState({
                    isEdited: false,
                })
            } else if (response.status === 400) {
                throw 'Bad Request';
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else if (response.status === 403) {
                throw 'Forbidden - you can only update your own posts';
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

    confirmDeletePost() {

        Alert.alert(
            'CONFIRM',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Yes',
                    onPress: () => this.deletePost(),
                },
                {
                    text: 'Cancel',
                }

            ]
        )
    }

    async deletePost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.author.user_id + '/post/' + this.state.post_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200) {
                alert('Post Deleted!');
                this.props.navigation.navigate('Home');
            }
        })

    }

    render() {
        if(this.state.author.user_id == this.state.viewer_id) {
            return(
                <View style={Styles.container}>
                    <View style={Styles.header}>
                        <Text style={Styles.title}>Posted by <Text style={Styles.titleLight}>Me</Text></Text>
                        <Pressable 
                            style={Styles.backButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image
                                source={require('../assets/icons/png/xLarge.png')}
                                style={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                        </Pressable>
                    </View>
                    <View style={{ marginHorizontal: '5%'}}>
                        <View style={[Styles.post, {marginTop: 20}]}>
                            <Text style={[Styles.postSubText, { marginLeft: 20, paddingBottom: 10 }]}>Click on the bubble to start editing!</Text>
                            <View style={Styles.postBubble}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholder="Write your post here..."
                                    onChangeText={(text) => this.setState({text: text, isEdited: true})}
                                    value={this.state.text}
                                    style={Styles.postText}
                                    multiline={true}
                                />
                            </View>
                            <View style={Styles.postDetails}>
                                <View style={Styles.postLikes}>
                                    <View
                                        style={Styles.postLikeBtn}
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
                                            {this.state.numLikes}
                                        </Text>
                                    </View>
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
                        <View style={Styles.center}>
                            <Pressable 
                                style={[Styles.actionButton, { backgroundColor: '#FF4141'}]}
                                onPress={() => this.confirmDeletePost()}
                            >
                                <Text style={Styles.btnText}>Delete Post</Text>
                            </Pressable>
                        </View>
                    </View>
                    {
                    this.state.isEdited && 
                        <View style={Styles.center}>
                            <Pressable 
                                style={[Styles.actionButton, {marginTop: 30 }]}
                                onPress={() => this.updatePost()}
                            >
                                <Text style={Styles.btnText}>Save Changes</Text>
                            </Pressable>
                        </View>
                    }
                </View>
            );
        } else {
            return(
                <View style={Styles.container}>
                    <View style={Styles.header}>
                    <Text style={Styles.title}>Posted by <Text style={Styles.titleLight}>{this.state.author.first_name + ' ' + this.state.author.last_name}</Text></Text>
                        <Pressable 
                            style={Styles.backButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image
                                source={require('../assets/icons/png/xLarge.png')}
                                style={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                        </Pressable>
                    </View>
                    <View style={{ marginHorizontal: '5%'}}>
                        <View style={[Styles.post, {marginTop: 20}]}>
                            <View style={Styles.postBubble}>
                                <Text style={Styles.postText}>
                                    {this.state.text}
                                </Text>
                            </View>
                            <View style={Styles.postDetails}>
                                <View style={Styles.postLikes}>
                                    <View
                                        style={Styles.postLikeBtn}
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
                                            {this.state.numLikes}
                                        </Text>
                                    </View>
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
                    </View>
                </View>
            );
        }
        
    }
}