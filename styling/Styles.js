import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dedede',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
