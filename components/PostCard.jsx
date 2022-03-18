import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Modal, Text, TextInput, Pressable, Image } from 'react-native';
import Styles from '../styling/Styles';

export default class PostCard extends Component {

    state = {
        id: this.props.draft_id,
        draft: this.props.draft,
        text: this.props.content,
    }

    async saveDraft() {

        AsyncStorage.getItem('@session_id').then((id) => {
            let target = '@drafts_' + id;
            AsyncStorage.getItem(target).then((arr) => {
                let obj = JSON.parse(arr);
                const newIndex = Object.keys(obj).length;
                obj[newIndex] = { text: this.state.text };
                AsyncStorage.setItem(target, JSON.stringify(obj));
                this.props.closePostCard();
            })
        });  
    }

    async updateDraft() {

        AsyncStorage.getItem('@session_id').then((id) => {
            let target = '@drafts_' + id;
            AsyncStorage.getItem(target).then((arr) => {
                let obj = JSON.parse(arr);
                obj[this.state.id] = { text: this.state.text };
                AsyncStorage.setItem(target, JSON.stringify(obj));
                this.props.closePostCard();
            })
        });  

    }

    async deleteDraft() {

        AsyncStorage.getItem('@session_id').then((id) => {
            let target = '@drafts_' + id;
            AsyncStorage.getItem(target).then((arr) => {
                let obj = JSON.parse(arr);
                let tempArr = [];
                Object.keys(obj).forEach((key) => {
                    tempArr.push(obj[key]);
                });
                tempArr.splice(this.state.id, 1);
                obj = JSON.stringify(Object.assign({}, tempArr));
                AsyncStorage.setItem(target, obj);
                this.props.closePostCard();
            })
        });
    }

    async newPost() {

        const token = await AsyncStorage.getItem('@session_token');

        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + this.props.target_wall + '/post', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token,
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => {
            if (response.status === 201) {
                if(this.state.draft) {
                    this.deleteDraft();
                }
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
            <Modal transparent={true}>
                <View style={Styles.postCardBackground}>
                    <View style={Styles.postCard}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}>
                            <Text style={[Styles.title, {fontSize: 20}]}>New Post</Text>
                            <Pressable
                                accessible={true}
                                accessibilityLabel="Exit"
                                accessibilityHint="Closes current screen"
                                style={Styles.newPostBtnClose}
                                onPress={() => this.props.closePostCard()}
                            >
                                <Image
                                    source={require('../assets/icons/png/xSmall.png')}
                                    style={{
                                        width: 18,
                                        height: 18,
                                    }}
                                />
                            </Pressable>
                        </View>
                        <View
                            accessible={true}
                            accessibilityLabel="Post Content"
                            accessibilityHint="Enter here what you would like to post"
                            style={Styles.postCardBubble}
                        >
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Whats on your mind?"
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}
                                style={[Styles.postText, {
                                    minHeight: 100,
                                    maxHeight: 200,
                                }]}
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={Styles.postCardActions}>
                            { this.state.draft &&
                                <View
                                    accessible={true}
                                    accessibilityLabel="Actions"
                                    accessibilityHint="What would you like to do with this draft"
                                    accessibilityRole="menu" 
                                    style={{ width: '100%' }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    >
                                        <Pressable
                                            accessible={true}
                                            accessibilityLabel="Delete Draft"
                                            style={[
                                                Styles.actionButtonThin,
                                                {
                                                    backgroundColor: '#FF4141',
                                                    paddingVertical: 10,
                                                    alignSelf: 'center'
                                                }
                                            ]}
                                            onPress={() => this.deleteDraft()}
                                        >
                                            <Text style={Styles.btnTextSmall}>Delete Draft</Text>
                                        </Pressable>
                                        <Pressable
                                            accessible={true}
                                            accessibilityLabel="Update Draft"
                                            style={[
                                                Styles.actionButtonThin,
                                                {
                                                    backgroundColor: '#3AC8BF',
                                                    paddingVertical: 10,
                                                }
                                            ]}
                                            onPress={() => this.updateDraft()}
                                        >
                                            <Text style={Styles.btnTextSmall}>Save Draft</Text>
                                        </Pressable>
                                    </View>
                                    <Pressable
                                        accessible={true}
                                        accessibilityLabel="Post Draft"
                                        style={[
                                            Styles.actionButtonThin,
                                            {
                                                backgroundColor: '#7BD679',
                                                paddingVertical: 20,
                                                width: '100%',
                                                alignItems: 'center',
                                                marginTop: 30,
                                                alignSelf: 'center',
                                            }
                                        ]}
                                        onPress={() => this.newPost()}
                                    >
                                        <Text style={Styles.btnText}>Post!</Text>
                                    </Pressable>
                                </View> ||
                                <View
                                    accessible={true}
                                    accessibilityLabel="Actions"
                                    accessibilityHint="What would you like to do with this post"
                                    accessibilityRole="menu"
                                    style={{
                                        flexDirection: 'row',
                                        alignItems:'flex-end',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}
                                >
                                    <Pressable
                                        accessible={true}
                                        accessibilityLabel="Save as draft"
                                        style={[
                                            Styles.actionButtonThin,
                                            {
                                                backgroundColor: '#3AC8BF',
                                                paddingVertical: 3,
                                            }
                                        ]}
                                        onPress={() => this.saveDraft()}
                                    >
                                        <Text style={Styles.btnTextSmall}>Save to drafts</Text>
                                    </Pressable>
                                    <Pressable
                                        accessible={true}
                                        accessibilityLabel="Post"
                                        style={[
                                            Styles.actionButtonThin,
                                            {
                                                backgroundColor: '#7BD679',
                                                paddingVertical: 10,
                                            }
                                        ]}
                                        onPress={() => this.newPost()}
                                    >
                                        <Text style={Styles.btnTextSmall}>Post!</Text>
                                    </Pressable>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

}