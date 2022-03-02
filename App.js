import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Welcome to your first react app!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "blue",
    }
})