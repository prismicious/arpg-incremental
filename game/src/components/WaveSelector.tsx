import React from "react";
import type { WaveDefinition } from "../game/prefabs/prefabs";

interface WaveSelectorProps {
  waves: WaveDefinition[];
  selectedWave: number;
  completedWaves: number[]; // Track which waves have been completed
  onSelectWave: (waveId: number) => void;
  onStartWave: () => void;
}

export const WaveSelector: React.FC<WaveSelectorProps> = ({
  waves,
  selectedWave,
  completedWaves,
  onSelectWave,
  onStartWave,
}) => {
  const selected = waves.find(w => w.id === selectedWave);
  const isCompleted = (waveId: number) => completedWaves.includes(waveId);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Top bar - edge to edge transparent */}
      <div className="bg-black/50 backdrop-blur-sm px-4 py-3 flex items-center gap-4">
        {/* Small wave buttons in top left */}
        <div className="flex gap-1.5">
          {waves.map((wave) => (
            <button
              key={wave.id}
              className={`
                w-9 h-9 rounded-md border transition-all relative text-sm font-bold
                ${wave.unlocked
                  ? selectedWave === wave.id
                    ? "border-amber-400 bg-amber-900/50 text-amber-300"
                    : isCompleted(wave.id)
                      ? "border-green-600/60 bg-green-900/30 text-green-400"
                      : "border-zinc-600 bg-zinc-800/50 text-gray-300 hover:border-zinc-500"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
                }
              `}
              onClick={() => wave.unlocked && onSelectWave(wave.id)}
              disabled={!wave.unlocked}
            >
              {isCompleted(wave.id) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white">✓</span>
                </div>
              )}
              {wave.unlocked ? wave.id : "🔒"}
            </button>
          ))}
        </div>
      </div>

      {/* Center title */}
      {selected && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1
            className="text-4xl font-bold mb-2 drop-shadow-lg"
            style={{ color: selected.theme.accent, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {selected.name}
          </h1>
          <p className="text-gray-300 mb-6 drop-shadow">{selected.description}</p>
          <button
            className="game-button px-10 py-3 text-lg"
            onClick={onStartWave}
            disabled={!selected?.unlocked}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
};

export default WaveSelector;
