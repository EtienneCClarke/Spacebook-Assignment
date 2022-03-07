import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styling/Styles';

function Friends() {
    return (
        <View style={styles.container}>
            <Text>Friends Screen</Text>
            <Button
                title="click me!"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    );
}

export default FriendsScreen;
