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
        return "text-amber-400";
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
    <div className="w-full bg-black/30 border-t border-[rgba(180,140,80,0.2)]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800/50">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Combat Log
        </span>
      </div>
      <div
        ref={scrollRef}
        className="combat-log-entries overflow-y-auto px-4 py-2"
        style={{ maxHeight: "100px" }}
      >
        {entries.length === 0 ? (
          <div className="text-gray-600 text-xs italic">
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
