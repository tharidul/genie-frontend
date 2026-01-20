import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Button, Pressable, TextInput, Alert } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { router, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const mainColor = "#FFFFFF";
const accentColor1 = "#00458e";
const accentColor2 = "#000328";
const fontSizeBodyText = 20;
const fontSizeButton = 24;
const fontSizeHeading1 = 42;
const fontSizeHeading2 = 36;
const avatar = require('../assets/images/avatar.png');
const logo = require('../assets/images/logo.png');
SplashScreen.preventAutoHideAsync();

const ChatApp = () => {
  const [getChatArrary, setChatArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [getName, setName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [getavatarLetters, setavatarLetters] = useState("");
  const [getAvatarStatus, setAvatarStatus] = useState("");
  const [getID, setID] = useState("");
  const [getMeID, setMeID] = useState("");
  const [getUser, setUser] = useState("");

  const [loaded, error] = useFonts({
    'reg': require('../assets/fonts/Quicksand-Medium.ttf'),
    'bold': require('../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      setUser(user);
      setMeID(user.id);

      let response = await fetch("http://192.168.1.4:8080/Genie/LoadHomeData?id=" + user.id);

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
        } else {
          console.log(json);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const RenderItem = ({ name, message, time, avatar, chatStatus, othermobile, avatarLetters, friendDetail }) => (

    <TouchableOpacity style={styles.chatItem}
      onPress={() => router.push(
        {
          pathname: "/chat",
          params: friendDetail
        }
      )}>
      {
        avatar ?
          <Image
            source={{ uri: `http://192.168.1.4:8080/Genie/AvatarImages/${othermobile}.png` }}
            style={styles.avatar}
          />
          :
          <View style={styles.avatarLetterView} >
            <Text style={styles.avatarText}>{avatarLetters}</Text>

          </View>
      }

      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{name}</Text>
        <View style={styles.chatMessageView}>
          {chatStatus ? (
            <Ionicons name="checkmark-done-sharp" size={18} color="#4FB6EC" />
          ) : (
            <Ionicons name="checkmark-outline" size={24} color="gray" />
          )}
          <Text style={styles.chatMessage}>{message}</Text>
        </View>
      </View>
      <Text style={styles.chatTime}>{time}</Text>
    </TouchableOpacity>
  );

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.headerText}>GENIE</Text>

          <Menu>
            <MenuTrigger>
              <View style={styles.dotIconView}>
                <Entypo style={styles.dotIcon} name="dots-three-vertical" size={24} color="white" />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>



              <View style={styles.menuContent}>
                <MenuOption onSelect={async () => {
                  await AsyncStorage.removeItem('user');
                  router.replace("signin");
                }
                } style={styles.blockUserOption}>
                  <Text style={styles.blockUserText}>Logout</Text>
                </MenuOption>

              </View>
            </MenuOptions>
          </Menu>
        </View>

        <FlashList
          data={getChatArrary}
          keyExtractor={(item) => item.other_user_ID}
          renderItem={({ item }) => (
            <RenderItem
              name={item.other_user_name}
              message={item.message}
              time={item.dateTime}
              avatar={item.avatar_image_found}
              othermobile={item.otherMobile}
              avatarLetters={item.other_user_avatar}
              chatStatus={item.chat_status}
              friendDetail={item}
            />
          )}
          estimatedItemSize={200}
        />

        {/* Modal Start */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="closecircle" size={30} color={accentColor1} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Search Your Favorite Friends</Text>
              <TextInput
                keyboardType='phone-pad'
                maxLength={10}
                onChangeText={async (text) => {
                  if (text.length === 10) {
                    try {
                      let response = await fetch(`http://192.168.1.4:8080/Genie/SearchFriends?mobile=${text}`);
                      const data = await response.json();

                      console.log(data);
                      setName(data.name);
                      setMobile(data.mobile);
                      setID(data.id);
                      setAvatarStatus(data.avatar_image_found);
                      setavatarLetters(data.avatar_letters);
                    } catch (error) {
                      console.error('Fetch error:', error);
                    }
                  } else {

                    setName("User");
                    setMobile(text);
                    setID(null);
                    setAvatarStatus(false);
                    setavatarLetters("DN");
                  }
                }}
                style={styles.searchBar}
                placeholder='Enter mobile number'
                placeholderTextColor="#888"
              />

              <View style={styles.friendView}>
                {
                  getMobile && getMobile.length === 10 ? (
                    getAvatarStatus ? (
                      <Image source={{ uri: `http://192.168.1.4:8080/Genie/AvatarImages/${getMobile}.png` }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarLetterView}>
                        <Text style={styles.avatarText}>{getavatarLetters}</Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.avatarLetterView}>
                      <Image source={avatar} style={styles.avatar} />
                    </View>
                  )
                }

                <View style={styles.textIconWrapper}>
                  <Text style={styles.friendName}>{getMobile && getMobile.length === 10 ? getName : "User"}</Text>
                  <TouchableOpacity style={styles.addIcon} onPress={async () => {
                    try {
                      let response = await fetch(`http://192.168.1.4:8080/Genie/AddFriends?fid=${getID}&mid=${getMeID}`);
                      const data = await response.json();

                      if (data.message) {
                        let response = await fetch(`http://192.168.1.4:8080/Genie/LoadHomeData?id=${getMeID}`);
                        if (response.ok) {
                          let json = await response.json();
                          if (json.success) {
                            setChatArray(json.jsonChatArray);
                            setName("");
                            setMobile("");
                            setModalVisible(false);
                          } else {
                            console.log(json);
                          }
                        }
                      } else {

                      }
                    } catch (error) {
                      console.error('Fetch error:', error);
                    }
                  }}>
                    <AntDesign name="adduser" size={24} color={mainColor} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal End */}



        <Pressable style={styles.fab}>
          <Ionicons name="add" size={30} color="white" onPress={() => setModalVisible(true)} />
        </Pressable>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: accentColor1,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: 'center',
    width: "100%",
  },
  headerText: {
    color: mainColor,
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "gray",
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
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontFamily: "bold",
    fontSize: fontSizeBodyText,
  },
  chatMessage: {
    color: '#888',
    fontSize: 16,
    paddingLeft: 10,
  },
  chatTime: {
    color: '#888',
    fontSize: 14,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: accentColor1,
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 15,
  },
  friendName: {
    fontSize: 18,
    fontFamily: "bold",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 18,
  },
  friendView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10,
  },
  addIcon: {
    backgroundColor: accentColor1,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 40, // Adjusted size
    height: 40, // Adjusted size
    resizeMode: 'contain',
  },

  dotIconView: {
    marginLeft: 260,
  },
  chatMessageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContent: {
    padding: 10,
  },
  blockUserOption: {
    padding: 10,
  },
  blockUserText: {
    color: 'red',
  },
});

const optionsStyles = {
  optionsContainer: {
    padding: 10,
    backgroundColor: mainColor,
    marginLeft: 100,
  },
};

export default ChatApp;
