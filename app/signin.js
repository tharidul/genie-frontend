import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mainColor = "#FFFFFF";
const accentColor1 = "#00458e";
const accentColor2 = "#000328";
const fontSizeBodyText = 20;
const fontSizeButton = 24;
const fontSizeHeading1 = 42;
const fontSizeHeading2 = 36;

const logo = require('../assets/images/logo.png');

SplashScreen.preventAutoHideAsync();

export default function SignIn() {
    // UseStates



    const [getMobile, setMobile] = useState(null);
    const [getPassword, setPassword] = useState(null);
    const [getAvatarLetters, setAvatarLetters] = useState(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [loaded, error] = useFonts({
        'reg': require('../assets/fonts/Quicksand-Medium.ttf'),
        'bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };


    return (


        <LinearGradient colors={['#00458e', '#00458e', '#000328']} style={styles.container} >
            <StatusBar hidden={true} />
            <Text style={styles.title}>Start Chatting</Text>
            <ScrollView >

                <View style={styles.avatarView} >
                    <Text style={styles.avatarText}>{getAvatarLetters}</Text>
                </View>
                <TextInput
                    onChangeText={
                        (text) => {
                            setMobile(text);
                        }
                    }
                    onEndEditing={
                        async () => {
                            if (getMobile.length == 10) {
                                let response = await fetch("http://192.168.1.4:8080/Genie/LoadAavtarLetter?mobile=" + getMobile);

                                if (response.ok) {
                                    let json = await response.json();
                                    setAvatarLetters(json.letters);
                                }
                            }
                        }
                    }
                    style={styles.input}
                    placeholder='Mobile Number'
                    keyboardType='phone-pad'
                    maxLength={10}

                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        onChangeText={
                            (text) => {
                                setPassword(text);
                            }
                        }
                        style={styles.passwordInput}
                        placeholder='Password'
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <FontAwesome
                            name={isPasswordVisible ? "eye" : "eye-slash"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>



                <Pressable
                    onPress={
                        async () => {
                            let response = await fetch(
                                "http://192.168.1.4:8080/Genie/SignIn",
                                {
                                    method: "POST",
                                    body: JSON.stringify(
                                        {
                                            mobile: getMobile,
                                            password: getPassword,
                                        }
                                    ),
                                    headers: {
                                        "Content-Type": "application/json",
                                    }
                                }
                            );

                            if (response.ok) {

                                let json = await response.json();

                                if (json.success) {

                                    let user = json.user;

                                    try {
                                        await AsyncStorage.setItem('user', JSON.stringify(user));
                                        router.replace("/home");
                                    } catch (e) {
                                        console.log(e);
                                    }

                                } else {
                                   
                                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                                }

                            } else {

                                ToastAndroid.show( "Server responded with an error", ToastAndroid.SHORT);

                            }
                        }
                    }
                    style={({ pressed }) => [
                        styles.button1,
                        {
                            backgroundColor: pressed ? "#cad0ff" : mainColor,
                        },
                    ]}
                >
                    <Text style={styles.buttonText1}>Get Talking</Text>

                </Pressable>

                <Link href={"/signup"} style={styles.link1}>
                    <Text style={styles.buttonText2}>Didn't have account? goto Sign Up.</Text>
                </Link>

            </ScrollView>
        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
    },
    title: {
        marginTop: 40,
        fontSize: fontSizeHeading1,
        color: mainColor,
        fontFamily: "bold",
    },
    avatar: {
        height: 180,
        width: 180,
        borderRadius: 90,
        borderColor: mainColor,
        borderWidth: 2,
    },
    button1: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        height: 60,
        width: 250,
        borderRadius: 20,
    },
    buttonText1: {
        fontSize: fontSizeButton,
        color: accentColor1,
        fontFamily: "bold",
    },
    text1: {
        fontFamily: "reg",
        fontSize: 22,
        textAlign: "center",
        color: mainColor,
        marginTop: 50,
    },
    input: {
        marginBottom: 40,
        height: 60,
        width: 400,
        borderRadius: 15,
        fontSize: 20,
        padding: 10,
        backgroundColor: "white",
    },
    avatarPressable: {
        marginBottom: 40,
        marginTop: 40,
        alignSelf: "center",
        height: 180,
        width: 180,
        borderRadius: 90,
        borderColor: mainColor,
        borderWidth: 2,
    },
    link1: {
        marginTop: 40,
        alignSelf: "center",

    },
    buttonText2: {
        color: mainColor,
        fontSize: fontSizeButton,
        fontFamily: "reg",
        textDecorationLine: 'underline',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        height: 60,
        width: "100%",
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    passwordInput: {
        flex: 1,  // Take up most of the space
        fontSize: fontSizeBodyText,
        padding: 10,
        backgroundColor: "white",
        fontFamily: "reg",
        letterSpacing: 1,
    },
    avatarView: {
        marginTop: 70,
        marginBottom: 70,
        borderWidth: 2,
        borderColor: mainColor,
        borderRadius: 100,
        width: 200,
        height: 200,
        alignSelf: "center",


    },
    avatarText: {

        alignSelf: "center",
        color: mainColor,
        fontSize: 100,
        padding: 15,
        fontFamily: "bold"
    }

});
