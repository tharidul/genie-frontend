import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View, } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
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

export default function App() {

    const [isAnimatedComplete, setAnimatedComplete] = useState(false);

    const [loaded, error] = useFonts({
        'reg': require('../assets/fonts/Quicksand-Medium.ttf'),
        'bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    });

    useEffect(
        () => {
            async function userCheck() {
                try {
                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson != null) {
                        router.replace("/home");
                    }
                } catch (error) {
                    Alert.alert(error)
                }
            }
            userCheck();
        }
    );

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        
            <LinearGradient colors={['#00458e', '#00458e', '#000328']} style={styles.container}>
                <StatusBar hidden={true} />
                <Text style={styles.title}>Welcome to Genie</Text>


                <Image source={logo} style={styles.logo} />


                <Text style={styles.text1}>More than just a messaging app, it's a place to connect.</Text>

                <Pressable
                    onPress={
                        () => {
                            router.push("signup");
                        }
                    }
                    style={({ pressed }) => [
                        styles.button1,
                        {
                            backgroundColor: pressed ? "#cad0ff" : mainColor,
                        },
                    ]}
                >
                    <Text style={styles.buttonText1}>Get Started</Text>

                </Pressable>

            </LinearGradient>
       
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginTop: 80,
        fontSize: fontSizeHeading1,
        color: mainColor,
        fontFamily: "bold",
    },
    logo: {
        marginTop: 120,
        width: "100%",
        height: 250,
        resizeMode: "contain",
    },
    button1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 200,
        height: 65,
        width: 400,
        borderRadius: 20,
    },
    buttonText1: {
        fontSize: fontSizeButton,
        color: accentColor1,
        fontFamily: "bold",
    },
    text1: {
        fontFamily: "reg",
        fontSize: fontSizeBodyText,
        textAlign: "center",
        color: mainColor,
        marginTop: 50,
    },
});
