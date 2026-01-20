import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { router, useGlobalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, ImageBackground } from 'expo-image';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../assets/images/background.png');
const avatar = require('../assets/images/avatar.png');
const mainColor = "#FFFFFF";
const accentColor1 = "#00458e";
const accentColor2 = "#000328";

export default function Chat() {
  const param = useGlobalSearchParams();
  console.log(param);
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
  });

  // State to hold chat messages and the new message input
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); // New state for the message input

  // Fetch chat messages
  useEffect(() => {
    const fetchChatMessages = async () => {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      try {
        const response = await fetch(`http://192.168.1.4:8080/Genie/LoadChat?current_user_id=${user.id}&other_user_id=${param.other_user_ID}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setChatMessages(data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        ToastAndroid.show("Failed to load messages", ToastAndroid.SHORT); // Notify user
      }
    };

    fetchChatMessages();
  }, []);

  // Handle sending the message
  const sendMessage = async () => {
    let userJson = await AsyncStorage.getItem("user");
    let user = JSON.parse(userJson);

    if (newMessage.trim() === '') {
      ToastAndroid.show("Please enter a message", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.4:8080/Genie/SendMessage?current_user_id=${user.id}&other_user_id=${param.other_user_ID}&message=${encodeURIComponent(newMessage)}`, {
        method: 'GET', // In your case, the servlet is using GET. For production, consider POST.
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the chat by refetching the messages
        setChatMessages(prev => [...prev, { sender: "me", message: newMessage, datetime: new Date().toLocaleString() }]);
        setNewMessage(''); // Clear the input field
      } else {
        ToastAndroid.show("Failed to send message", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      ToastAndroid.show("Failed to send message", ToastAndroid.SHORT);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <MenuProvider>
      <ImageBackground style={styles.background} source={background}>
        <View style={styles.container}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>

            <Menu>
              <MenuTrigger>
                <View style={styles.receiver}>
                  {param.avatar_image_found == "true" ? (
                    <Image
                      source={{ uri: `http://192.168.1.4:8080/Genie/AvatarImages/${param.otherMobile}.png` }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarLetterView}>
                      <Text style={styles.avatarText}>{param.other_user_avatar}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.userName}>{param.other_user_name}</Text>
                    <Text style={styles.online}>{param.other_user_status == "true" ? "online" : "Offline"}</Text>
                  </View>
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={optionsStyles}>
                <View style={styles.menuContent}>
                  <Text style={styles.menuOptionText}>
                    <AntDesign name="user" size={20} color="black" /> {param.other_user_name}
                  </Text>
                  <Text style={styles.menuOptionText}>
                    <AntDesign name="mobile1" size={20} color="black" /> {param.otherMobile}
                  </Text>
                  <MenuOption onSelect={() => alert('Block User')} style={styles.blockUserOption}>
                    <Text style={styles.blockUserText}>Block User</Text>
                  </MenuOption>
                </View>
              </MenuOptions>
            </Menu>
          </View>

          <ScrollView contentContainerStyle={styles.chatBody}>
            {/* Render chat messages */}
            {chatMessages.map((chat, index) => (
              <View key={index} style={chat.sender === "other" ? styles.receiverMessageContainer : styles.userMessageContainer}>
                <Text style={chat.sender === "other" ? styles.receiverMessage : styles.userMessage}>{chat.message}</Text>

                <View style={{flexDirection:"row",  alignItems:"center",}}>

                <Text style={styles.time}>{chat.datetime}</Text>
                {chat.sender === "me" && (
                  param.chat_status =="true" ? 
                    <Ionicons name="checkmark-done-sharp" size={18} color={accentColor1} />
                   : 
                    <Ionicons name="checkmark-outline" size={24} color="gray" />
                  
                )}
                </View>

              </View>
            ))}
          </ScrollView>


          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </MenuProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00458e',
    padding: 10,
  },
  backButton: {
    paddingRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,  // Circular avatar
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  chatBody: {
    flexGrow: 1,
    padding: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#52a2f7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    maxWidth: '80%',
    shadowColor: '#000',
    elevation: 15,
  },
  userMessage: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'bold',
  },
  receiverMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#095ab0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    elevation: 15,
  },
  receiverMessage: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
  },
  sendButton: {
    backgroundColor: '#00458e',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  online: {
    color: 'white',
    marginLeft: 10,
  },
  time: {
    marginTop: 5,
    marginRight:8,
    color: 'white',
    alignSelf: 'flex-end',
    fontSize: 13,
  },
  receiver: {
    flexDirection: 'row',
  },
  menuContent: {
    alignItems: 'center',
    padding: 15,
  },

  menuOptionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  blockUserOption: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  blockUserText: {
    color: 'red',
    fontSize: 16,
  },
  avatarLetterView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: accentColor1,
  },
  avatarText: {
    fontFamily: "bold",
    fontSize: 24,
    alignSelf: "center",
    justifyContent: "center",
    padding: 5,
    color: "white"
  },
});

const optionsStyles = {
  optionsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -100 }],  // Adjust these values for perfect centering
    width: 250,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 20,
  },
  optionWrapper: {
    padding: 5,
  },
};
