import { StyleSheet, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dedede',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        elevation: 5
    }
});