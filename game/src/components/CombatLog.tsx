import React, { useEffect, useRef } from "react";

export interface CombatLogEntry {
  id: number;
  type: "player-attack" | "enemy-attack" | "enemy-killed" | "player-died" | "loot" | "gold" | "crit";
  message: string;
  damage?: number;
}

interface CombatLogProps {
  entries: CombatLogEntry[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const getEntryColor = (type: CombatLogEntry["type"]) => {
    switch (type) {
      case "player-attack":
        return "text-zinc-300";
      case "enemy-attack":
        return "text-red-400";
      case "enemy-killed":
        return "text-green-400";
      case "player-died":
        return "text-red-500 font-bold";
      case "loot":
        return "text-purple-400";
      case "gold":
        return "text-yellow-400";
      case "crit":
        return "text-orange-400 font-bold";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="mx-4 mb-4 bg-black/40 border border-zinc-800 rounded-sm">
      <div
        ref={scrollRef}
        className="combat-log-entries overflow-y-auto px-3 py-2"
        style={{ maxHeight: "80px" }}
      >
        {entries.length === 0 ? (
          <div className="text-zinc-600 text-xs italic">
            Waiting for combat...
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`text-xs py-0.5 leading-relaxed ${getEntryColor(entry.type)}`}
            >
              {entry.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CombatLog;
