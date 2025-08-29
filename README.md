# Shiritori Game

A two-player Shiritori word game built with **React** and **Vite**, styled using **Tailwind CSS**.

## Features

- 🎮 Two players take turns entering words.
- ⏱️ 30-second timer per turn.
- 📝 Words must start with the last letter of the previous word.
- 📚 Words must be valid English words (checked via dictionary API).
- 🚫 No repeats, minimum 4 letters per word.
- 🏆 Scoring based on speed and correctness.
- 📜 Game rules modal and reset functionality.
- ⚡ Fast development with Vite and hot module replacement.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone this repository:
   ```sh
   git clone <repository-url>
   cd task

   npm install
# or
yarn install 

npm run dev
# or
yarn dev

Open http://localhost:5173 in your browser.
Project Structure

├── public/                # Static assets
├── src/
│   ├── assets/            # Images and icons
│   ├── components/        # React components
│   │   ├── [GameRulesModal.jsx](http://_vscodecontentref_/0)
│   │   └── [ShiritoriGame.jsx](http://_vscodecontentref_/1)
│   ├── [App.jsx](http://_vscodecontentref_/2)            # App entry
│   ├── [index.css](http://_vscodecontentref_/3)          # Tailwind CSS import
│   └── [main.jsx](http://_vscodecontentref_/4)           # React DOM render
├── [index.html](http://_vscodecontentref_/5)
├── [package.json](http://_vscodecontentref_/6)
├── [vite.config.js](http://_vscodecontentref_/7)
└── [README.md](http://_vscodecontentref_/8)
