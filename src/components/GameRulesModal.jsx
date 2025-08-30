import React from "react";

const GameRulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 max-w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-purple-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-purple-700"> Game Rules</h2>
        <ul className="text-gray-700 text-sm space-y-2 list-disc pl-4">
          <li>Players take turns entering words</li>
          <li>Each word must start with the last letter of the previous word</li>
          <li>Words must be at least 4 letters long</li>
          <li>Words cannot be repeated</li>
          <li>Words must be valid English words</li>
          <li>Players have 30 seconds per turn</li>
          <li>
            Scoring:
            <ul className="list-none pl-4">
              <li>• 20+ seconds left: +3 points</li>
              <li>• 10–20 seconds left: +2 points</li>
              <li>• 0–10 seconds left: +1 point</li>
              <li>• Invalid or timeout: -1 point</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GameRulesModal;
