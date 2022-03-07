import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styling/Styles';

function Settings() {
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
            <Button
                title="click me!"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    );
}

export default SettingsScreen;
