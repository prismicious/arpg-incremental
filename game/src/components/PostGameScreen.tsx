import React from "react";
import type { InventoryItemUnion } from "../types/interfaces/character";
import type { Character } from "../types/models/character-class";

interface PostGameScreenProps {
  lootCollected: InventoryItemUnion[];
  goldEarned: number;
  character: Character;
  previousLevel: number;
  onContinue: () => void;
  onWaveSelect: () => void;
  spritePath: string;
}

const tierBorderColors: Record<string, string> = {
  wood: "border-amber-600",
  iron: "border-slate-300",
  gold: "border-yellow-400",
  diamond: "border-cyan-400",
  none: "border-zinc-600",
};

export const PostGameScreen: React.FC<PostGameScreenProps> = ({
  lootCollected,
  goldEarned,
  character,
  previousLevel,
  onContinue,
  onWaveSelect,
  spritePath,
}) => {
  const leveledUp = character.level > previousLevel;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h2 className="text-3xl font-bold text-green-400">Exploration Successful</h2>

      {/* Stats Summary */}
      <div className="flex items-center gap-6">
        {/* Gold with coin symbol */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xl">&#x1FA99;</span>
          <span className="text-2xl font-bold text-white">+{goldEarned}</span>
        </div>

        {/* Level up indicator */}
        {leveledUp && (
          <div className="flex items-center gap-1 bg-violet-500/20 px-3 py-1 rounded-full">
            <span className="text-lg font-bold text-violet-300">Lv.{character.level}</span>
            <span className="text-violet-400 text-xl">↑</span>
          </div>
        )}
      </div>

      {/* Loot Section - just icons */}
      {lootCollected.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {lootCollected.map((item) => {
            const tier = item.tier || "none";
            return (
              <div
                key={item.id}
                className={`w-14 h-14 rounded-lg border-2 ${tierBorderColors[tier]} bg-black/40 flex items-center justify-center`}
              >
                <img
                  src={`${spritePath}/${item.sprite}`}
                  alt="Loot"
                  className="w-10 h-10 object-contain"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="game-button" onClick={onContinue}>
          Continue
        </button>
        <button className="modern-button-secondary" onClick={onWaveSelect}>
          Wave Select
        </button>
      </div>
    </div>
  );
};

export default PostGameScreen;
