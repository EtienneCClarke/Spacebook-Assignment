import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    Pressable,
    Alert,
    Platform,
} from 'react-native';
import Styles from '../styling/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SinglePost extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            liked: false,
            isEdited: false,
            viewer_id: 0,
            post_id: 0,
            text: '',
            timestamp: '',
            author: {
                id: 0,
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
                owner_id: this.props.route.params.data.owner_id,
                post_id: this.props.route.params.data.post_id,
                author: {
                    user_id: this.props.route.params.data.author_id
                },
                loading: true,
            });
            this.getPost().then(() => {
                this.setState({
                    loading: false,
                })
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getPost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.owner_id + '/post/' + this.state.post_id, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-Authorization': token
            },
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 403) {
                throw 'Unauthorised';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else {
                throw 'Server Error';
            }
        })
        .then((responseJson) => {
            this.setState({
                text: responseJson.text,
                timestamp: responseJson.timestamp,
                author: {
                    user_id: responseJson.author.user_id,
                    first_name: responseJson.author.first_name,
                    last_name: responseJson.author.last_name,
                },
                numLikes: responseJson.numLikes,
            })
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    async updatePost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.owner_id + '/post/' + this.state.post_id, {
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

        if(Platform.OS === 'web') {
            this.deletePost();
        } else {
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
            );
        }
    }

    async deletePost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.state.owner_id + '/post/' + this.state.post_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200) {
                alert('Post Deleted!');
                this.props.navigation.goBack();
            }
        })
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


    render() {
        if(!this.state.loading) {
            if(this.state.author.user_id == this.state.viewer_id) {
                return(
                    <View style={Styles.container} key={this.state.post_id}>
                        <View style={Styles.header}>
                            <Text style={Styles.title}>Posted by <Text style={Styles.titleLight}>Me</Text></Text>
                            <Pressable 
                                accessible={true}
                                accessibilityLabel="Go back"
                                accessibilityHint="Goes back to previous page"
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
                                <View
                                    accessible={true}
                                    accessibilityLabel="Your Post"
                                    accessibilityHint="You can edit the input box and click save to update your post"
                                    style={Styles.postBubble}
                                >
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
                                            <Text
                                                style={[
                                                    Styles.postSubText,
                                                    { marginLeft: 10 }
                                                ]}
                                            >
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
                                    accessible={true}
                                    accessibilityLabel="Delete Post"
                                    accessibilityHint="Deletes post from wall"
                                    style={[Styles.actionButton, { backgroundColor: '#FF4141'}]}
                                    onPress={() => this.confirmDeletePost()}
                                >
                                    <Text style={Styles.btnText}>Delete Post</Text>
                                </Pressable>
                            </View>
                        </View>
                        { this.state.isEdited && 
                            <View style={Styles.center}>
                                <Pressable
                                    accessible={true}
                                    accessibilityLabel="Update Post"
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
                                accessible={true}
                                accessibilityLabel="Go back"
                                accessibilityHint="Goes back to previous page"
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
                                <View
                                    accessible={true}
                                    accessibilityLabel="Post"
                                    style={Styles.postBubble}
                                >
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
        return (
            <View style={[Styles.container]} />
        );
    }
}
