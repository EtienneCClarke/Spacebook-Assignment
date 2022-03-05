import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import styles from "../styling/Styles";

function SettingsScreen({navigation}) {

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