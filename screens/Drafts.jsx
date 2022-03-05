import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styling/Styles';

function DraftsScreen() {
    return (
        <View style={styles.container}>
            <Text>Drafts Screen</Text>
            <Button
                title="click me!"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    );
}

export default DraftsScreen;
