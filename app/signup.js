import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons'; // For eye icon
import { RouterStore } from 'expo-router/build/global-state/router-store';

const mainColor = "#FFFFFF";
const accentColor1 = "#00458e";
const accentColor2 = "#000328";
const fontSizeBodyText = 20;
const fontSizeButton = 24;
const fontSizeHeading1 = 42;
const fontSizeHeading2 = 36;

const avatar = require('../assets/images/avatar.png');
SplashScreen.preventAutoHideAsync();


export default function SignUp() {
    // UseStates

    const [getFname, setFname] = useState("");
    const [getLname, setLname] = useState("");
    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getAvatar, setAvatar] = useState(avatar);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to handle password visibility

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

    // Toggle the visibility of the password
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <LinearGradient colors={['#00458e', '#00458e', '#000328']} style={styles.container} >
            <StatusBar hidden={true} />
            <ScrollView fadingEdgeLength={400} >
                <Text style={styles.title}>Join the Community</Text>

                <Pressable
                    onPress={async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.All,
                            allowsEditing: true,
                        });

                        if (!result.canceled) {
                            setAvatar(result.assets[0].uri);
                        }
                    }}
                    style={styles.avatarPressable}
                >
                    <Image source={getAvatar} style={styles.avatar} contentFit="cover" />
                </Pressable>

                <View>
                    <TextInput
                        onChangeText={
                            (text) => {
                                setMobile(text);
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
                    <TextInput
                        inputMode={"text"}
                        onChangeText={
                            (text) => {
                                setFname(text);
                            }
                        }
                        style={styles.input}
                        placeholder='First Name'
                        autoCapitalize='words'
                        keyboardType='default'
                    />

                    <TextInput
                        inputMode={"text"}
                        onChangeText={
                            (text) => {
                                setLname(text);
                            }
                        }
                        style={styles.input}
                        placeholder='Last Name'
                        autoCapitalize='words'
                        keyboardType='default'
                    />

                </View>

                <Pressable
                    onPress={
                        async () => {
                            let formData = new FormData();
                            formData.append("mobile", getMobile);
                            formData.append("firstName", getFname);
                            formData.append("lastName", getLname);
                            formData.append("password", getPassword);

                            if (getAvatar !== avatar) {
                                formData.append("avatarImage", {
                                    name: "avatar.png",
                                    type: "image/png",
                                    uri: getAvatar,
                                });
                            }

                            

                            let response = await fetch(
                                "http://192.168.1.4:8080/Genie/SignUp",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            );

                            if (response.ok) {
                                let json = await response.json();
                                ToastAndroid.show( json.message, ToastAndroid.SHORT);
                                if (json.success) {
                                    setFname("");
                                    setLname("");
                                    setPassword("");
                                    setMobile("");
                                    router.push("signin");
                                }

                            }
                        }
                    }
                    style={({ pressed }) => [
                        styles.button1,
                        { backgroundColor: pressed ? "#cad0ff" : mainColor },
                    ]}
                >
                    <Text style={styles.buttonText1}>Join Now</Text>
                </Pressable>

                <Link href={"/signin"} style={styles.link1}>
                    <Text style={styles.buttonText2}>Already have an account? Sign In</Text>
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
        alignSelf: "center",
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
        borderWidth: 4,
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
        width: "100%",
        borderRadius: 15,
        fontSize: fontSizeBodyText,
        paddingHorizontal: 10,
        backgroundColor: "white",
        fontFamily: "reg",
        letterSpacing: 1,
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
    avatarPressable: {
        marginBottom: 40,
        marginTop: 40,
        alignSelf: "center",
        height: 180,
        width: 180,
        borderRadius: 90,
        borderColor: mainColor,
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
    }
});
