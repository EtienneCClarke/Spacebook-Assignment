import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Modal, Text, TextInput, Pressable, Image } from 'react-native';
import Styles from '../styling/Styles';

export default class PostCard extends Component {

    constructor() {
        super();
        this.state = {
            text: ''
        }
    }

    async newPost() {

        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + id + '/post', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token,
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => {
            if (response.status === 201) {
                this.props.closePostCard();
            } else if (response.status === 401) {
                throw 'Unauthorised';
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

    render() {
        return(
            <Modal
                transparent={true}
                
            >
                <View style={Styles.postCardBackground}>
                    <View style={Styles.postCard}>
                        <Text style={[Styles.title, { alignSelf: 'center', marginBottom: 20, fontSize: 20}]}>New Post</Text>
                        <View style={Styles.postCardBubble}>
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Whats on your mind?"
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}
                                style={[Styles.postText, {
                                    minHeight: 100,
                                }]}
                                multiline={true}
                            />
                        </View>
                        <View style={Styles.postCardActions}>
                            <Pressable
                                    style={[
                                        Styles.actionButtonThin,
                                        {
                                            backgroundColor: '#3AC8BF',
                                            paddingVertical: 3,
                                        }
                                    ]}
                                    onPress={() => alert('Test!')}
                                >
                                    <Text style={Styles.btnTextSmall}>Save to drafts</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    Styles.actionButtonThin,
                                    {
                                        backgroundColor: '#7BD679',
                                        paddingVertical: 7,
                                    }
                                ]}
                                onPress={() => this.newPost()}
                            >
                                <Text style={Styles.btnTextSmall}>Post!</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

}