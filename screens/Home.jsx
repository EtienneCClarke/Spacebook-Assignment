import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import UserLabel from '../components/UserLabel';
import Posts from '../components/Posts';
import Styles from '../styling/Styles';
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            loading: true,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('@session_id').then((result) => {
            this.setState({ id: result, loading: false });
        });
    }

    render() {
        if(this.state.loading) {
            return (<View styles={[Styles.container, Styles.center]}><Text>Loading...</Text></View>);
        } else {
            return (
                <View style={Styles.container}>
                    <View style={Styles.header}>
                        <UserLabel
                            userId={this.state.id}
                        />
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
