import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import styles from "../styles/Styles";

function HomeScreen({navigation}) {

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Button
                title="click me!"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    );

}

export default HomeScreen;