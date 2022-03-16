import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',    
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' || Platform.OS === 'web' ? StatusBar.currentHeight : 30,
    },
    container90: {
        justifyContent: 'center',
        maxWidth: '90%',
        marginLeft: '5%',
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
        flexShrink: 1,
    },
    titleLight: {
        fontSize: 24,
        fontWeight: '300',
    },
    inputContainer: {
        marginTop: 30,
        width: '90%',
        alignItems: 'flex-start'
    },
    userLabel: {
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLabelText: {
        marginLeft: 15,
        fontWeight: 'bold',
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
        backgroundColor: '#79CAD6',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btnTextSmall: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnAccept: {
        backgroundColor: '#82D281',
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 30,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
    },
    btnDecline: {
        backgroundColor: '#FF4141',
        paddingVertical: 3,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
    },
    errorMsg: {
        color: '#BF2626',
    },
    header: {
        paddingHorizontal: '5%',
        paddingVertical: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    postWall: {
        paddingHorizontal: '5%',
        paddingTop: 20,
    },
    post: {
        marginBottom: 30,
        width: '100%',
    },
    postBubble: {
        flexShrink: 1,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    postText: {
        flexShrink: 1,
        fontWeight: 'bold',
    },
    postDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postLikes: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, 
        marginVertical: 8,
    },
    postLike: {
        height: 12.5,
        width: 14.06,
    },
    postLikeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postSubText: {
        fontWeight: '300',
        fontSize: 12,
    },
    bubbleTail: {
        marginTop: -3,
        height: 30,
        width: 45.65,
        marginRight: 10,
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF8F8F',
        borderRadius: 15,
        width: 42,
        height: 42,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
        marginLeft: 'auto',
        marginRight: 15,
    },
    newPostBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF8F8F',
        borderRadius: 15,
        padding: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
        marginLeft: 'auto',
        marginRight: 15,
    },
    actionButton: {
        backgroundColor: '#79CAD6',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    actionButtonThin: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 10,
    },
    search: {
        marginTop: Platform.OS === 'web' ? 20 : 0,
    },
    searchBtn: {
        marginTop: 10,
        marginLeft: 15,
        justifyContent  : 'center'
    },
    friendLabel: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderColor: '#C8C8C8',
    },
    firstFriendLabel: {
        borderTopWidth: 0,
    },
    postCardBackground: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(101, 101, 101, 0.49)',
        width: '100%',
        height: '100%',
    },
    postCard: {
        backgroundColor: '#F5F5F5',
        width: '80%',
        borderRadius: 15,
        padding: 20,
        zIndex: 100,
    },
    postCardBubble: {
        flexShrink: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    postCardActions: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    }
});
