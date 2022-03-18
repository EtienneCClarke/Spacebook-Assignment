import React, {
    useEffect,
    useState,
    useRef,
} from 'react';
import {
    View,
    Text,
    Button,
    Pressable,
} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Styles from '../styling/Styles';

export default function PhotoUpload() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    async function updatePhoto(data) {
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');
        const res = await fetch(data.uri);
        const blob = await res.blob();
        return fetch('http://192.168.1.73:3333/api/1.0.0/user/' + id + '/photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'image/jpeg',
                'X-Authorization': token,
            },
            body: blob,
        }).then((response) => {
            if (response.status === 200) {
                alert('Successfully updated profile picture!\n\n'
                + 'Changes may not take full effect until application restart!');
                navigation.navigate('Settings');
            } else if (response.status === 400) {
                throw new Error('Bad Request');
            } else if (response.status === 401) {
                throw new Error('Unauthorised');
            } else if (response.status === 404) {
                throw new Error('Not Found');
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    async function takePicture() {
        if (cameraRef) {
            try {
                const options = {
                    quality: 0.5,
                    base64: true,
                    onPictureSaved: (data) => updatePhoto(data),
                };
                await cameraRef.current.takePictureAsync(options);
            } catch (error) {
                console.log(error);
            }
        }
    }

    if (hasPermission === true) {
        return (
            <View style={[Styles.container, { alignItems: 'center', marginTop: 50 }]}>
                <Text style={Styles.label}>Take new image for profile</Text>
                <View style={Styles.cameraContainer}>
                    <Camera style={Styles.camera} type={type} ref={cameraRef} />
                </View>
                <View style={Styles.cameraButtonContainer}>
                    <Pressable
                        accessible
                        accessibilityLabel="Flip camera mode"
                        accessibilityHint="Changes which camera you want to use, front or back"
                        style={Styles.btnSecondary}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                            );
                        }}
                    >
                        <Text style={Styles.btnText}>Flip</Text>
                    </Pressable>
                    <Pressable
                        accessible
                        accessibilityLabel="Take Picture"
                        accessibilityHint="Takes an image and saves as profile picture"
                        style={[
                            Styles.btnPrimary,
                            {
                                marginLeft: 20,
                            },
                        ]}
                        onPress={async () => takePicture()}
                    >
                        <Text style={Styles.btnText}>Take Picture</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
    return (
        <View style={[Styles.container, Styles.center]}>
            <Text>Make sure permissions are allowed to use camera</Text>
            <Button
                accessible
                accessibilityLabel="Go back to settings"
                accessibilityHint="Returns to profile settings"
                title="Return to Settings"
                onPress={() => navigation.navigate('Settings')}
            />
        </View>
    );
}
