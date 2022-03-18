import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import UserLabel from '../components/UserLabel';
import PostCard from '../components/PostCard';
import Styles from '../styling/Styles';

export default class Drafts extends Component {

    constructor() {
        super();
        this.state = {
            user_id: null,
            draft_id: null,
            draft_content: null,
            showPostCard: false,
            drafts: [],
            reload: 0,
            loading: true,
        }
        this.closePostCard = this.closePostCard.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ loading: true });
            AsyncStorage.getItem('@session_id').then((result) => {
                this.setState({ id: result, showPostCard: false, reload: this.state.reload + 1});
            });
            this.getDrafts();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    setId() {
        AsyncStorage.getItem('@session_id').then((id) => {
            this.setState({user_id: id, loading: false,});
        });
    }

    async getDrafts() {
        AsyncStorage.getItem('@session_id').then((id) => {
            let target = '@drafts_' + id;
            AsyncStorage.getItem(target)
            .then((arr) => {
                const obj = JSON.parse(arr);
                let tempArr = [];
                Object.keys(obj).forEach((key) => {
                    tempArr.push(obj[key]);
                });
                this.setState({
                    drafts: tempArr,
                });
            })
            .then(() => {
                this.setState({
                    loading: false,
                })
            });
        });
    }

    displayDrafts() {
        return this.state.drafts.map((draft, i) => {
            if(i === 0) {
                return null;
            } else {
                return(
                    <View style={Styles.draftContainer} key={i}>
                        <View style={Styles.draftTextContainer}>
                            <Text style={Styles.draft}>{draft.text}</Text>
                        </View>
                        <Pressable
                            accessible={true}
                            accessibilityLabel="Edit Draft"
                            accessibilityHint="Opens draft editor"
                            style={Styles.editDraft}
                            onPress={() => this.setState({
                                showPostCard: true,
                                draft_id: i,
                                draft_content: draft.text,
                            })}
                        >
                            <Image
                                source={require('../assets/icons/png/settings.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </Pressable>
                    </View>
                );
            }
        });
    }

    closePostCard() {
        this.setState({
            showPostCard: false,
        })
        this.getDrafts();
    }

    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            return (
                <View 
                    accessible={true}
                    style={Styles.container}
                >
                    { this.state.showPostCard &&
                        <PostCard
                            closePostCard={this.closePostCard}
                            target_wall={this.state.id}
                            draft_id={this.state.draft_id}
                            content={this.state.draft_content}
                            draft={true}
                        />
                    }
                    <View style={Styles.header}>
                        <UserLabel
                            key={this.state.reload}
                            userId={this.state.id}
                        />
                    </View>
                    <Text 
                        style={[
                            Styles.title,
                            {
                                marginLeft: '5%',
                                marginRight: '5%',
                                paddingBottom: 15
                            }
                        ]}
                    >
                        My Drafts
                    </Text>
                    <ScrollView key={this.state.reload}>
                        {this.displayDrafts()}
                    </ScrollView>
                </View>
            );
        }
    }
}
