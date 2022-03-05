import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import styles from "../styling/Styles";

function FriendsScreen({navigation}) {

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