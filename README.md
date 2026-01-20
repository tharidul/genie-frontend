# Genie

Genie is a React Native chat application built with Expo and Expo Router. It provides a simple messaging experience with authentication, chat lists, and one-to-one conversations, designed to run on iOS, Android, and the web.

## Features

- Welcome/onboarding screen
- Sign up and sign in flows
- Chat list with recent messages and delivery status
- Add friends by mobile number
- One-to-one chat view with message sending
- Avatar support with fallback initials

## Tech Stack

- [Expo](https://expo.dev/) (SDK 51)
- React 18 + React Native 0.74
- Expo Router for navigation
- AsyncStorage for local persistence
- FlashList for high-performance lists
- Lottie for animations

## Prerequisites

- Node.js and npm
- Expo Go app on a device **or** Android Studio/Xcode simulators

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the backend API base URL.

   The app currently calls a local backend at `http://192.168.1.4:8080/Genie`. Update the URLs in the files below to point at your own server:

   - `app/home.js`
   - `app/chat.js`

3. Start the Expo development server:

   ```bash
   npm run start
   ```

4. Run the app on a platform of your choice:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

   Then follow the Expo CLI instructions (scan the QR code with Expo Go or open the simulator).

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Start the Expo dev server |
| `npm run android` | Launch on Android emulator/device |
| `npm run ios` | Launch on iOS simulator/device |
| `npm run web` | Launch in the browser |

## Project Structure

```
app/
  index.js       # Welcome screen
  signin.js      # Sign in screen
  signup.js      # Sign up screen
  home.js        # Chat list + add friends
  chat.js        # Chat conversation
  settings.js    # Settings screen
  test.js        # Test screen
assets/
  fonts/         # Custom fonts
  images/        # Icons, avatars, background
app.json         # Expo configuration
```

## Notes

- This project uses Expo's managed workflow; native builds should be done using Expo tooling.
- Make sure your backend API is reachable from the device/simulator running the app.
