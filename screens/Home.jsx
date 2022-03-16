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
        };
        this.closePostCard = this.closePostCard.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('@session_id').then((result) => {
            this.setState({ id: result, loading: false, showPostCard: false, });
        });
        this.checkLoggedIn();   
    }

    checkLoggedIn = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        if(token == null) {
            this.props.navigation.navigate('Login');
        }
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
                        <PostCard closePostCard={this.closePostCard}/>
                    }
                    <View style={Styles.header}>
                        <UserLabel
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
