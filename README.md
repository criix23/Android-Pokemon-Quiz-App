# 🎶 Pokémon Cry Quiz App

A mobile application built with React Native and Expo that tests your knowledge of Pokémon cries. Listen to a cry and guess which Pokémon it belongs to!

![App in use](app.gif)

## 💾 Download

[Download the latest APK here.](./PokemonSoundQuiz.apk)


## 📜 Description

This project is a fun, interactive quiz game for Pokémon fans. The app plays a random Pokémon's cry, and the player must choose the correct Pokémon from a set of four options. The game is designed to be engaging, with a clean user interface, animations, and streak tracking to challenge the player.

The app fetches Pokémon data and cries from the [PokéAPI](https://pokeapi.co/) and other online sources, ensuring a wide variety of questions.

## ✨ Features

- **Guess the Pokémon:** Listen to a Pokémon's cry and select the correct answer from four options.
- **Generation Selection:** Choose to be quizzed on Pokémon from a specific generation (1 through 8).
- **Streak Tracking:** The app keeps track of your consecutive correct answers to challenge you.
- **Dynamic UI:** The background wallpaper changes based on the selected generation.
- **Sound and Animations:** Engaging animations and sound effects for a better user experience.
- **Preloading:** The next question's data is preloaded for a seamless transition between rounds.
- **Fallback Audio:** If a Pokémon cry is unavailable from the primary source, it attempts to load from a secondary source.



## 🛠️ Technologies Used

- **React Native:** Core framework for building the mobile application.
- **Expo:** A framework and platform for universal React applications, used to streamline development.
- **TypeScript:** For static typing and improved developer experience.
- **Expo Router:** For file-based navigation between screens.
- **Zustand:** A small, fast, and scalable state management solution.
- **Expo AV:** Used for playing the Pokémon cry audio.
- **PokéAPI:** The primary source for Pokémon data and sprites.
- **Tailwind CSS (NativeWind):** For styling the application.

## 🚀 Getting Started

To run this project locally, you will need to have Node.js, npm/yarn, and the Expo Go app on your mobile device.

### Prerequisites

- Node.js (LTS version recommended)
- Expo Go app installed on your iOS or Android device.
- A code editor like Visual Studio Code.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd "Pokemon Cry Quiz App"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

4.  **Open in Expo Go:**
    - A QR code will be displayed in your terminal.
    - Open the Expo Go app on your phone and scan the QR code to launch the application.
