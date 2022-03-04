import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import styles from "../styles/Styles";

function DraftsScreen({navigation}) {

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