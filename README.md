
# 🐾 Pet Shop Mobile Application

A React Native application for browsing and managing pet listings with shopping cart functionality.

## 📱 Platform Support

- **Android**: API Level 21+ (Android 5.0+)

## ✨ Features

- Browse pet listings with images, details, and pricing
- Add new pets with camera/gallery photos
- Shopping cart with quantity management
- Persistent data storage (survives app restarts)
- Pull-to-refresh functionality
- Random pet images from Unsplash API

## 🏗️ Tech Stack

### Core
- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation (Stack + Bottom Tabs)

### State Management
- **Zustand** - Global state management
- **AsyncStorage** - Local data persistence

### Form Handling
- **React Hook Form** - Form management
- **Yup** - Schema validation

### Other Libraries
- **react-native-image-picker** - Camera/Gallery access

## 📚 Third-Party APIs

**Unsplash API** - Random pet images
- Free high-quality pet photos
- No authentication required
- CDN-backed for fast loading

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Android Studio
- JDK 11+
- Android SDK (API 21+)

### Installation

1. **Clone and install**
```bash
git clone <repository-url>
cd pet-shop-app
npm install
```

2. **Configure Android permissions**

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.INTERNET" />
```

3. **Run the app**

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

## 📁 Project Structure

```
src/
├── screens/          # App screens (PetListing, PetUpload, Cart)
├── navigation/       # Navigation config
├── store/           # Zustand stores (petStore, cartStore)
├── services/        # API services
└── types/           # TypeScript types
```

## 🔧 Build for Production

**Generate APK:**
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

**Generate AAB (Play Store):**
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 🐛 Common Issues

**Camera not working**
- Add permissions to AndroidManifest.xml
- Check app permissions in device settings
- Rebuild: `npm run android`

**Data not persisting**
- Clear app data and reinstall
- Check AsyncStorage installation

**Build errors**
- Clean build: `cd android && ./gradlew clean`
- Reset Metro: `npm start -- --reset-cache`

## 📄 License

MIT License

---

**Built with React Native**
