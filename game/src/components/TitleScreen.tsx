import React from "react";

interface TitleScreenProps {
  onStart: () => void;
  onOptions: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOptions }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
    <div className="mb-12 text-5xl font-extrabold text-gray-200 drop-shadow-lg tracking-widest">
      ARPG Incremental
    </div>
    <div className="flex flex-col gap-6 w-64">
      <button
        className="px-8 py-4 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-gray-200 font-bold uppercase tracking-wide shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-none border border-gray-600 text-xl"
        onClick={onStart}
      >
        Start Game
      </button>
      <button
        className="px-8 py-4 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-gray-200 font-bold uppercase tracking-wide shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-none border border-gray-600 text-xl"
        onClick={onOptions}
      >
        Options
      </button>
    </div>
  </div>
);

export default TitleScreen;
