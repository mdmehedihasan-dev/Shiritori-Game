import React, { useState, useEffect, useRef } from "react";
import GameRulesModal from "./GameRulesModal"; 

const ShiritoriGame = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [wordHistory, setWordHistory] = useState(["START"]);
  const [currentWord, setCurrentWord] = useState("START");
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [inputValue, setInputValue] = useState("");
  const [rulesModalOpen, setRulesModalOpen] = useState(false); 

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!gameActive) return;
    setTimeLeft(30);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentPlayer, gameActive]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleTimeout = () => {
    setScores((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] - 1,
    }));
    showMessage(`Player ${currentPlayer} ran out of time! -1 point`, "error");
    switchPlayer();
  };

  const validateWord = async (word) => {
    if (word.length < 4) {
      showMessage("Word must be at least 4 letters long!", "error");
      return false;
    }
    if (wordHistory.map((w) => w.toLowerCase()).includes(word)) {
      showMessage("Word has already been used!", "error");
      return false;
    }
    const lastLetter = currentWord.slice(-1).toLowerCase();
    if (word[0] !== lastLetter) {
      showMessage(
        `Word must start with '${lastLetter.toUpperCase()}'!`,
        "error"
      );
      return false;
    }

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (res.ok) {
        const data = await res.json();
        return data && data.length > 0;
      } else {
        showMessage("Word not found in dictionary!", "error");
        return false;
      }
    } catch (err) {
      console.error("Dictionary API error:", err);
      return true; 
    }
  };

  const submitWord = async () => {
    if (!gameActive) return;
    const word = inputValue.trim().toLowerCase();
    if (!word) {
      showMessage("Please enter a word!", "error");
      return;
    }

    setInputValue("");
    const isValid = await validateWord(word);
    if (isValid) {
      clearInterval(timerRef.current);
      let points = 1;
      if (timeLeft > 20) points = 3;
      else if (timeLeft > 10) points = 2;

      setScores((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + points,
      }));
      setCurrentWord(word.toUpperCase());
      setWordHistory((prev) => [...prev, word.toUpperCase()]);
      showMessage(`Valid word! +${points} points`, "success");
      switchPlayer();
    } else {
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] - 1,
      }));
      showMessage("Invalid word! -1 point", "error");
      inputRef.current.focus();
    }
  };

  const switchPlayer = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setWordHistory(["START"]);
    setCurrentWord("START");
    setGameActive(true);
    setInputValue("");
    showMessage("Game reset! Good luck!", "info");
  };

  const showRules = () => {
    setRulesModalOpen(true); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      {/*========================== Header========================== */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">
          Shiritori Game
        </h1>
        <p className="text-lg text-gray-600">
          Two players, one screen, endless fun!
        </p>
      </div>

      {/*========================= Players ===========================*/}
      <div className="flex gap-6 mb-8">
        {[1, 2].map((p) => (
          <div
            key={p}
            className={`rounded-2xl shadow-lg p-6 w-48 text-center transition transform ${
              currentPlayer === p
                ? "bg-purple-600 text-white scale-105"
                : "bg-white"
            }`}
          >
            <div className="font-semibold text-lg">Player {p}</div>
            <div className="text-3xl font-bold my-2">{scores[p]}</div>
            <div className="text-sm">
              {currentPlayer === p ? `Time: ${timeLeft}s` : "Waiting..."}
            </div>
          </div>
        ))}
      </div>

      {/*=============================== Current Word ==========================*/}
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md text-center mb-6">
        <div className="text-gray-500">Previous Word:</div>
        <div className="text-3xl font-bold text-purple-700">{currentWord}</div>
      </div>

      {/*============================== Input ================================*/}
      <div className="flex gap-3 w-full max-w-md mb-6">
        <input
          type="text"
          ref={inputRef}
          className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toLowerCase())}
          placeholder={`Enter a word that starts with '${currentWord.slice(
            -1
          )}'...`}
          onKeyPress={(e) => e.key === "Enter" && submitWord()}
          maxLength={50}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          onClick={submitWord}
        >
          Submit
        </button>
      </div>

      {/*======================= Messages================== */}
      {message.text && (
        <div
          className={`mb-6 px-4 py-2 rounded-lg shadow ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* =======================Word History =======================*/}
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-6">
        <h3 className="text-lg font-semibold mb-3">Word History</h3>
        <div className="flex flex-wrap gap-2">
          {wordHistory.map((word, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/*============================ button =======================*/}
      <div className="flex gap-4">
        <button
          className="bg-green-500 px-4 py-2 rounded-lg shadow hover:bg-green-300 transition"
          onClick={resetGame}
        >
           Reset Game
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded-lg shadow hover:bg-red-400 transition"
          onClick={showRules}
        >
           Game Rules
        </button>
      </div>

      {/*=================== Rules Modal ================= */}
      <GameRulesModal isOpen={rulesModalOpen} onClose={() => setRulesModalOpen(false)} />
    </div>
  );
};

export default ShiritoriGame;
