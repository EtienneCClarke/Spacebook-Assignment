import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ScrollView, Text, Pressable, Image } from 'react-native';
import UserLabel from '../components/UserLabel';
import Posts from '../components/Posts';
import PostCard from '../components/PostCard';
import Styles from '../styling/Styles';
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            loading: true,
            showPostCard: true,
            reload: 0,
        };
        this.closePostCard = this.closePostCard.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('@session_id').then((result) => {
                this.setState({ id: result, loading: false, showPostCard: false, reload: this.state.reload + 1});
            });
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    closePostCard() {
        this.setState({
            showPostCard: false,
        })
    }

    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            return (
                <View style={Styles.container}>
                    {this.state.showPostCard &&
                        <PostCard closePostCard={this.closePostCard} target_wall={this.state.id} draft_id={null} content={null} draft={false}/>
                    }
                    <View style={Styles.header}>
                        <UserLabel
                            key={this.state.reload}
                            userId={this.state.id}
                        />
                        <Pressable
                            style={Styles.newPostBtn}
                            onPress={() => this.setState({showPostCard: true})}
                        >
                            <Image
                                source={require('../assets/icons/png/cross.png')}
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                            />
                        </Pressable>
                    </View>
                    <Text style={[Styles.title, {marginLeft: '5%', marginRight: '5%', paddingBottom: 15}]}>My Wall</Text>
                    <ScrollView style={[Styles.container, {paddingTop: 0, marginBottom: 100}]}>
                        <Posts targetID={this.state.id}/>
                    </ScrollView>
                </View>
            );
        }
    }
}
