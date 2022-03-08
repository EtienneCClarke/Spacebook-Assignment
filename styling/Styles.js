import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    signupScroll: {
        paddingTop: 25,
        paddingBottom: 25, 
    },
    logo: {
        width: 232,
        height: 138.15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 30,
        width: '90%',
        alignItems: 'flex-start'
    },
    label: {
        color: '#636363',
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelLight: {
        color: '#8F8F8F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        width: '100%',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
    },
    btnPrimary: {
        backgroundColor: '#82D281',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    btnSecondary: {
        backgroundColor: '#3AC8BF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorMsg: {
        color: '#BF2626',
    }
});
