
# BovControl Challenge app

This is a React Native app that manages checklists for farmers, allowing users to create, view, update, and delete checklists. The app integrates with a backend API and RealmDB to handle data both online and offline. The interface is styled using `styled-components` with theme support for light and dark modes.

![App in use](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXRpcGExMXZ1dHFnNGk0dHBmYnc2OXNyY2xjZ2lwOHdocjAza2wydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5O2MH4t5qzL5X6G4c3/giphy.gif)

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Styling](#styling)
- [Offline Data Storage](#offline-data-storage)

## Features
- **Authentication:** Supports Google OAuth for user authentication.
- **Checklist Management:** Create, view, update, and delete checklists.
- **Offline Support:** Utilizes RealmDB for offline data storage and synchronization with the backend when online.
- **Dynamic Styling:** Supports light and dark themes using `styled-components`.
- **Collapsible Views:** Allows collapsing of checklist items to show/hide details.

## Prerequisites
- Node.js (>=14.x)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode for mobile emulation

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/checklist-app.git
   cd checklist-app
   ```

2. Install the project dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Install the Expo CLI globally if you haven't already:
   ```bash
   npm install -g expo-cli
   ```

3.5. Might be necessary to install the app to be able to run it in dev mode with ReactDB integrated
   ```bash
   npx expo run:android or npx expo run:ios
   ```

4. Install the app in development mode on the emulator:
   - Open your emulator (Android Studio or Xcode).
   - Run the following command to start the project:
     ```bash
     npx expo start --dev-client
     ```

5. When the QR code appears in the terminal, use the emulator to scan it or select the correct option in the terminal to install the app on the emulated device.

## Usage
1. Start the Expo development server in dev client mode:
   ```bash
   npx expo start --dev-client
   ```
   - Make sure your emulator is running. If you already have the app installed in the emulator, it will launch the app in development mode.

2. Log in using Google OAuth if authentication is enabled.

3. Use the app to create, view, update, and delete checklists. The app supports offline mode, syncing data when a connection is available.

## Project Structure
```
+---app
|   +---(tabs)
|   |       explore.tsx
|   |       index.tsx
|   |       _layout.tsx
|   +---_layout.tsx
|   +---html.tsx
|   +---not-found.tsx
+---assets
|   +---fonts
|   +---images
+---components
|   +---navigation
|   +---__tests__
|   +---Button.tsx
|   +---HelloWave.tsx
|   +---ThemedText.tsx
|   +---ThemedView.tsx
+---constants
|   +---theme.ts
+---hooks
|   +---useThemeColor.ts
|   +---useColorScheme.ts
+---services
|   +---apiService.ts
|   +---realmDB.ts
+---styles
|   +---styles.ts
```

### Styling
- Uses `styled-components` for styling with support for light and dark themes.
- `ThemedText` supports dynamic color changes based on the current theme and custom colors.

### Offline Data Storage
The app uses RealmDB to store checklist data locally, allowing for offline access. Data is synchronized with the backend when the app detects an active internet connection.
